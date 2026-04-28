/**
 * Rotas de Produtos Aprimoradas - Pollyfort
 * API produtos atualizada com suporte a marcas e categorias via JOIN
 */

import { Router, type Request, type Response } from 'express';
import { getDB } from './db';
import { products, brands, categories, productImages, type Product, type InsertProduct } from '@shared/schema';
import { eq, sql, desc, and, or, ilike } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Schema de validação para produtos
const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  code: z.string().min(1, 'Código é obrigatório').max(100, 'Código muito longo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  brandId: z.number().int().positive('ID da marca deve ser um número positivo').nullable(),
  categoryId: z.number().int().positive('ID da categoria deve ser um número positivo').nullable(),
  diameter: z.string().min(1, 'Diâmetro é obrigatório'),
  width: z.string().min(1, 'Largura é obrigatória'),
  material: z.string().min(1, 'Material é obrigatório'),
  imageUrl: z.string().url().optional().nullable(),
  rating: z.number().int().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  status: z.enum(['active', 'inactive', 'draft']).default('active'),
  featured: z.boolean().default(false)
});

// GET /api/products - Lista produtos com JOINs para marca e categoria
router.get('/products', async (req: Request, res: Response) => {
  try {
    const db = await getDB();
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const { search, category: categoryFilter, brand: brandFilter, status: statusFilter } = req.query;

    let whereConditions = [];
    
    // Filtro de busca
    if (search && typeof search === 'string') {
      whereConditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`),
          ilike(products.code, `%${search}%`)
        )
      );
    }

    // Filtro por categoria
    if (categoryFilter && typeof categoryFilter === 'string') {
      whereConditions.push(ilike(categories.name, `%${categoryFilter}%`));
    }

    // Filtro por marca
    if (brandFilter && typeof brandFilter === 'string') {
      whereConditions.push(ilike(brands.name, `%${brandFilter}%`));
    }

    // Filtro por status
    if (statusFilter && typeof statusFilter === 'string') {
      whereConditions.push(eq(products.status, statusFilter));
    }

    const productsWithDetails = await db
      .select({
        id: products.id,
        name: products.name,
        code: products.code,
        description: products.description,
        brandId: products.brandId,
        brandName: brands.name,
        categoryId: products.categoryId,
        categoryName: categories.name,
        diameter: products.diameter,
        width: products.width,
        material: products.material,
        imageUrl: products.imageUrl,
        rating: products.rating,
        reviewCount: products.reviewCount,
        status: products.status,
        featured: products.featured
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(products.featured), desc(products.id))
      .catch((error) => {
        console.error('Database query error in products route:', error);
        throw error;
      });

    console.log(`[products] Listados ${productsWithDetails.length} produtos com detalhes de marca e categoria`);
    res.json(productsWithDetails);
  } catch (error) {
    console.error('[products] Erro ao listar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao listar produtos'
    });
  }
});

// GET /api/products/:id - Busca produto específico com detalhes
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDB();
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'ID do produto inválido'
      });
    }

    const [productWithDetails] = await db
      .select({
        id: products.id,
        name: products.name,
        code: products.code,
        description: products.description,
        brandId: products.brandId,
        brandName: brands.name,
        categoryId: products.categoryId,
        categoryName: categories.name,
        diameter: products.diameter,
        width: products.width,
        material: products.material,
        imageUrl: products.imageUrl,
        rating: products.rating,
        reviewCount: products.reviewCount,
        status: products.status,
        featured: products.featured
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, productId))
      .limit(1);

    if (!productWithDetails) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Buscar imagens do produto
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(desc(productImages.isPrimary), productImages.id);

    const result = {
      ...productWithDetails,
      images
    };

    console.log(`[products] Produto ${productId} encontrado com detalhes completos`);
    res.json(result);
  } catch (error) {
    console.error('[products] Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar produto'
    });
  }
});

// POST /api/products - Cria novo produto
router.post('/products', async (req: Request, res: Response) => {
  try {
    // Validação dos dados
    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      });
    }

    const productData = validation.data;

    // Verificar se código já existe
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.code, productData.code))
      .limit(1);

    if (existingProduct.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Produto com este código já existe'
      });
    }

    // Verificar se marca existe (se informada)
    if (productData.brandId) {
      const brand = await db
        .select()
        .from(brands)
        .where(eq(brands.id, productData.brandId))
        .limit(1);
      
      if (brand.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Marca especificada não existe'
        });
      }
    }

    // Verificar se categoria existe (se informada)
    if (productData.categoryId) {
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.id, productData.categoryId))
        .limit(1);
      
      if (category.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Categoria especificada não existe'
        });
      }
    }

    // Criar produto
    const [newProduct] = await db
      .insert(products)
      .values({
        name: productData.name,
        code: productData.code,
        description: productData.description,
        brandId: productData.brandId,
        categoryId: productData.categoryId,
        diameter: productData.diameter,
        width: productData.width,
        material: productData.material,
        imageUrl: productData.imageUrl,
        rating: productData.rating || 0,
        reviewCount: productData.reviewCount || 0,
        status: productData.status,
        featured: productData.featured
      })
      .returning();

    console.log(`[products] Novo produto criado: ${newProduct.name} (ID: ${newProduct.id})`);
    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      product: newProduct
    });
  } catch (error) {
    console.error('[products] Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao criar produto'
    });
  }
});

// PUT /api/products/:id - Atualiza produto existente
router.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'ID do produto inválido'
      });
    }

    // Validação dos dados
    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      });
    }

    const productData = validation.data;

    // Verificar se produto existe
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Verificar se código já existe em outro produto
    const duplicateProduct = await db
      .select()
      .from(products)
      .where(eq(products.code, productData.code))
      .limit(1);

    if (duplicateProduct.length > 0 && duplicateProduct[0].id !== productId) {
      return res.status(409).json({
        success: false,
        message: 'Já existe um produto com este código'
      });
    }

    // Verificar se marca existe (se informada)
    if (productData.brandId) {
      const brand = await db
        .select()
        .from(brands)
        .where(eq(brands.id, productData.brandId))
        .limit(1);
      
      if (brand.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Marca especificada não existe'
        });
      }
    }

    // Verificar se categoria existe (se informada)
    if (productData.categoryId) {
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.id, productData.categoryId))
        .limit(1);
      
      if (category.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Categoria especificada não existe'
        });
      }
    }

    // Atualizar produto
    const [updatedProduct] = await db
      .update(products)
      .set({
        name: productData.name,
        code: productData.code,
        description: productData.description,
        brandId: productData.brandId,
        categoryId: productData.categoryId,
        diameter: productData.diameter,
        width: productData.width,
        material: productData.material,
        imageUrl: productData.imageUrl,
        rating: productData.rating,
        reviewCount: productData.reviewCount,
        status: productData.status,
        featured: productData.featured
      })
      .where(eq(products.id, productId))
      .returning();

    console.log(`[products] Produto atualizado: ${updatedProduct.name} (ID: ${updatedProduct.id})`);
    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      product: updatedProduct
    });
  } catch (error) {
    console.error('[products] Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao atualizar produto'
    });
  }
});

// DELETE /api/products/:id - Remove produto
router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'ID do produto inválido'
      });
    }

    // Verificar se produto existe
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Remover produto (as imagens serão removidas automaticamente pelo CASCADE)
    await db
      .delete(products)
      .where(eq(products.id, productId));

    console.log(`[products] Produto removido: ${existingProduct[0].name} (ID: ${productId})`);
    res.json({
      success: true,
      message: 'Produto removido com sucesso'
    });
  } catch (error) {
    console.error('[products] Erro ao remover produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao remover produto'
    });
  }
});

// GET /api/products/stats - Estatísticas de produtos
router.get('/products/stats', async (req: Request, res: Response) => {
  try {
    // Contagem total de produtos
    const [totalProducts] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products);

    // Produtos por categoria
    const productsByCategory = await db
      .select({
        categoryId: categories.id,
        categoryName: categories.name,
        count: sql<number>`count(${products.id})::int`
      })
      .from(categories)
      .leftJoin(products, eq(categories.id, products.categoryId))
      .groupBy(categories.id, categories.name)
      .orderBy(desc(sql`count(${products.id})`));

    // Produtos por marca
    const productsByBrand = await db
      .select({
        brandId: brands.id,
        brandName: brands.name,
        count: sql<number>`count(${products.id})::int`
      })
      .from(brands)
      .leftJoin(products, eq(brands.id, products.brandId))
      .groupBy(brands.id, brands.name)
      .orderBy(desc(sql`count(${products.id})`));

    // Produtos em destaque
    const [featuredCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(eq(products.featured, true));

    const stats = {
      totalProducts: totalProducts.count,
      featuredProducts: featuredCount.count,
      productsByCategory,
      productsByBrand
    };

    console.log('[products] Estatísticas geradas com sucesso');
    res.json(stats);
  } catch (error) {
    console.error('[products] Erro ao gerar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao gerar estatísticas'
    });
  }
});

export default router;