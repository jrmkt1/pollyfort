
/**
 * Serviço de Produtos V2 - Pollyfort
 * Sistema completamente redesenhado com validação avançada e performance otimizada
 */

import { Product, InsertProduct, Category, Brand } from '@shared/schema';
import { simpleStorage } from './storage-clean';
import { z } from 'zod';

// Schema de validação robusta
const ProductInputSchema = z.object({
  name: z.string()
    .min(5, 'Nome deve ter pelo menos 5 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .trim(),
  code: z.string()
    .min(3, 'Código deve ter pelo menos 3 caracteres')
    .max(50, 'Código deve ter no máximo 50 caracteres')
    .regex(/^[A-Z0-9\-_]+$/, 'Código deve conter apenas letras maiúsculas, números, hífens e underscores')
    .trim(),
  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres')
    .trim(),
  category: z.string()
    .min(1, 'Categoria é obrigatória')
    .max(100, 'Categoria deve ter no máximo 100 caracteres')
    .trim(),
  brand: z.string()
    .min(1, 'Marca é obrigatória')
    .max(100, 'Marca deve ter no máximo 100 caracteres')
    .trim(),
  diameter: z.string()
    .min(1, 'Diâmetro é obrigatório')
    .regex(/^\d+(\.\d+)?$/, 'Diâmetro deve ser um número válido')
    .trim(),
  width: z.string()
    .min(1, 'Largura é obrigatória')
    .regex(/^\d+(\.\d+)?$/, 'Largura deve ser um número válido')
    .trim(),
  material: z.string()
    .min(2, 'Material deve ter pelo menos 2 caracteres')
    .max(100, 'Material deve ter no máximo 100 caracteres')
    .trim(),
  hardness: z.string()
    .max(100, 'Dureza deve ter no máximo 100 caracteres')
    .optional()
    .nullable(),
  maxLoad: z.string()
    .max(100, 'Carga máxima deve ter no máximo 100 caracteres')
    .optional()
    .nullable(),
  application: z.string()
    .max(1000, 'Aplicação deve ter no máximo 1000 caracteres')
    .optional()
    .nullable(),
  imageUrl: z.string()
    .url('URL da imagem deve ser válida')
    .optional()
    .nullable()
    .or(z.literal('')),
  price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Preço deve ser um número válido com até 2 casas decimais')
    .optional()
    .nullable()
    .or(z.literal('')),
  featured: z.boolean().default(false),
  status: z.enum(['active', 'inactive', 'draft']).default('active')
});

export type ProductInput = z.infer<typeof ProductInputSchema>;

export interface ProductValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: ProductInput;
}

export interface ProductOperationResult {
  success: boolean;
  product?: Product;
  errors?: string[];
  message?: string;
}

export class ProductServiceV2 {
  private static instance: ProductServiceV2;

  static getInstance(): ProductServiceV2 {
    if (!ProductServiceV2.instance) {
      ProductServiceV2.instance = new ProductServiceV2();
    }
    return ProductServiceV2.instance;
  }

  /**
   * Valida entrada de produto com Zod
   */
  validateProductInput(input: any): ProductValidationResult {
    const result = ProductInputSchema.safeParse(input);
    
    if (!result.success) {
      const errors = result.error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      
      return {
        isValid: false,
        errors,
        warnings: this.generateWarnings(input)
      };
    }

    return {
      isValid: true,
      errors: [],
      warnings: this.generateWarnings(result.data),
      data: result.data
    };
  }

  /**
   * Gera avisos para campos opcionais não preenchidos
   */
  private generateWarnings(data: any): string[] {
    const warnings: string[] = [];
    
    if (!data.price || data.price === '') {
      warnings.push('Preço não informado - produto pode não aparecer em cotações');
    }
    
    if (!data.hardness || data.hardness === '') {
      warnings.push('Dureza não informada - especificação técnica incompleta');
    }
    
    if (!data.maxLoad || data.maxLoad === '') {
      warnings.push('Carga máxima não informada - especificação técnica incompleta');
    }
    
    if (!data.application || data.application === '') {
      warnings.push('Aplicação não informada - pode dificultar busca por produtos');
    }
    
    if (!data.imageUrl || data.imageUrl === '') {
      warnings.push('Imagem não informada - produto pode ter menor conversão');
    }

    return warnings;
  }

  /**
   * Verifica se código do produto já existe
   */
  private async checkCodeUniqueness(code: string, excludeId?: number): Promise<boolean> {
    const products = await simpleStorage.getProducts();
    return !products.some(p => 
      p.code.toUpperCase() === code.toUpperCase() && 
      (excludeId === undefined || p.id !== excludeId)
    );
  }

