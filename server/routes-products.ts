/**
 * Rotas Otimizadas de Produtos - Pollyfort
 * API endpoints para gerenciamento de produtos com validação
 */

import { Router } from 'express';
import { z } from 'zod';
import { productService, ProductFormData } from './product-service';
import { simpleStorage } from './storage-clean';

const router = Router();

// Schema de validação para produto
const ProductSchema = z.object({
  name: z.string().min(5, 'Nome deve ter pelo menos 5 caracteres'),
  code: z.string().min(3, 'Código deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  diameter: z.string().min(1, 'Diâmetro é obrigatório'),
  width: z.string().min(1, 'Largura é obrigatória'),
  material: z.string().min(1, 'Material é obrigatório'),
  hardness: z.string().optional(),
  maxLoad: z.string().optional(),
  application: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional()
});

// GET /api/v2/products - Listar produtos com filtros
router.get('/products', async (req, res) => {
  try {
    const { category, brand, search, status, page = '1', limit = '50' } = req.query;
    
    const filters = {
      category: category as string,
      brand: brand as string,
      search: search as string,
      status: status as string
    };

    const products = await productService.searchProducts(filters);
    
    // Paginação
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: products.length,
        totalPages: Math.ceil(products.length / limitNum)
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/v2/products/:id - Obter produto específico
router.get('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }
    
    const product = await simpleStorage.getProduct(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('❌ Erro ao obter produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/v2/products - Criar novo produto
router.post('/products', async (req, res) => {
  try {
    console.log('📝 Nova requisição de criação de produto:', req.body);
    
    // Validar dados com Zod
    const validation = ProductSchema.safeParse(req.body);
    
    if (!validation.success) {
      const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      console.log('❌ Validação Zod falhou:', errors);
      
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: errors
      });
    }
    
    // Criar produto usando o service
    const result = await productService.createProduct(validation.data as ProductFormData);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Erro ao criar produto',
        details: result.errors
      });
    }
    
    res.status(201).json({
      success: true,
      data: result.product,
      message: 'Produto criado com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// PUT /api/v2/products/:id - Atualizar produto
router.put('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }
    
    console.log(`📝 Atualizando produto ${id}:`, req.body);
    
    // Validar dados com Zod
    const validation = ProductSchema.safeParse(req.body);
    
    if (!validation.success) {
      const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      console.log('❌ Validação Zod falhou:', errors);
      
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: errors
      });
    }
    
    // Atualizar produto usando o service
    const result = await productService.updateProduct(id, validation.data as ProductFormData);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Erro ao atualizar produto',
        details: result.errors
      });
    }
    
    res.json({
      success: true,
      data: result.product,
      message: 'Produto atualizado com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/v2/products/:id - Deletar produto
router.delete('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }
    
    const result = await productService.deleteProduct(id);
    
    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
        details: result.errors
      });
    }
    
    res.json({
      success: true,
      message: 'Produto removido com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro ao deletar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/v2/products/stats - Estatísticas de produtos
router.get('/products/stats', async (req, res) => {
  try {
    const stats = await productService.getProductStats();
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/v2/categories - Listar categorias
router.get('/categories', async (req, res) => {
  try {
    const categories = await simpleStorage.getCategories();
    
    res.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/v2/brands - Listar marcas
router.get('/brands', async (req, res) => {
  try {
    const brands = await simpleStorage.getBrands();
    
    res.json({
      success: true,
      data: brands
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar marcas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

export default router;