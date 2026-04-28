
/**
 * Formulário de Produto V2 - Pollyfort
 * Interface completamente redesenhada com validação em tempo real e UX aprimorada
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertCircle, 
  CheckCircle, 
  Save, 
  X, 
  Package, 
  Loader2,
  Info,
  AlertTriangle
} from 'lucide-react';

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

interface ProductFormV2Props {
  product?: Product;
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
}

interface FormData {
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

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const initialFormData: FormData = {
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

export default function ProductFormV2({ product, onSuccess, onCancel }: ProductFormV2Props) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [validation, setValidation] = useState<ValidationResult>({ 
    isValid: false, 
    errors: [], 
    warnings: [] 
  });
  const [isValidating, setIsValidating] = useState(false);
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

  // Validação em tempo real (debounced)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (Object.values(formData).some(value => value !== '' && value !== false)) {
        await validateForm();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData]);

  // Função de validação
  const validateForm = async () => {
    setIsValidating(true);
    try {
      const response = await fetch('/api/v2/products/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setValidation(result.data);
      }
    } catch (error) {
      console.error('Erro na validação:', error);
    } finally {
      setIsValidating(false);
    }
  };

  // Mutation para salvar produto
  const saveProductMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const url = product ? `/api/v2/products/${product.id}` : '/api/v2/products';
      const method = product ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erro ao salvar produto');
      }
      
      return result;
    },
    onSuccess: (result) => {
      toast({
        title: product ? "Produto atualizado!" : "Produto criado!",
        description: result.message,
      });
      
      // Invalidar caches
      queryClient.invalidateQueries({ queryKey: ['/api/v2/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      // Callback de sucesso
      if (onSuccess && result.data) {
        onSuccess(result.data);
      }
      
      // Limpar formulário se for criação
      if (!product) {
        setFormData(initialFormData);
        setValidation({ isValid: false, errors: [], warnings: [] });
      }
    },
    onError: (error: any) => {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar antes de enviar
    await validateForm();
    
    if (!validation.isValid) {
      toast({
        title: "Erro de validação",
        description: "Corrija os campos com erro antes de salvar",
        variant: "destructive"
      });
      return;
    }
    
    saveProductMutation.mutate(formData);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {product ? 'Editar Produto' : 'Novo Produto'}
          {isValidating && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
        
        {/* Status de validação */}
        {validation.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Erros encontrados:</strong>
              <ul className="mt-1 list-disc list-inside">
                {validation.errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {validation.warnings.length > 0 && validation.errors.length === 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Avisos:</strong>
              <div className="flex flex-wrap gap-1 mt-2">
                {validation.warnings.map((warning, index) => (
                  <Badge key={index} variant="outline" className="text-amber-600">
                    <Info className="h-3 w-3 mr-1" />
                    {warning}
                  </Badge>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Básicas</h3>
            
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
                  required
                />
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
                  required
                />
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
                required
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Categorização */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categorização</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Categoria *
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                  required
                >
                  <SelectTrigger>
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium">
                  Marca *
                </Label>
                <Select 
                  value={formData.brand} 
                  onValueChange={(value) => handleInputChange('brand', value)}
                  required
                >
                  <SelectTrigger>
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
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Especificações Técnicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Especificações Técnicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="diameter" className="text-sm font-medium">
                  Diâmetro * (mm)
                </Label>
                <Input
                  id="diameter"
                  value={formData.diameter}
                  onChange={(e) => handleInputChange('diameter', e.target.value)}
                  placeholder="Ex: 8.5"
                  type="number"
                  step="0.1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="width" className="text-sm font-medium">
                  Largura * (mm)
                </Label>
                <Input
                  id="width"
                  value={formData.width}
                  onChange={(e) => handleInputChange('width', e.target.value)}
                  placeholder="Ex: 3.0"
                  type="number"
                  step="0.1"
                  required
                />
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
                  required
                />
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
          </div>
          
          <Separator />
          
          {/* Informações Adicionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Adicionais</h3>
            
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
          </div>
          
          <Separator />
          
          {/* Configurações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configurações</h3>
            
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
              disabled={!validation.isValid || saveProductMutation.isPending}
              className="min-w-[140px]"
            >
              {saveProductMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  {validation.isValid ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {product ? 'Atualizar Produto' : 'Criar Produto'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
