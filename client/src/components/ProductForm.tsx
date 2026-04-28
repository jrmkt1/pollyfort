/**
 * Componente Otimizado de Cadastro de Produtos - Pollyfort
 * Formulário com validação completa e feedback em tempo real
 */

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Save, X, Package } from 'lucide-react';

interface ProductFormData {
  name: string;
  code: string;
  description: string;
  category: string;
  brand: string;
  diameter: string;
  width: string;
  material: string;
  hardness: string;
  maxLoad: string;
  application: string;
  imageUrl: string;
  price: string;
  featured: boolean;
  status: string;
}

interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
  category: string;
  brand: string | null;
  diameter: string;
  width: string;
  material: string;
  hardness: string | null;
  maxLoad: string | null;
  application: string | null;
  imageUrl: string | null;
  price: string | null;
  rating: number;
  reviewCount: number;
  featured: boolean;
  status: string;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface Brand {
  id: number;
  name: string;
  description: string | null;
}

interface ProductFormProps {
  product?: Product;
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
}

const initialFormData: ProductFormData = {
  name: '',
  code: '',
  description: '',
  category: '',
  brand: '',
  diameter: '',
  width: '',
  material: '',
  hardness: '',
  maxLoad: '',
  application: '',
  imageUrl: '',
  price: '',
  featured: false,
  status: 'active'
};

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Carregar categorias e marcas
  const { data: categoriesResponse } = useQuery({
    queryKey: ['/api/v2/categories'],
    queryFn: async () => {
      const response = await fetch('/api/v2/categories');
      return response.json();
    }
  });

  const { data: brandsResponse } = useQuery({
    queryKey: ['/api/v2/brands'],
    queryFn: async () => {
      const response = await fetch('/api/v2/brands');
      return response.json();
    }
  });

  const categories: Category[] = categoriesResponse?.data || [];
  const brands: Brand[] = brandsResponse?.data || [];

  // Preencher formulário quando produto for passado
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        code: product.code,
        description: product.description,
        category: product.category,
        brand: product.brand || '',
        diameter: product.diameter,
        width: product.width,
        material: product.material,
        hardness: product.hardness || '',
        maxLoad: product.maxLoad || '',
        application: product.application || '',
        imageUrl: product.imageUrl || '',
        price: product.price || '',
        featured: product.featured,
        status: product.status
      });
    }
  }, [product]);

  // Mutation para salvar produto
  const saveProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const url = product ? `/api/v2/products/${product.id}` : '/api/v2/products';
      const method = product ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao salvar produto');
      }
      
      return result;
    },
    onSuccess: (result) => {
      toast({
        title: product ? "Produto atualizado" : "Produto criado",
        description: result.message,
      });
      
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ['/api/v2/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      // Callback de sucesso
      if (onSuccess && result.data) {
        onSuccess(result.data);
      }
      
      // Limpar formulário se for criação
      if (!product) {
        setFormData(initialFormData);
        setErrors({});
        setWarnings([]);
      }
    },
    onError: (error: any) => {
      console.error('Erro ao salvar produto:', error);
      
      // Tratar erros de validação
      if (error.message.includes('Dados inválidos')) {
        toast({
          title: "Erro de validação",
          description: "Verifique os campos obrigatórios",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  });

  // Validação em tempo real
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Nome é obrigatório';
        } else if (value.length < 5) {
          newErrors.name = 'Nome deve ter pelo menos 5 caracteres';
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'code':
        if (!value.trim()) {
          newErrors.code = 'Código é obrigatório';
        } else if (value.length < 3) {
          newErrors.code = 'Código deve ter pelo menos 3 caracteres';
        } else {
          delete newErrors.code;
        }
        break;
        
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Descrição é obrigatória';
        } else if (value.length < 10) {
          newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
        } else {
          delete newErrors.description;
        }
        break;
        
      case 'category':
      case 'brand':
      case 'diameter':
      case 'width':
      case 'material':
        if (!value.trim()) {
          newErrors[name] = `${name === 'brand' ? 'Marca' : name === 'category' ? 'Categoria' : name} é obrigatório(a)`;
        } else {
          delete newErrors[name];
        }
        break;
        
      
    }
    
    setErrors(newErrors);
    
    // Gerar avisos
    const newWarnings: string[] = [];
    if (!formData.hardness) newWarnings.push('Dureza não informada');
    if (!formData.maxLoad) newWarnings.push('Carga máxima não informada');
    if (!formData.application) newWarnings.push('Aplicação não informada');
    
    setWarnings(newWarnings);
  };

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (typeof value === 'string') {
      validateField(name, value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos os campos
    Object.keys(formData).forEach(key => {
      if (typeof formData[key as keyof ProductFormData] === 'string') {
        validateField(key, formData[key as keyof ProductFormData] as string);
      }
    });
    
    // Verificar se há erros
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Erro de validação",
        description: "Corrija os campos com erro antes de salvar",
        variant: "destructive"
      });
      return;
    }
    
    saveProductMutation.mutate(formData);
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    formData.name && formData.code && formData.description && 
    formData.category && formData.brand && formData.diameter && 
    formData.width && formData.material;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {product ? 'Editar Produto' : 'Novo Produto'}
        </CardTitle>
        
        {warnings.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {warnings.map((warning, index) => (
              <Badge key={index} variant="outline" className="text-amber-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                {warning}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome do Produto *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Roda Pneumática 8.5 x 3.0"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium">
                Código *
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="Ex: RP850-30"
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.code}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição detalhada do produto..."
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
          </div>
          
          <Separator />
          
          {/* Categoria e Marca */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Categoria *
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.category}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-sm font-medium">
                Marca *
              </Label>
              <Select 
                value={formData.brand} 
                onValueChange={(value) => handleInputChange('brand', value)}
              >
                <SelectTrigger className={errors.brand ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione uma marca" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.name}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.brand && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.brand}
                </p>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Especificações Técnicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diameter" className="text-sm font-medium">
                Diâmetro *
              </Label>
              <Input
                id="diameter"
                value={formData.diameter}
                onChange={(e) => handleInputChange('diameter', e.target.value)}
                placeholder="Ex: 8.5"
                className={errors.diameter ? 'border-red-500' : ''}
              />
              {errors.diameter && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.diameter}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="width" className="text-sm font-medium">
                Largura *
              </Label>
              <Input
                id="width"
                value={formData.width}
                onChange={(e) => handleInputChange('width', e.target.value)}
                placeholder="Ex: 3.0"
                className={errors.width ? 'border-red-500' : ''}
              />
              {errors.width && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.width}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="material" className="text-sm font-medium">
                Material *
              </Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => handleInputChange('material', e.target.value)}
                placeholder="Ex: Poliuretano"
                className={errors.material ? 'border-red-500' : ''}
              />
              {errors.material && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.material}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hardness" className="text-sm font-medium">
                Dureza
              </Label>
              <Input
                id="hardness"
                value={formData.hardness}
                onChange={(e) => handleInputChange('hardness', e.target.value)}
                placeholder="Ex: 95 Shore A"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxLoad" className="text-sm font-medium">
                Carga Máxima
              </Label>
              <Input
                id="maxLoad"
                value={formData.maxLoad}
                onChange={(e) => handleInputChange('maxLoad', e.target.value)}
                placeholder="Ex: 500 kg"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="application" className="text-sm font-medium">
              Aplicação
            </Label>
            <Textarea
              id="application"
              value={formData.application}
              onChange={(e) => handleInputChange('application', e.target.value)}
              placeholder="Ex: Ideal para empilhadeiras elétricas em armazéns..."
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium">
              URL da Imagem
            </Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="Ex: /uploads/products/roda-pneumatica.jpg"
              type="url"
            />
          </div>
          
          <Separator />
          
          {/* Configurações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <Label htmlFor="featured" className="text-sm font-medium">
                Produto em destaque
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={saveProductMutation.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            )}
            
            <Button 
              type="submit" 
              disabled={!isFormValid || saveProductMutation.isPending}
              className="min-w-[120px]"
            >
              {saveProductMutation.isPending ? (
                'Salvando...'
              ) : (
                <>
                  {isFormValid ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {product ? 'Atualizar' : 'Criar Produto'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}