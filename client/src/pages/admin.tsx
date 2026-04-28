import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Package, 
  Upload, 
  Tag, 
  Building2, 
  Trash2, 
  Edit, 
  Plus,
  LogOut,
  MessageSquare,
  User,
  RefreshCw
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Types
interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
  categoryId: number | null;
  brandId: number | null;
  diameter: string;
  width: string;
  material: string;
  imageUrl: string | null;
  price?: string;
  status: string;
  featured: boolean | null;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  productCount?: number;
}

interface Brand {
  id: number;
  name: string;
  description: string | null;
  productCount?: number;
}

interface Quotation {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  products: string;
  status: string;
  createdAt: string;
  responseMessage: string | null;
}

interface AdminUser {
  id: number;
  username: string;
  displayName: string;
  email: string;
  role: string;
}

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Estado para formulários
  const [productForm, setProductForm] = useState({
    name: "",
    code: "",
    description: "",
    categoryId: "",
    brandId: "",
    diameter: "",
    width: "",
    material: "",
    price: "",
    status: "active",
    featured: false
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: ""
  });

  const [brandForm, setBrandForm] = useState({
    name: "",
    description: ""
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBrand, setBrandingBrand] = useState<Brand | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Queries
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: brands = [], isLoading: loadingBrands } = useQuery({
    queryKey: ["/api/brands"],
  });

  const { data: quotations = [], isLoading: loadingQuotations } = useQuery({
    queryKey: ["/api/quotations"],
  });

  // Check admin authentication
  const { data: currentUser, isLoading: isLoadingAuth, error } = useQuery<{ user: AdminUser }>({
    queryKey: ["/api/admin/me"],
    retry: false,
    staleTime: Infinity, // Don't refetch unless explicitly invalidated
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  // Handle authentication redirects with useEffect instead of early returns
  useEffect(() => {
    if (!isLoadingAuth && error && error.message?.includes('401')) {
      console.log("Not authenticated, redirecting to login");
      setLocation("/admin-login");
    } else if (!isLoadingAuth && !currentUser && !error) {
      console.log("No user data, redirecting to login");
      setLocation("/admin-login");
    }
  }, [isLoadingAuth, currentUser, error, setLocation]);

  // Mutations para produtos
  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      return fetch('/api/products', {
        method: 'POST',
        body: formData
      }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      resetProductForm();
      toast({ title: "Produto criado com sucesso!" });
    },
    onError: (error) => {
      console.error('Erro ao processar produto:', error);
      toast({ title: "Erro ao criar produto", variant: "destructive" });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      return fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: formData
      }).then(res => res.json());
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas a produtos
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/products"] });
      
      // Força o reload das imagens em todo o site
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          // Força reload global de todas as imagens de produto
          window.dispatchEvent(new CustomEvent('forceImageReload', { 
            detail: { timestamp: Date.now() }
          }));
          
          // Força reload direto nas imagens visíveis
          const images = document.querySelectorAll('img[src*="/uploads/products/"]');
          images.forEach((img: any) => {
            const originalSrc = img.src.split('?')[0]; // Remove query params antigos
            img.src = '';
            setTimeout(() => {
              img.src = originalSrc + '?cb=' + Date.now();
            }, 100);
          });
        }, 200);
      }
      
      // Reset form
      setEditingProduct(null);
      resetProductForm();
      setSelectedFile(null);
      
      toast({ title: "Produto atualizado com sucesso!" });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar produto:", error);
      toast({ 
        title: "Erro ao atualizar produto", 
        description: error?.message || "Verifique os dados e tente novamente",
        variant: "destructive" 
      });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return fetch(`/api/products/${id}`, { method: "DELETE" }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Produto deletado com sucesso!" });
    },
    onError: (error) => {
      console.error('Erro ao processar produto:', error);
      toast({ title: "Erro ao deletar produto", variant: "destructive" });
    }
  });

  // Mutations para categorias
  const createCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      resetCategoryForm();
      toast({ title: "Categoria criada com sucesso!" });
    },
    onError: (error) => {
      console.error('Erro ao processar produto:', error);
      toast({ title: "Erro ao criar categoria", variant: "destructive" });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PUT", `/api/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setEditingCategory(null);
      resetCategoryForm();
      toast({ title: "Categoria atualizada com sucesso!" });
    },
    onError: (error) => {
      console.error('Erro ao processar produto:', error);
      toast({ title: "Erro ao atualizar categoria", variant: "destructive" });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Categoria deletada com sucesso!" });
    },
    onError: (error) => {
      console.error('Erro ao processar produto:', error);
      toast({ title: "Erro ao deletar categoria", variant: "destructive" });
    }
  });

  // Mutations para marcas
  const createBrandMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/brands", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      resetBrandForm();
      toast({ title: "Marca criada com sucesso!" });
    },
    onError: (error) => {
      console.error('Erro ao processar produto:', error);
      toast({ title: "Erro ao criar marca", variant: "destructive" });
    }
  });

  const updateBrandMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PUT", `/api/brands/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      setBrandingBrand(null);
      resetBrandForm();
      toast({ title: "Marca atualizada com sucesso!" });
    },
    onError: (error) => {
      console.error('Erro ao processar produto:', error);
      toast({ title: "Erro ao atualizar marca", variant: "destructive" });
    }
  });

  const deleteBrandMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/brands/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({ title: "Marca deletada com sucesso!" });
    },
    onError: (error) => {
      console.error('Erro ao processar produto:', error);
      toast({ title: "Erro ao deletar marca", variant: "destructive" });
    }
  });

  // Funções auxiliares
  const resetProductForm = () => {
    setProductForm({
      name: "",
      code: "",
      description: "",
      categoryId: "",
      brandId: "",
      diameter: "",
      width: "",
      material: "",
      price: "",
      status: "active",
      featured: false
    });
    setSelectedFile(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: "", description: "" });
  };

  const resetBrandForm = () => {
    setBrandForm({ name: "", description: "" });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      code: product.code,
      description: product.description,
      categoryId: product.categoryId?.toString() || "",
      brandId: product.brandId?.toString() || "",
      diameter: product.diameter,
      width: product.width,
      material: product.material,
      price: product.price || "",
      status: product.status,
      featured: product.featured || false
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || ""
    });
  };

  const handleEditBrand = (brand: Brand) => {
    setBrandingBrand(brand);
    setBrandForm({
      name: brand.name,
      description: brand.description || ""
    });
  };

  const handleLogout = async () => {
    try {
      // Fazer logout real da sessão admin
      await fetch('/api/admin/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      // Invalidar cache do React Query
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      
      toast({ title: "Logout realizado com sucesso" });
      
      // Redirecionar para a página inicial (HOME)
      setLocation("/");
    } catch (error) {
      console.error('Erro durante logout:', error);
      toast({ title: "Logout realizado com sucesso" });
      setLocation("/");
    }
  };

  const handleRepairImages = async () => {
    try {
      toast({ title: "Reparando imagens perdidas...", description: "Este processo pode levar alguns minutos." });
      
      const response = await fetch('/api/storage/repair', { 
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        toast({ 
          title: "Reparo concluído com sucesso!", 
          description: "Todas as imagens perdidas foram restauradas dos backups." 
        });
        
        // Invalidar cache para forçar recarregamento das imagens
        queryClient.invalidateQueries({ queryKey: ["/api/products"] });
        
        // Forçar reload das imagens na página
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast({ 
          title: "Erro no reparo", 
          description: "Falha ao reparar imagens. Tente novamente.",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Erro durante reparo:', error);
      toast({ 
        title: "Erro no reparo", 
        description: "Falha na conexão. Tente novamente.",
        variant: "destructive" 
      });
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...productForm,
        categoryId: productForm.categoryId ? parseInt(productForm.categoryId) : null,
        brandId: productForm.brandId ? parseInt(productForm.brandId) : null,
        featured: productForm.featured
      };

      // Se há um arquivo selecionado, usar o endpoint de upload persistente
      if (selectedFile) {
        const formData = new FormData();
        formData.append('productImage', selectedFile);
        
        // Adicionar dados do produto ao FormData
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
          }
        });

        if (editingProduct) {
          // Atualizar produto existente com nova imagem
          const response = await fetch(`/api/products/${editingProduct.id}/upload`, {
            method: 'PUT',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao atualizar produto');
          }

          const result = await response.json();
          console.log('Produto atualizado com sucesso:', result);
          
          // Invalidar cache e resetar formulário
          queryClient.invalidateQueries({ queryKey: ["/api/products"] });
          setEditingProduct(null);
          resetProductForm();
          
          toast({ title: "Produto atualizado com sucesso!" });
        } else {
          // Criar novo produto com imagem
          const response = await fetch('/api/products/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao criar produto');
          }

          const result = await response.json();
          console.log('Produto criado com sucesso:', result);
          
          // Invalidar cache e resetar formulário
          queryClient.invalidateQueries({ queryKey: ["/api/products"] });
          resetProductForm();
          
          toast({ title: "Produto criado com sucesso!" });
        }
      } else {
        // Usar mutations existentes para produtos sem upload de imagem
        if (editingProduct) {
          updateProductMutation.mutate({ id: editingProduct.id, data });
        } else {
          createProductMutation.mutate(data);
        }
      }
    } catch (error: any) {
      console.error('Erro ao processar produto:', error);
      toast({ 
        title: "Erro ao processar produto", 
        description: error.message || "Verifique os dados e tente novamente",
        variant: "destructive" 
      });
    }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: categoryForm });
    } else {
      createCategoryMutation.mutate(categoryForm);
    }
  };

  const handleSubmitBrand = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBrand) {
      updateBrandMutation.mutate({ id: editingBrand.id, data: brandForm });
    } else {
      createBrandMutation.mutate(brandForm);
    }
  };

  // Show loading state while checking auth
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If no current user and not loading, don't render main content (redirect is handled by useEffect)
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRepairImages}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                title="Reparar imagens perdidas após deploys"
              >
                <RefreshCw className="h-4 w-4" />
                Reparar Imagens
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categorias
            </TabsTrigger>
            <TabsTrigger value="brands" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Marcas
            </TabsTrigger>
            <TabsTrigger value="quotations" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Cotações
            </TabsTrigger>
          </TabsList>

          {/* Produtos */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário de Produto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingProduct ? "Editar Produto" : "Novo Produto"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitProduct} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="code">Código</Label>
                        <Input
                          id="code"
                          value={productForm.code}
                          onChange={(e) => setProductForm({...productForm, code: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Categoria</Label>
                        <Select 
                          value={productForm.categoryId} 
                          onValueChange={(value) => setProductForm({...productForm, categoryId: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category: Category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="brand">Marca</Label>
                        <Select 
                          value={productForm.brandId} 
                          onValueChange={(value) => setProductForm({...productForm, brandId: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma marca" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((brand: Brand) => (
                              <SelectItem key={brand.id} value={brand.id.toString()}>
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="diameter">Diâmetro</Label>
                        <Input
                          id="diameter"
                          value={productForm.diameter}
                          onChange={(e) => setProductForm({...productForm, diameter: e.target.value})}
                          placeholder="ex: 200mm"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="width">Largura</Label>
                        <Input
                          id="width"
                          value={productForm.width}
                          onChange={(e) => setProductForm({...productForm, width: e.target.value})}
                          placeholder="ex: 50mm"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="material">Material</Label>
                        <Input
                          id="material"
                          value={productForm.material}
                          onChange={(e) => setProductForm({...productForm, material: e.target.value})}
                          placeholder="ex: Poliuretano"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={productForm.status} 
                          onValueChange={(value) => setProductForm({...productForm, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="image">Imagem do Produto</Label>
                      <div className="mt-1">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="featured">Produto em destaque</Label>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={createProductMutation.isPending || updateProductMutation.isPending}
                        className="flex-1"
                      >
                        {editingProduct ? "Atualizar" : "Criar"} Produto
                      </Button>
                      {editingProduct && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setEditingProduct(null);
                            resetProductForm();
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Lista de Produtos */}
              <Card>
                <CardHeader>
                  <CardTitle>Produtos Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingProducts ? (
                    <div>Carregando produtos...</div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {products.map((product: Product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            {product.imageUrl && (
                              <img 
                                src={product.imageUrl}
                                key={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-600">{product.code}</p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                  {product.status === 'active' ? 'Ativo' : 'Inativo'}
                                </Badge>
                                {product.featured && (
                                  <Badge variant="outline">Destaque</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => deleteProductMutation.mutate(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categorias */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário de Categoria */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitCategory} className="space-y-4">
                    <div>
                      <Label htmlFor="cat-name">Nome</Label>
                      <Input
                        id="cat-name"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cat-description">Descrição</Label>
                      <Textarea
                        id="cat-description"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                        className="flex-1"
                      >
                        {editingCategory ? "Atualizar" : "Criar"} Categoria
                      </Button>
                      {editingCategory && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setEditingCategory(null);
                            resetCategoryForm();
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Lista de Categorias */}
              <Card>
                <CardHeader>
                  <CardTitle>Categorias Cadastradas</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingCategories ? (
                    <div>Carregando categorias...</div>
                  ) : (
                    <div className="space-y-3">
                      {categories.map((category: Category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{category.name}</h4>
                            <p className="text-sm text-gray-600">{category.description}</p>
                            <Badge variant="outline" className="mt-1">
                              {category.productCount || 0} produtos
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => deleteCategoryMutation.mutate(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Marcas */}
          <TabsContent value="brands" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário de Marca */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingBrand ? "Editar Marca" : "Nova Marca"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitBrand} className="space-y-4">
                    <div>
                      <Label htmlFor="brand-name">Nome</Label>
                      <Input
                        id="brand-name"
                        value={brandForm.name}
                        onChange={(e) => setBrandForm({...brandForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand-description">Descrição</Label>
                      <Textarea
                        id="brand-description"
                        value={brandForm.description}
                        onChange={(e) => setBrandForm({...brandForm, description: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={createBrandMutation.isPending || updateBrandMutation.isPending}
                        className="flex-1"
                      >
                        {editingBrand ? "Atualizar" : "Criar"} Marca
                      </Button>
                      {editingBrand && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setBrandingBrand(null);
                            resetBrandForm();
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Lista de Marcas */}
              <Card>
                <CardHeader>
                  <CardTitle>Marcas Cadastradas</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingBrands ? (
                    <div>Carregando marcas...</div>
                  ) : (
                    <div className="space-y-3">
                      {brands.map((brand: Brand) => (
                        <div key={brand.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{brand.name}</h4>
                            <p className="text-sm text-gray-600">{brand.description}</p>
                            <Badge variant="outline" className="mt-1">
                              {brand.productCount || 0} produtos
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditBrand(brand)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => deleteBrandMutation.mutate(brand.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cotações */}
          <TabsContent value="quotations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Cotações Recebidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingQuotations ? (
                  <div>Carregando cotações...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quotations.map((quotation: Quotation) => (
                          <TableRow key={quotation.id}>
                            <TableCell className="font-medium">{quotation.name}</TableCell>
                            <TableCell>{quotation.email}</TableCell>
                            <TableCell>{quotation.phone}</TableCell>
                            <TableCell>{quotation.company || "-"}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  quotation.status === 'pending' ? 'default' :
                                  quotation.status === 'responded' ? 'secondary' :
                                  quotation.status === 'approved' ? 'default' : 'destructive'
                                }
                              >
                                {quotation.status === 'pending' ? 'Pendente' :
                                 quotation.status === 'responded' ? 'Respondida' :
                                 quotation.status === 'approved' ? 'Aprovada' : 'Rejeitada'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(quotation.createdAt).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                Ver Detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}