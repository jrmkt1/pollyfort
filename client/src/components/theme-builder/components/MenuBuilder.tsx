import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  Move, 
  ChevronDown, 
  ChevronRight, 
  Menu,
  Settings,
  Palette,
  Layout
} from 'lucide-react';
import { MenuConfig, MenuItem } from '../types';

interface MenuBuilderProps {}

export function MenuBuilder({}: MenuBuilderProps) {
  const [menus, setMenus] = useState<MenuConfig[]>([
    {
      id: 'main-menu',
      name: 'Menu Principal',
      items: [
        { id: '1', label: 'Home', url: '/', children: [] },
        { id: '2', label: 'Produtos', url: '/produtos', children: [] },
        { id: '3', label: 'Sobre', url: '/sobre-nos', children: [] },
        { id: '4', label: 'Contato', url: '/contatos', children: [] }
      ],
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        hoverColor: '#3b82f6',
        fontSize: '16px',
        fontWeight: '500',
        spacing: '24px',
        alignment: 'left'
      }
    }
  ]);
  
  const [selectedMenuId, setSelectedMenuId] = useState<string>('main-menu');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const selectedMenu = menus.find(m => m.id === selectedMenuId);

  const createNewMenu = () => {
    const newMenu: MenuConfig = {
      id: `menu_${Date.now()}`,
      name: 'Novo Menu',
      items: [],
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        hoverColor: '#3b82f6',
        fontSize: '16px',
        fontWeight: '500',
        spacing: '24px',
        alignment: 'left'
      }
    };
    setMenus([...menus, newMenu]);
    setSelectedMenuId(newMenu.id);
  };

  const updateMenu = (updates: Partial<MenuConfig>) => {
    setMenus(menus.map(menu => 
      menu.id === selectedMenuId 
        ? { ...menu, ...updates }
        : menu
    ));
  };

  const addMenuItem = (parentId?: string) => {
    if (!selectedMenu) return;
    
    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      label: 'Novo Item',
      url: '#',
      children: []
    };

    if (parentId) {
      // Add as submenu item
      const updateItemsRecursively = (items: MenuItem[]): MenuItem[] => {
        return items.map(item => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), newItem]
            };
          }
          if (item.children) {
            return {
              ...item,
              children: updateItemsRecursively(item.children)
            };
          }
          return item;
        });
      };
      
      updateMenu({
        items: updateItemsRecursively(selectedMenu.items)
      });
    } else {
      // Add as top-level item
      updateMenu({
        items: [...selectedMenu.items, newItem]
      });
    }
  };

  const deleteMenuItem = (itemId: string) => {
    if (!selectedMenu) return;
    
    const removeItemRecursively = (items: MenuItem[]): MenuItem[] => {
      return items.filter(item => {
        if (item.id === itemId) return false;
        if (item.children) {
          item.children = removeItemRecursively(item.children);
        }
        return true;
      });
    };

    updateMenu({
      items: removeItemRecursively(selectedMenu.items)
    });
  };

  const updateMenuItem = (itemId: string, updates: Partial<MenuItem>) => {
    if (!selectedMenu) return;
    
    const updateItemsRecursively = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => {
        if (item.id === itemId) {
          return { ...item, ...updates };
        }
        if (item.children) {
          return {
            ...item,
            children: updateItemsRecursively(item.children)
          };
        }
        return item;
      });
    };

    updateMenu({
      items: updateItemsRecursively(selectedMenu.items)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Criador de Menus</h3>
        <Button size="sm" onClick={createNewMenu}>
          <Plus className="h-4 w-4 mr-1" />
          Novo Menu
        </Button>
      </div>

      {/* Menu Selector */}
      <div>
        <Label className="text-xs">Menu Atual</Label>
        <Select value={selectedMenuId} onValueChange={setSelectedMenuId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {menus.map(menu => (
              <SelectItem key={menu.id} value={menu.id}>
                {menu.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedMenu && (
        <Tabs defaultValue="structure" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="structure">Estrutura</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="style">Estilo</TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-4">
            <MenuStructure 
              menu={selectedMenu}
              onAddItem={addMenuItem}
              onDeleteItem={deleteMenuItem}
              onEditItem={setEditingItem}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <MenuSettings 
              menu={selectedMenu}
              onUpdate={updateMenu}
            />
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <MenuStyleSettings 
              menu={selectedMenu}
              onUpdate={updateMenu}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <ItemEditor
          item={editingItem}
          onSave={(updates) => {
            updateMenuItem(editingItem.id, updates);
            setEditingItem(null);
          }}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}

function MenuStructure({ 
  menu, 
  onAddItem, 
  onDeleteItem, 
  onEditItem 
}: {
  menu: MenuConfig;
  onAddItem: (parentId?: string) => void;
  onDeleteItem: (itemId: string) => void;
  onEditItem: (item: MenuItem) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm">Itens do Menu</Label>
        <Button size="sm" variant="outline" onClick={() => onAddItem()}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Item
        </Button>
      </div>

      <div className="space-y-2">
        {menu.items.map((item, index) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            level={0}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
            onAddChild={onAddItem}
          />
        ))}
        
        {menu.items.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <Menu className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Nenhum item no menu</p>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => onAddItem()}>
              Adicionar Primeiro Item
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItemComponent({
  item,
  level,
  onEdit,
  onDelete,
  onAddChild
}: {
  item: MenuItem;
  level: number;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onAddChild: (parentId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="space-y-1">
      <div 
        className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
        style={{ marginLeft: `${level * 20}px` }}
      >
        {item.children && item.children.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{item.label}</div>
          <div className="text-xs text-gray-500 truncate">{item.url}</div>
        </div>

        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => onAddChild(item.id)}>
            <Plus className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => onEdit(item)}>
            <Settings className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-6 w-6 p-0 text-red-600 hover:text-red-700" 
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {isExpanded && item.children && item.children.length > 0 && (
        <div className="space-y-1">
          {item.children.map((child) => (
            <MenuItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MenuSettings({ 
  menu, 
  onUpdate 
}: {
  menu: MenuConfig;
  onUpdate: (updates: Partial<MenuConfig>) => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Nome do Menu</Label>
            <Input
              value={menu.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Nome do menu"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Configurações de Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Alinhamento</Label>
            <Select 
              value={menu.styles.alignment || 'left'} 
              onValueChange={(value: any) => onUpdate({
                styles: { ...menu.styles, alignment: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-xs">Espaçamento entre Items</Label>
            <Input
              value={menu.styles.spacing || ''}
              onChange={(e) => onUpdate({
                styles: { ...menu.styles, spacing: e.target.value }
              })}
              placeholder="24px"
            />
          </div>

          <div>
            <Label className="text-xs">Breakpoint Mobile</Label>
            <Input
              value={menu.styles.mobileBreakpoint || ''}
              onChange={(e) => onUpdate({
                styles: { ...menu.styles, mobileBreakpoint: e.target.value }
              })}
              placeholder="768px"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MenuStyleSettings({ 
  menu, 
  onUpdate 
}: {
  menu: MenuConfig;
  onUpdate: (updates: Partial<MenuConfig>) => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Cores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Cor de Fundo</Label>
            <Input
              type="color"
              value={menu.styles.backgroundColor || '#ffffff'}
              onChange={(e) => onUpdate({
                styles: { ...menu.styles, backgroundColor: e.target.value }
              })}
            />
          </div>
          
          <div>
            <Label className="text-xs">Cor do Texto</Label>
            <Input
              type="color"
              value={menu.styles.textColor || '#1f2937'}
              onChange={(e) => onUpdate({
                styles: { ...menu.styles, textColor: e.target.value }
              })}
            />
          </div>

          <div>
            <Label className="text-xs">Cor do Hover</Label>
            <Input
              type="color"
              value={menu.styles.hoverColor || '#3b82f6'}
              onChange={(e) => onUpdate({
                styles: { ...menu.styles, hoverColor: e.target.value }
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Tipografia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Tamanho da Fonte</Label>
            <Input
              value={menu.styles.fontSize || ''}
              onChange={(e) => onUpdate({
                styles: { ...menu.styles, fontSize: e.target.value }
              })}
              placeholder="16px"
            />
          </div>
          
          <div>
            <Label className="text-xs">Peso da Fonte</Label>
            <Select 
              value={menu.styles.fontWeight || 'normal'} 
              onValueChange={(value) => onUpdate({
                styles: { ...menu.styles, fontWeight: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="500">Médio</SelectItem>
                <SelectItem value="600">Semi-negrito</SelectItem>
                <SelectItem value="bold">Negrito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ItemEditor({ 
  item, 
  onSave, 
  onCancel 
}: {
  item: MenuItem;
  onSave: (updates: Partial<MenuItem>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    label: item.label,
    url: item.url,
    target: item.target || '_self',
    description: item.description || '',
    icon: item.icon || ''
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-lg">Editar Item do Menu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Rótulo</Label>
            <Input
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Nome do item"
            />
          </div>
          
          <div>
            <Label>URL</Label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="/pagina ou https://exemplo.com"
            />
          </div>

          <div>
            <Label>Abrir em</Label>
            <Select 
              value={formData.target} 
              onValueChange={(value) => setFormData({ ...formData, target: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_self">Mesma janela</SelectItem>
                <SelectItem value="_blank">Nova janela</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Descrição (opcional)</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição para mega menus"
            />
          </div>

          <div>
            <Label>Ícone (opcional)</Label>
            <Input
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Nome do ícone"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Salvar
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}