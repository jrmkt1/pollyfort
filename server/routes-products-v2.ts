
/**
 * Rotas de Produtos V2 - Pollyfort
 * Sistema completamente redesenhado com melhor performance e validação
 */

import { Router } from 'express';
import { productServiceV2 } from './product-service-v2';
import { simpleStorage } from './storage-clean';

const router = Router();

// Middleware para log de requests
router.use((req, res, next) => {
  console.log(`📡 [ProductsV2] ${req.method} ${req.path}`, 
    req.method === 'POST' || req.method === 'PUT' ? req.body : req.query
  );
  next();
});

// GET /api/v2/products - Listar produtos com filtros avançados
router.get('/products', async (req, res) => {
  try {
    const {
      category,
      brand,
      search,
      status,
      featured,
      priceMin,
      priceMax,
      page = '1',
      limit = '50',
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const filters = {
      category: category as string,
      brand: brand as string,
      search: search as string,
      status: status as string,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      priceMin: priceMin ? parseFloat(priceMin as string) : undefined,
      priceMax: priceMax ? parseFloat(priceMax as string) : undefined
    };

    let products = await productServiceV2.searchProducts(filters);

    // Ordenação
    products.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === 'price') {
        aValue = aValue ? parseFloat(aValue) : 0;
        bValue = bValue ? parseFloat(bValue) : 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    // Paginação
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
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
        totalPages: Math.ceil(products.length / limitNum),
        hasNext: endIndex < products.length,
        hasPrev: pageNum > 1
      },
      filters: filters,
      sort: { sortBy, sortOrder }
    });
    
  } catch (error) {
    console.error('❌ [ProductsV2] Erro ao listar produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Não foi possível carregar os produtos'
    });
  }
});

// GET /api/v2/products/:id - Obter produto específico
router.get('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido',
        message: 'O ID do produto deve ser um número positivo'
      });
    }
    
    const product = await productServiceV2.getProduct(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
        message: `Produto com ID ${id} não existe`
      });
    }
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('❌ [ProductsV2] Erro ao obter produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Não foi possível carregar o produto'
    });
  }
});

// POST /api/v2/products - Criar novo produto
router.post('/products', async (req, res) => {
  try {
    console.log('📝 [ProductsV2] Nova requisição de criação:', req.body);
    
    const result = await productServiceV2.createProduct(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Erro de validação',
        message: 'Dados do produto são inválidos',
        details: result.errors
      });
    }
    
    res.status(201).json({
      success: true,
      data: result.product,
      message: result.message
    });
    
  } catch (error) {
    console.error('❌ [ProductsV2] Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Não foi possível criar o produto'
    });
  }
});

// PUT /api/v2/products/:id - Atualizar produto
router.put('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido',
        message: 'O ID do produto deve ser um número positivo'
      });
    }
    
    console.log(`📝 [ProductsV2] Atualizando produto ${id}:`, req.body);
    
    const result = await productServiceV2.updateProduct(id, req.body);
    
    if (!result.success) {
      const status = result.errors?.includes('Produto não encontrado') ? 404 : 400;
      return res.status(status).json({
        success: false,
        error: status === 404 ? 'Produto não encontrado' : 'Erro de validação',
        message: result.errors?.[0] || 'Erro ao atualizar produto',
        details: result.errors
      });
    }
    
    res.json({
      success: true,
      data: result.product,
      message: result.message
    });
    
  } catch (error) {
    console.error('❌ [ProductsV2] Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Não foi possível atualizar o produto'
    });
  }
});

// DELETE /api/v2/products/:id - Deletar produto
router.delete('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido',
        message: 'O ID do produto deve ser um número positivo'
      });
    }
    
    const result = await productServiceV2.deleteProduct(id);
    
    if (!result.success) {
      const status = result.errors?.includes('Produto não encontrado') ? 404 : 400;
      return res.status(status).json({
        success: false,
        error: status === 404 ? 'Produto não encontrado' : 'Erro ao deletar',
        message: result.errors?.[0] || 'Erro ao deletar produto',
        details: result.errors
      });
    }
    
    res.json({
      success: true,
      message: result.message
    });
    
  } catch (error) {
    console.error('❌ [ProductsV2] Erro ao deletar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Não foi possível deletar o produto'
    });
  }
});

// GET /api/v2/products-stats - Estatísticas detalhadas de produtos
router.get('/products-stats', async (req, res) => {
  try {
    const stats = await productServiceV2.getDetailedStats();
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('❌ [ProductsV2] Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Não foi possível carregar estatísticas'
    });
  }
});

// POST /api/v2/products/validate - Validar dados sem salvar
router.post('/products/validate', async (req, res) => {
  try {
    const validation = productServiceV2.validateProductInput(req.body);
    
    res.json({
      success: true,
      data: {
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings
      }
    });
    
  } catch (error) {
    console.error('❌ [ProductsV2] Erro ao validar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Não foi possível validar o produto'
    });
  }
});

// GET /api/v2/categories - Listar categorias (mantido para compatibilidade)
router.get('/categories', async (req, res) => {
  try {
    const categories = await simpleStorage.getCategories();
    
    res.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    console.error('❌ [ProductsV2] Erro ao listar categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Não foi possível carregar categorias'
    });
  }
});

// GET /api/v2/brands - Listar marcas (mantido para compatibilidade)
router.get('/brands', async (req, res) => {
  try {
    const brands = await simpleStorage.getBrands();
    
    res.json({
      success: true,
      data: brands
    });
    
  } catch (error) {
    console.error('❌ [ProductsV2] Erro ao listar marcas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Não foi possível carregar marcas'
    });
  }
});

export default router;
