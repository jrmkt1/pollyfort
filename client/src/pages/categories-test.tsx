import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

interface Brand {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

export default function CategoriesTest() {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDescription, setNewBrandDescription] = useState('');
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/admin/categories'],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      setNewCategoryName('');
      setNewCategoryDescription('');
      toast({ title: "Categoria criada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar categoria", variant: "destructive" });
    },
  });

  // Brands
  const { data: brands = [], isLoading: brandsLoading } = useQuery<Brand[]>({
    queryKey: ['/api/admin/brands'],
  });

  const createBrandMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const response = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create brand');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/brands'] });
      setNewBrandName('');
      setNewBrandDescription('');
      toast({ title: "Marca criada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar marca", variant: "destructive" });
    },
  });

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    createCategoryMutation.mutate({
      name: newCategoryName,
      description: newCategoryDescription,
    });
  };

  const handleCreateBrand = () => {
    if (!newBrandName.trim()) return;
    createBrandMutation.mutate({
      name: newBrandName,
      description: newBrandDescription,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste de Categorias e Marcas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categories Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Categorias</h2>
            
            <div className="space-y-4 mb-6">
              <Input
                placeholder="Nome da categoria"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <Input
                placeholder="Descrição da categoria"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
              />
              <Button 
                onClick={handleCreateCategory}
                disabled={createCategoryMutation.isPending}
                className="w-full"
              >
                {createCategoryMutation.isPending ? 'Criando...' : 'Criar Categoria'}
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Categorias Existentes:</h3>
              {categoriesLoading ? (
                <p>Carregando...</p>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="p-2 border rounded">
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-600">{category.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Brands Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Marcas</h2>
            
            <div className="space-y-4 mb-6">
              <Input
                placeholder="Nome da marca"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
              />
              <Input
                placeholder="Descrição da marca"
                value={newBrandDescription}
                onChange={(e) => setNewBrandDescription(e.target.value)}
              />
              <Button 
                onClick={handleCreateBrand}
                disabled={createBrandMutation.isPending}
                className="w-full"
              >
                {createBrandMutation.isPending ? 'Criando...' : 'Criar Marca'}
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Marcas Existentes:</h3>
              {brandsLoading ? (
                <p>Carregando...</p>
              ) : (
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="p-2 border rounded">
                      <div className="font-medium">{brand.name}</div>
                      {brand.description && (
                        <div className="text-sm text-gray-600">{brand.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}