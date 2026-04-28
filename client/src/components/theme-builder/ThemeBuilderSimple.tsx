import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Type, 
  Image, 
  Layout, 
  Monitor, 
  Smartphone, 
  Tablet,
  Plus,
  Save,
  Eye,
  Settings,
  Trash2,
  Palette
} from 'lucide-react';
import { ColorPaletteGenerator } from './components/ColorPaletteGenerator';

interface Element {
  id: string;
  type: 'text' | 'heading' | 'image' | 'button' | 'container';
  content: string;
  styles: Record<string, string>;
}

export default function ThemeBuilderSimple() {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('elements');

  const addElement = (type: Element['type']) => {
    const newElement: Element = {
      id: `${type}_${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type)
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
  };

  const getDefaultContent = (type: Element['type']) => {
    switch (type) {
      case 'text': return 'Este é um texto de exemplo';
      case 'heading': return 'Título Principal';
      case 'button': return 'Clique Aqui';
      case 'image': return 'https://via.placeholder.com/300x200';
      case 'container': return '';
      default: return '';
    }
  };

  const getDefaultStyles = (type: Element['type']) => {
    const baseStyles = {
      padding: '16px',
      margin: '8px',
      borderRadius: '4px'
    };

    switch (type) {
      case 'text':
        return { ...baseStyles, fontSize: '16px', color: '#333333' };
      case 'heading':
        return { ...baseStyles, fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' };
      case 'button':
        return { ...baseStyles, backgroundColor: '#3b82f6', color: '#ffffff', cursor: 'pointer' };
      case 'image':
        return { ...baseStyles, width: '300px', height: '200px' };
      case 'container':
        return { ...baseStyles, backgroundColor: '#f3f4f6', minHeight: '100px' };
      default:
        return baseStyles;
    }
  };

  const updateElement = (id: string, updates: Partial<Element>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
    
    if (selectedElement?.id === id) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const updateElementStyle = (id: string, styleProp: string, value: string) => {
    updateElement(id, {
      styles: {
        ...selectedElement?.styles,
        [styleProp]: value
      }
    });
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
  };

  const getDeviceWidth = () => {
    switch (deviceMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };

  const renderElement = (element: Element) => {
    const commonProps = {
      key: element.id,
      onClick: () => setSelectedElement(element),
      style: element.styles,
      className: `cursor-pointer border-2 transition-colors ${
        selectedElement?.id === element.id 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-transparent hover:border-gray-300'
      }`
    };

    switch (element.type) {
      case 'text':
        return <p {...commonProps}>{element.content}</p>;
      case 'heading':
        return <h2 {...commonProps}>{element.content}</h2>;
      case 'button':
        return <button {...commonProps}>{element.content}</button>;
      case 'image':
        return <img {...commonProps} src={element.content} alt="Element" />;
      case 'container':
        return <div {...commonProps}>Container</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="elements">Elementos</TabsTrigger>
            <TabsTrigger value="colors">Cores</TabsTrigger>
          </TabsList>

          <TabsContent value="elements" className="mt-4">
            <h3 className="font-semibold mb-4">Biblioteca de Elementos</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => addElement('text')}
              >
                <Type className="h-4 w-4" />
                Texto
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => addElement('heading')}
              >
                <Type className="h-4 w-4" />
                Título
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => addElement('button')}
              >
                <Layout className="h-4 w-4" />
                Botão
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => addElement('image')}
              >
                <Image className="h-4 w-4" />
                Imagem
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => addElement('container')}
              >
                <Layout className="h-4 w-4" />
                Container
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="mt-4">
            <div className="h-[calc(100vh-16rem)] overflow-y-auto">
              <ColorPaletteGenerator />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={deviceMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDeviceMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDeviceMode('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDeviceMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4 bg-gray-100 flex justify-center">
          <div 
            className="bg-white shadow-lg transition-all duration-300"
            style={{ 
              width: getDeviceWidth(),
              minHeight: '600px',
              maxWidth: '100%'
            }}
          >
            <div className="p-4">
              {elements.length === 0 ? (
                <div className="h-96 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Layout className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Arraste elementos da biblioteca para começar</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {elements.map(renderElement)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-64 bg-white border-l border-gray-200 p-4">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="style">Estilo</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4">
            {selectedElement ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteElement(selectedElement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button' ? (
                  <div>
                    <label className="text-sm font-medium">Texto</label>
                    <Textarea
                      value={selectedElement.content}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                ) : selectedElement.type === 'image' ? (
                  <div>
                    <label className="text-sm font-medium">URL da Imagem</label>
                    <Input
                      value={selectedElement.content}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Selecione um elemento para editar conteúdo
              </p>
            )}
          </TabsContent>

          <TabsContent value="style" className="mt-4">
            {selectedElement ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Propriedades de Estilo</h3>
                
                <div>
                  <label className="text-sm font-medium">Cor</label>
                  <Input
                    type="color"
                    value={selectedElement.styles.color || '#000000'}
                    onChange={(e) => updateElementStyle(selectedElement.id, 'color', e.target.value)}
                    className="mt-1 h-10"
                  />
                </div>

                {selectedElement.type === 'button' || selectedElement.type === 'container' ? (
                  <div>
                    <label className="text-sm font-medium">Cor de Fundo</label>
                    <Input
                      type="color"
                      value={selectedElement.styles.backgroundColor || '#ffffff'}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'backgroundColor', e.target.value)}
                      className="mt-1 h-10"
                    />
                  </div>
                ) : null}

                <div>
                  <label className="text-sm font-medium">Tamanho da Fonte</label>
                  <Input
                    value={selectedElement.styles.fontSize || '16px'}
                    onChange={(e) => updateElementStyle(selectedElement.id, 'fontSize', e.target.value)}
                    className="mt-1"
                    placeholder="16px"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Padding</label>
                  <Input
                    value={selectedElement.styles.padding || '16px'}
                    onChange={(e) => updateElementStyle(selectedElement.id, 'padding', e.target.value)}
                    className="mt-1"
                    placeholder="16px"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Margin</label>
                  <Input
                    value={selectedElement.styles.margin || '8px'}
                    onChange={(e) => updateElementStyle(selectedElement.id, 'margin', e.target.value)}
                    className="mt-1"
                    placeholder="8px"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Border Radius</label>
                  <Input
                    value={selectedElement.styles.borderRadius || '4px'}
                    onChange={(e) => updateElementStyle(selectedElement.id, 'borderRadius', e.target.value)}
                    className="mt-1"
                    placeholder="4px"
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Selecione um elemento para editar estilos
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}