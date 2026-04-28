import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Menu, Plus, Edit, Trash2, GripVertical } from "lucide-react";

export default function CmsMenusManager() {
  const [menus] = useState([
    {
      id: 1,
      name: "Menu Principal",
      slug: "menu-principal",
      description: "Menu de navegação principal do site",
      items: []
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Menus</h2>
          <p className="text-muted-foreground">Configure menus de navegação do site</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Menu
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Menu</DialogTitle>
              <DialogDescription>
                Configure um novo menu de navegação
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="menu-name">Nome do Menu</Label>
                <Input id="menu-name" placeholder="Menu Principal" />
              </div>

              <div>
                <Label htmlFor="menu-slug">Slug</Label>
                <Input id="menu-slug" placeholder="menu-principal" />
              </div>

              <div>
                <Label htmlFor="menu-description">Descrição</Label>
                <Input id="menu-description" placeholder="Descrição do menu..." />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button>Criar Menu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {menus.map((menu) => (
          <Card key={menu.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Menu className="h-5 w-5" />
                  <CardTitle>{menu.name}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {menu.description && (
                <p className="text-sm text-muted-foreground">{menu.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {menu.items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Menu className="mx-auto h-8 w-8 mb-2" />
                    <p className="text-sm">Nenhum item no menu</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      <Plus className="mr-2 h-3 w-3" />
                      Adicionar Item
                    </Button>
                  </div>
                ) : (
                  menu.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{item.title}</span>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}