  /**
   * Verifica se categoria existe
   */
  private async validateCategory(categoryName: string): Promise<boolean> {
    const categories = await simpleStorage.getCategories();
    return categories.some(c => c.name === categoryName);
  }

  /**
   * Verifica se marca existe
   */
  private async validateBrand(brandName: string): Promise<boolean> {
    const brands = await simpleStorage.getBrands();
    return brands.some(b => b.name === brandName);
  }

  /**
   * Normaliza dados para inserção
   */
  private normalizeProductData(data: ProductInput): InsertProduct {
    return {
      name: data.name.trim(),
      code: data.code.toUpperCase().trim(),
      description: data.description.trim(),
      category: data.category.trim(),
      brand: data.brand.trim(),
      diameter: data.diameter.trim(),
      width: data.width.trim(),
      material: data.material.trim(),
      hardness: data.hardness?.trim() || null,
      maxLoad: data.maxLoad?.trim() || null,
      application: data.application?.trim() || null,
      imageUrl: data.imageUrl?.trim() || null,
      price: data.price?.trim() || null,
      featured: data.featured,
      status: data.status
    };
  }

  /**
   * Cria novo produto com validação completa
   */
  async createProduct(input: any): Promise<ProductOperationResult> {
    try {
      console.log('🆕 [ProductServiceV2] Iniciando criação de produto:', input.name);

      // Validação de entrada
      const validation = this.validateProductInput(input);
      if (!validation.isValid) {
        console.log('❌ [ProductServiceV2] Validação falhou:', validation.errors);
        return {
          success: false,
          errors: validation.errors
        };
      }

      const data = validation.data!;

      // Verificar unicidade do código
      const isCodeUnique = await this.checkCodeUniqueness(data.code);
      if (!isCodeUnique) {
        return {
          success: false,
          errors: [`Código '${data.code}' já existe. Escolha um código único.`]
        };
      }

      // Verificar se categoria existe
      const categoryExists = await this.validateCategory(data.category);
      if (!categoryExists) {
        console.log(`⚠️ [ProductServiceV2] Categoria '${data.category}' não existe, mas prosseguindo`);
      }

      // Verificar se marca existe
      const brandExists = await this.validateBrand(data.brand);
      if (!brandExists) {
        console.log(`⚠️ [ProductServiceV2] Marca '${data.brand}' não existe, mas prosseguindo`);
      }

      // Normalizar e criar produto
      const normalizedData = this.normalizeProductData(data);
      const product = await simpleStorage.createProduct(normalizedData);

      console.log('✅ [ProductServiceV2] Produto criado com sucesso:', {
        id: product.id,
        name: product.name,
        code: product.code
      });

      return {
        success: true,
        product,
        message: `Produto '${product.name}' criado com sucesso!`
      };

    } catch (error) {
      console.error('❌ [ProductServiceV2] Erro ao criar produto:', error);
      return {
        success: false,
        errors: ['Erro interno do servidor. Tente novamente.']
      };
    }
  }

  /**
   * Atualiza produto existente
   */
  async updateProduct(id: number, input: any): Promise<ProductOperationResult> {
    try {
      console.log(`🔄 [ProductServiceV2] Iniciando atualização do produto ${id}:`, input.name);

      // Verificar se produto existe
      const existingProduct = await simpleStorage.getProduct(id);
      if (!existingProduct) {
        return {
          success: false,
          errors: ['Produto não encontrado.']
        };
      }

      // Validação de entrada
      const validation = this.validateProductInput(input);
      if (!validation.isValid) {
        console.log('❌ [ProductServiceV2] Validação falhou:', validation.errors);
        return {
          success: false,
          errors: validation.errors
        };
      }

      const data = validation.data!;

      // Verificar unicidade do código (excluindo o produto atual)
      const isCodeUnique = await this.checkCodeUniqueness(data.code, id);
      if (!isCodeUnique) {
        return {
          success: false,
          errors: [`Código '${data.code}' já existe em outro produto.`]
        };
      }

      // Normalizar e atualizar produto
      const normalizedData = this.normalizeProductData(data);
      const product = await simpleStorage.updateProduct(id, normalizedData);

      if (!product) {
        return {
          success: false,
          errors: ['Erro ao atualizar produto. Tente novamente.']
        };
      }

      console.log('✅ [ProductServiceV2] Produto atualizado com sucesso:', {
        id: product.id,
        name: product.name,
        code: product.code
      });

      return {
        success: true,
        product,
        message: `Produto '${product.name}' atualizado com sucesso!`
      };

    } catch (error) {
      console.error('❌ [ProductServiceV2] Erro ao atualizar produto:', error);
      return {
        success: false,
        errors: ['Erro interno do servidor. Tente novamente.']
      };
    }
  }

