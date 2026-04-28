/**
 * Serviço Otimizado de Produtos - Pollyfort
 * Gerenciamento centralizado de produtos com validação e logs
 */

import { Product, InsertProduct, Category, Brand } from '@shared/schema';
import { simpleStorage } from './storage-clean';

export interface ProductFormData {
  name: string;
  code: string;
  description: string;
  category: string;
  brand: string;
  diameter: string;
  width: string;
  material: string;
  hardness?: string;
  maxLoad?: string;
  application?: string;
  imageUrl?: string;
  price?: string;
  featured?: boolean;
  status?: string;
}

export interface ProductValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ProductService {
  private static instance: ProductService;

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Valida dados do produto antes de salvar
   */
  validateProduct(data: ProductFormData): ProductValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validações obrigatórias
    if (!data.name?.trim()) errors.push('Nome do produto é obrigatório');
    if (!data.code?.trim()) errors.push('Código do produto é obrigatório');
    if (!data.description?.trim()) errors.push('Descrição do produto é obrigatória');
    if (!data.category?.trim()) errors.push('Categoria é obrigatória');
    if (!data.brand?.trim()) errors.push('Marca é obrigatória');
    if (!data.diameter?.trim()) errors.push('Diâmetro é obrigatório');
    if (!data.width?.trim()) errors.push('Largura é obrigatória');
    if (!data.material?.trim()) errors.push('Material é obrigatório');

    // Validações de formato
    if (data.code && data.code.length < 3) {
      errors.push('Código deve ter pelo menos 3 caracteres');
    }

    if (data.name && data.name.length < 5) {
      errors.push('Nome deve ter pelo menos 5 caracteres');
    }

    if (data.price && isNaN(parseFloat(data.price))) {
      errors.push('Preço deve ser um número válido');
    }

    // Avisos
    if (!data.price?.trim()) warnings.push('Preço não informado');
    if (!data.hardness?.trim()) warnings.push('Dureza não informada');
    if (!data.maxLoad?.trim()) warnings.push('Carga máxima não informada');
    if (!data.application?.trim()) warnings.push('Aplicação não informada');

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Normaliza dados do produto para inserção
   */
  normalizeProductData(data: ProductFormData): InsertProduct {
    return {
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
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
      featured: data.featured || false,
      status: data.status || 'active'
    };
  }

  /**
   * Cria um novo produto
   */
  async createProduct(data: ProductFormData): Promise<{ success: boolean; product?: Product; errors?: string[] }> {
    try {
      console.log('🆕 Criando novo produto:', data.name);

      // Validar dados
      const validation = this.validateProduct(data);
      if (!validation.isValid) {
        console.log('❌ Validação falhou:', validation.errors);
        return { success: false, errors: validation.errors };
      }

      // Verificar se código já existe
      const existingProducts = await simpleStorage.getProducts();
      const codeExists = existingProducts.some(p => p.code === data.code.toUpperCase());
      if (codeExists) {
        return { success: false, errors: ['Código do produto já existe'] };
      }

      // Normalizar e criar produto
      const normalizedData = this.normalizeProductData(data);
      const product = await simpleStorage.createProduct(normalizedData);

      console.log('✅ Produto criado com sucesso:', product.id);
      return { success: true, product };

    } catch (error) {
      console.error('❌ Erro ao criar produto:', error);
      return { success: false, errors: ['Erro interno do servidor'] };
    }
  }

  /**
   * Atualiza um produto existente
   */
  async updateProduct(id: number, data: ProductFormData): Promise<{ success: boolean; product?: Product; errors?: string[] }> {
    try {
      console.log(`🔄 Atualizando produto ${id}:`, data.name);

      // Validar dados
      const validation = this.validateProduct(data);
      if (!validation.isValid) {
        console.log('❌ Validação falhou:', validation.errors);
        return { success: false, errors: validation.errors };
      }

      // Verificar se produto existe
      const existingProduct = await simpleStorage.getProduct(id);
      if (!existingProduct) {
        return { success: false, errors: ['Produto não encontrado'] };
      }

      // Verificar se código já existe em outro produto
      const existingProducts = await simpleStorage.getProducts();
      const codeExists = existingProducts.some(p => p.code === data.code.toUpperCase() && p.id !== id);
      if (codeExists) {
        return { success: false, errors: ['Código do produto já existe'] };
      }

      // Normalizar e atualizar produto
      const normalizedData = this.normalizeProductData(data);
      const product = await simpleStorage.updateProduct(id, normalizedData);

      if (!product) {
        return { success: false, errors: ['Erro ao atualizar produto'] };
      }

      console.log('✅ Produto atualizado com sucesso:', product.id);
      return { success: true, product };

    } catch (error) {
      console.error('❌ Erro ao atualizar produto:', error);
      return { success: false, errors: ['Erro interno do servidor'] };
    }
  }

  /**
   * Remove um produto
   */
  async deleteProduct(id: number): Promise<{ success: boolean; errors?: string[] }> {
    try {
      console.log(`🗑️ Removendo produto ${id}`);

      const success = await simpleStorage.deleteProduct(id);
      if (!success) {
        return { success: false, errors: ['Produto não encontrado'] };
      }

      console.log('✅ Produto removido com sucesso:', id);
      return { success: true };

    } catch (error) {
      console.error('❌ Erro ao remover produto:', error);
      return { success: false, errors: ['Erro interno do servidor'] };
    }
  }

  /**
   * Busca produtos com filtros
   */
  async searchProducts(filters: {
    category?: string;
    brand?: string;
    search?: string;
    status?: string;
  } = {}): Promise<Product[]> {
    try {
      const products = await simpleStorage.getProducts();
      
      return products.filter(product => {
        if (filters.category && product.category !== filters.category) return false;
        if (filters.brand && product.brand !== filters.brand) return false;
        if (filters.status && product.status !== filters.status) return false;
        
        if (filters.search) {
          const search = filters.search.toLowerCase();
          return (
            product.name.toLowerCase().includes(search) ||
            product.code.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search)
          );
        }
        
        return true;
      });
    } catch (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      return [];
    }
  }

  /**
   * Gera estatísticas de produtos
   */
  async getProductStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    byBrand: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    try {
      const products = await simpleStorage.getProducts();
      
      const stats = {
        total: products.length,
        byCategory: {} as Record<string, number>,
        byBrand: {} as Record<string, number>,
        byStatus: {} as Record<string, number>
      };

      products.forEach(product => {
        // Por categoria
        stats.byCategory[product.category] = (stats.byCategory[product.category] || 0) + 1;
        
        // Por marca
        if (product.brand) {
          stats.byBrand[product.brand] = (stats.byBrand[product.brand] || 0) + 1;
        }
        
        // Por status
        stats.byStatus[product.status] = (stats.byStatus[product.status] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('❌ Erro ao gerar estatísticas:', error);
      return { total: 0, byCategory: {}, byBrand: {}, byStatus: {} };
    }
  }
}

export const productService = ProductService.getInstance();