  /**
   * Remove produto
   */
  async deleteProduct(id: number): Promise<ProductOperationResult> {
    try {
      console.log(`🗑️ [ProductServiceV2] Iniciando remoção do produto ${id}`);

      // Verificar se produto existe
      const existingProduct = await simpleStorage.getProduct(id);
      if (!existingProduct) {
        return {
          success: false,
          errors: ['Produto não encontrado.']
        };
      }

      const success = await simpleStorage.deleteProduct(id);
      if (!success) {
        return {
          success: false,
          errors: ['Erro ao remover produto. Tente novamente.']
        };
      }

      console.log('✅ [ProductServiceV2] Produto removido com sucesso:', {
        id,
        name: existingProduct.name
      });

      return {
        success: true,
        message: `Produto '${existingProduct.name}' removido com sucesso!`
      };

    } catch (error) {
      console.error('❌ [ProductServiceV2] Erro ao remover produto:', error);
      return {
        success: false,
        errors: ['Erro interno do servidor. Tente novamente.']
      };
    }
  }

  /**
   * Busca produto por ID
   */
  async getProduct(id: number): Promise<Product | null> {
    try {
      return await simpleStorage.getProduct(id);
    } catch (error) {
      console.error('❌ [ProductServiceV2] Erro ao buscar produto:', error);
      return null;
    }
  }

  /**
   * Lista produtos com filtros avançados
   */
  async searchProducts(filters: {
    category?: string;
    brand?: string;
    search?: string;
    status?: string;
    featured?: boolean;
    priceMin?: number;
    priceMax?: number;
  } = {}): Promise<Product[]> {
    try {
      const products = await simpleStorage.getProducts();
      
      return products.filter(product => {
        // Filtro por categoria
        if (filters.category && product.category !== filters.category) {
          return false;
        }
        
        // Filtro por marca
        if (filters.brand && product.brand !== filters.brand) {
          return false;
        }
        
        // Filtro por status
        if (filters.status && product.status !== filters.status) {
          return false;
        }
        
        // Filtro por featured
        if (filters.featured !== undefined && product.featured !== filters.featured) {
          return false;
        }
        
        // Filtro por preço
        if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
          const price = product.price ? parseFloat(product.price) : 0;
          if (filters.priceMin !== undefined && price < filters.priceMin) {
            return false;
          }
          if (filters.priceMax !== undefined && price > filters.priceMax) {
            return false;
          }
        }
        
        // Filtro por busca textual
        if (filters.search) {
          const search = filters.search.toLowerCase();
          return (
            product.name.toLowerCase().includes(search) ||
            product.code.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search) ||
            product.material.toLowerCase().includes(search) ||
            (product.application && product.application.toLowerCase().includes(search))
          );
        }
        
        return true;
      });
    } catch (error) {
      console.error('❌ [ProductServiceV2] Erro ao buscar produtos:', error);
      return [];
    }
  }

  /**
   * Gera estatísticas detalhadas
   */
  async getDetailedStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    draft: number;
    featured: number;
    withPrice: number;
    withImage: number;
    byCategory: Record<string, number>;
    byBrand: Record<string, number>;
    avgPrice: number;
  }> {
    try {
      const products = await simpleStorage.getProducts();
      
      const stats = {
        total: products.length,
        active: 0,
        inactive: 0,
        draft: 0,
        featured: 0,
        withPrice: 0,
        withImage: 0,
        byCategory: {} as Record<string, number>,
        byBrand: {} as Record<string, number>,
        avgPrice: 0
      };

      let totalPrice = 0;
      let priceCount = 0;

      products.forEach(product => {
        // Status
        if (product.status === 'active') stats.active++;
        else if (product.status === 'inactive') stats.inactive++;
        else if (product.status === 'draft') stats.draft++;
        
        // Featured
        if (product.featured) stats.featured++;
        
        // Com preço
        if (product.price) {
          stats.withPrice++;
          totalPrice += parseFloat(product.price);
          priceCount++;
        }
        
        // Com imagem
        if (product.imageUrl) stats.withImage++;
        
        // Por categoria
        stats.byCategory[product.category] = (stats.byCategory[product.category] || 0) + 1;
        
        // Por marca
        if (product.brand) {
          stats.byBrand[product.brand] = (stats.byBrand[product.brand] || 0) + 1;
        }
      });

      stats.avgPrice = priceCount > 0 ? totalPrice / priceCount : 0;

      return stats;
    } catch (error) {
      console.error('❌ [ProductServiceV2] Erro ao gerar estatísticas:', error);
      return {
        total: 0, active: 0, inactive: 0, draft: 0, featured: 0,
        withPrice: 0, withImage: 0, byCategory: {}, byBrand: {}, avgPrice: 0
      };
    }
  }
}

export const productServiceV2 = ProductServiceV2.getInstance();
