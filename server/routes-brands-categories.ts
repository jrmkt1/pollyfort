
/**
 * Rotas de Marcas e Categorias - Pollyfort
 * API endpoints CRUD completos para gerenciamento de marcas e categorias
 * Implementação híbrida com fallback para storage em memória
 */

import { Router, type Request, type Response } from 'express';
import { getDB } from './db';
import { brands, categories, products, type Brand, type Category, type InsertBrand, type InsertCategory } from '@shared/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { z } from 'zod';
import { simpleStorage } from './storage-clean';
import { getImportedBrands, getImportedCategories } from './imported-products';

const router = Router();

// Schemas de validação
const brandSchema = z.object({
  name: z.string().min(1, 'Nome da marca é obrigatório').max(255, 'Nome muito longo'),
  description: z.string().optional()
});

const categorySchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório').max(255, 'Nome muito longo'),
  description: z.string().optional()
});

// Helper function to check database availability
async function isDatabaseAvailable() {
  try {
    const db = await getDB();
    return db !== null;
  } catch (error) {
    return false;
  }
}

// ==================== MARCAS ====================

// GET /api/brands - Lista todas as marcas
router.get('/brands', async (req: Request, res: Response) => {
  try {
    const isDbAvailable = await isDatabaseAvailable();
    
    if (isDbAvailable) {
      const db = await getDB();
      const allBrands = await db
        .select({
          id: brands.id,
          name: brands.name,
          description: brands.description,
          createdAt: brands.createdAt,
          productCount: sql<number>`count(${products.id})::int`.as('productCount')
        })
        .from(brands)
        .leftJoin(products, eq(brands.id, products.brandId))
        .groupBy(brands.id, brands.name, brands.description, brands.createdAt)
        .orderBy(desc(brands.createdAt));

      console.log(`[brands] Listadas ${allBrands.length} marcas (PostgreSQL)`);
      res.json(allBrands);
    } else {
      const brandsWithCount = getImportedBrands();
      
      console.log(`[brands] Listadas ${brandsWithCount.length} marcas (Memory)`);
      res.json(brandsWithCount);
    }
  } catch (error) {
    console.error('[brands] Erro ao listar marcas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor ao listar marcas' 
    });
  }
});

// POST /api/brands - Cria nova marca
router.post('/brands', async (req: Request, res: Response) => {
  try {
    // Validação dos dados
    const validation = brandSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validation.error.errors.map(err => err.message)
      });
    }

    const { name, description } = validation.data;
    const isDbAvailable = await isDatabaseAvailable();
    
    if (isDbAvailable) {
      const db = await getDB();
      
      // Verificar se marca já existe
      const existingBrand = await db
        .select()
        .from(brands)
        .where(eq(brands.name, name))
        .limit(1);

      if (existingBrand.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Marca com este nome já existe'
        });
      }

      // Criar nova marca
      const [newBrand] = await db
        .insert(brands)
        .values({
          name,
          description: description || null
        })
        .returning();

      console.log(`[brands] Nova marca criada: ${newBrand.name} (PostgreSQL)`);
      res.status(201).json({
        success: true,
        message: 'Marca criada com sucesso',
        brand: newBrand
      });
    } else {
      // Fallback to memory storage
      const existingBrands = await simpleStorage.getBrands();
      const existingBrand = existingBrands.find(b => b.name.toLowerCase() === name.toLowerCase());
      
      if (existingBrand) {
        return res.status(409).json({
          success: false,
          message: 'Marca com este nome já existe'
        });
      }
      
      const newBrand = await simpleStorage.createBrand({
        name,
        description: description || null
      });
      
      console.log(`[brands] Nova marca criada: ${newBrand.name} (Memory)`);
      res.status(201).json({
        success: true,
        message: 'Marca criada com sucesso',
        brand: newBrand
      });
    }
  } catch (error) {
    console.error('[brands] Erro ao criar marca:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao criar marca'
    });
  }
});

// PUT /api/brands/:id - Atualiza marca existente
router.put('/brands/:id', async (req: Request, res: Response) => {
  try {
    const brandId = parseInt(req.params.id);
    if (isNaN(brandId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da marca inválido'
      });
    }

    // Validação dos dados
    const validation = brandSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validation.error.errors.map(err => err.message)
      });
    }

    const { name, description } = validation.data;
    const isDbAvailable = await isDatabaseAvailable();
    
    if (isDbAvailable) {
      const db = await getDB();
      
      // Verificar se marca existe
      const existingBrand = await db
        .select()
        .from(brands)
        .where(eq(brands.id, brandId))
        .limit(1);

      if (existingBrand.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Marca não encontrada'
        });
      }

      // Verificar se nome já existe em outra marca
      const duplicateBrand = await db
        .select()
        .from(brands)
        .where(eq(brands.name, name))
        .limit(1);

      if (duplicateBrand.length > 0 && duplicateBrand[0].id !== brandId) {
        return res.status(409).json({
          success: false,
          message: 'Já existe uma marca com este nome'
        });
      }

      // Atualizar marca
      const [updatedBrand] = await db
        .update(brands)
        .set({
          name,
          description: description || null
        })
        .where(eq(brands.id, brandId))
        .returning();

      console.log(`[brands] Marca atualizada: ${updatedBrand.name} (PostgreSQL)`);
      res.json({
        success: true,
        message: 'Marca atualizada com sucesso',
        brand: updatedBrand
      });
    } else {
      // Fallback to memory storage
      const updatedBrand = await simpleStorage.updateBrand(brandId, {
        name,
        description: description || null
      });
      
      if (!updatedBrand) {
        return res.status(404).json({
          success: false,
          message: 'Marca não encontrada'
        });
      }
      
      console.log(`[brands] Marca atualizada: ${updatedBrand.name} (Memory)`);
      res.json({
        success: true,
        message: 'Marca atualizada com sucesso',
        brand: updatedBrand
      });
    }
  } catch (error) {
    console.error('[brands] Erro ao atualizar marca:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao atualizar marca'
    });
  }
});

// DELETE /api/brands/:id - Remove marca
router.delete('/brands/:id', async (req: Request, res: Response) => {
  try {
    const brandId = parseInt(req.params.id);
    if (isNaN(brandId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da marca inválido'
      });
    }

    const isDbAvailable = await isDatabaseAvailable();
    
    if (isDbAvailable) {
      const db = await getDB();
      
      // Verificar se marca existe
      const existingBrand = await db
        .select()
        .from(brands)
        .where(eq(brands.id, brandId))
        .limit(1);

      if (existingBrand.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Marca não encontrada'
        });
      }

      // Verificar se existem produtos usando esta marca (by name comparison for compatibility)
      const allProducts = await db.select().from(products);
      const productsUsingBrand = allProducts.filter(p => p.brand === existingBrand[0].name);

      if (productsUsingBrand.length > 0) {
        return res.status(409).json({
          success: false,
          message: `Não é possível excluir marca que está sendo usada por ${productsUsingBrand.length} produto(s)`
        });
      }

      // Remover marca
      await db
        .delete(brands)
        .where(eq(brands.id, brandId));

      console.log(`[brands] Marca removida: ${existingBrand[0].name} (PostgreSQL)`);
      res.json({
        success: true,
        message: 'Marca removida com sucesso'
      });
    } else {
      // Fallback to memory storage
      const deleted = await simpleStorage.deleteBrand(brandId);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Marca não encontrada'
        });
      }
      
      console.log(`[brands] Marca removida (Memory)`);
      res.json({
        success: true,
        message: 'Marca removida com sucesso'
      });
    }
  } catch (error) {
    console.error('[brands] Erro ao remover marca:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao remover marca'
    });
  }
});

// ==================== CATEGORIAS ====================

// GET /api/categories - Lista todas as categorias
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const isDbAvailable = await isDatabaseAvailable();
    
    if (isDbAvailable) {
      const db = await getDB();
      const allCategories = await db
        .select({
          id: categories.id,
          name: categories.name,
          description: categories.description,
          createdAt: categories.createdAt,
          productCount: sql<number>`count(${products.id})::int`.as('productCount')
        })
        .from(categories)
        .leftJoin(products, eq(categories.id, products.categoryId))
        .groupBy(categories.id, categories.name, categories.description, categories.createdAt)
        .orderBy(desc(categories.createdAt));

      console.log(`[categories] Listadas ${allCategories.length} categorias (PostgreSQL)`);
      res.json(allCategories);
    } else {
      const categoriesWithCount = getImportedCategories();
      
      console.log(`[categories] Listadas ${categoriesWithCount.length} categorias (Memory)`);
      res.json(categoriesWithCount);
    }
  } catch (error) {
    console.error('[categories] Erro ao listar categorias:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao listar categorias'
    });
  }
});

// POST /api/categories - Cria nova categoria
router.post('/categories', async (req: Request, res: Response) => {
  try {
    // Validação dos dados
    const validation = categorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validation.error.errors.map(err => err.message)
      });
    }

    const { name, description } = validation.data;
    const isDbAvailable = await isDatabaseAvailable();
    
    if (isDbAvailable) {
      const db = await getDB();
      
      // Verificar se categoria já existe
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.name, name))
        .limit(1);

      if (existingCategory.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Categoria com este nome já existe'
        });
      }

      // Criar nova categoria
      const [newCategory] = await db
        .insert(categories)
        .values({
          name,
          description: description || null
        })
        .returning();

      console.log(`[categories] Nova categoria criada: ${newCategory.name} (PostgreSQL)`);
      res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        category: newCategory
      });
    } else {
      // Fallback to memory storage
      const existingCategories = await simpleStorage.getCategories();
      const existingCategory = existingCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
      
      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: 'Categoria com este nome já existe'
        });
      }
      
      const newCategory = await simpleStorage.createCategory({
        name,
        description: description || null
      });
      
      console.log(`[categories] Nova categoria criada: ${newCategory.name} (Memory)`);
      res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        category: newCategory
      });
    }
  } catch (error) {
    console.error('[categories] Erro ao criar categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao criar categoria'
    });
  }
});

// PUT /api/categories/:id - Atualiza categoria existente
router.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da categoria inválido'
      });
    }

    // Validação dos dados
    const validation = categorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validation.error.errors.map(err => err.message)
      });
    }

    const { name, description } = validation.data;
    const isDbAvailable = await isDatabaseAvailable();
    
    if (isDbAvailable) {
      const db = await getDB();
      
      // Verificar se categoria existe
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId))
        .limit(1);

      if (existingCategory.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      // Verificar se nome já existe em outra categoria
      const duplicateCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.name, name))
        .limit(1);

      if (duplicateCategory.length > 0 && duplicateCategory[0].id !== categoryId) {
        return res.status(409).json({
          success: false,
          message: 'Já existe uma categoria com este nome'
        });
      }

      // Atualizar categoria
      const [updatedCategory] = await db
        .update(categories)
        .set({
          name,
          description: description || null
        })
        .where(eq(categories.id, categoryId))
        .returning();

      console.log(`[categories] Categoria atualizada: ${updatedCategory.name} (PostgreSQL)`);
      res.json({
        success: true,
        message: 'Categoria atualizada com sucesso',
        category: updatedCategory
      });
    } else {
      // Fallback to memory storage
      const updatedCategory = await simpleStorage.updateCategory(categoryId, {
        name,
        description: description || null
      });
      
      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }
      
      console.log(`[categories] Categoria atualizada: ${updatedCategory.name} (Memory)`);
      res.json({
        success: true,
        message: 'Categoria atualizada com sucesso',
        category: updatedCategory
      });
    }
  } catch (error) {
    console.error('[categories] Erro ao atualizar categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao atualizar categoria'
    });
  }
});

// DELETE /api/categories/:id - Remove categoria
router.delete('/categories/:id', async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da categoria inválido'
      });
    }

    const isDbAvailable = await isDatabaseAvailable();
    
    if (isDbAvailable) {
      const db = await getDB();
      
      // Verificar se categoria existe
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId))
        .limit(1);

      if (existingCategory.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      // Verificar se existem produtos usando esta categoria (by name comparison for compatibility)
      const allProducts = await db.select().from(products);
      const productsUsingCategory = allProducts.filter(p => p.category === existingCategory[0].name);

      if (productsUsingCategory.length > 0) {
        return res.status(409).json({
          success: false,
          message: `Não é possível excluir categoria que está sendo usada por ${productsUsingCategory.length} produto(s)`
        });
      }

      // Remover categoria
      await db
        .delete(categories)
        .where(eq(categories.id, categoryId));

      console.log(`[categories] Categoria removida: ${existingCategory[0].name} (PostgreSQL)`);
      res.json({
        success: true,
        message: 'Categoria removida com sucesso'
      });
    } else {
      // Fallback to memory storage
      const deleted = await simpleStorage.deleteCategory(categoryId);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }
      
      console.log(`[categories] Categoria removida (Memory)`);
      res.json({
        success: true,
        message: 'Categoria removida com sucesso'
      });
    }
  } catch (error) {
    console.error('[categories] Erro ao remover categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao remover categoria'
    });
  }
});

// DELETE /api/brands/bulk - Remove múltiplas marcas
router.delete('/brands/bulk', async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lista de IDs é obrigatória'
      });
    }

    const isDbAvailable = await isDatabaseAvailable();
    const results = [];
    
    for (const id of ids) {
      try {
        const brandId = parseInt(id);
        if (isNaN(brandId)) continue;

        if (isDbAvailable) {
          const db = await getDB();
          
          // Verificar se marca existe
          const existingBrand = await db
            .select()
            .from(brands)
            .where(eq(brands.id, brandId))
            .limit(1);

          if (existingBrand.length === 0) {
            results.push({ id: brandId, success: false, message: 'Marca não encontrada' });
            continue;
          }

          // Verificar produtos usando esta marca
          const allProducts = await db.select().from(products);
          const productsUsingBrand = allProducts.filter(p => p.brand === existingBrand[0].name);

          if (productsUsingBrand.length > 0) {
            results.push({ 
              id: brandId, 
              success: false, 
              message: `Marca em uso por ${productsUsingBrand.length} produto(s)` 
            });
            continue;
          }

          // Remover marca
          await db.delete(brands).where(eq(brands.id, brandId));
          results.push({ id: brandId, success: true, message: 'Marca removida' });
        } else {
          // Memory storage fallback
          const deleted = await simpleStorage.deleteBrand(brandId);
          results.push({ 
            id: brandId, 
            success: deleted, 
            message: deleted ? 'Marca removida' : 'Marca não encontrada' 
          });
        }
      } catch (error) {
        results.push({ id, success: false, message: 'Erro ao remover marca' });
      }
    }

    res.json({
      success: true,
      message: 'Operação de remoção concluída',
      results
    });
  } catch (error) {
    console.error('[brands] Erro na remoção em lote:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/categories/bulk - Remove múltiplas categorias
router.delete('/categories/bulk', async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lista de IDs é obrigatória'
      });
    }

    const isDbAvailable = await isDatabaseAvailable();
    const results = [];
    
    for (const id of ids) {
      try {
        const categoryId = parseInt(id);
        if (isNaN(categoryId)) continue;

        if (isDbAvailable) {
          const db = await getDB();
          
          // Verificar se categoria existe
          const existingCategory = await db
            .select()
            .from(categories)
            .where(eq(categories.id, categoryId))
            .limit(1);

          if (existingCategory.length === 0) {
            results.push({ id: categoryId, success: false, message: 'Categoria não encontrada' });
            continue;
          }

          // Verificar produtos usando esta categoria
          const allProducts = await db.select().from(products);
          const productsUsingCategory = allProducts.filter(p => p.category === existingCategory[0].name);

          if (productsUsingCategory.length > 0) {
            results.push({ 
              id: categoryId, 
              success: false, 
              message: `Categoria em uso por ${productsUsingCategory.length} produto(s)` 
            });
            continue;
          }

          // Remover categoria
          await db.delete(categories).where(eq(categories.id, categoryId));
          results.push({ id: categoryId, success: true, message: 'Categoria removida' });
        } else {
          // Memory storage fallback
          const deleted = await simpleStorage.deleteCategory(categoryId);
          results.push({ 
            id: categoryId, 
            success: deleted, 
            message: deleted ? 'Categoria removida' : 'Categoria não encontrada' 
          });
        }
      } catch (error) {
        results.push({ id, success: false, message: 'Erro ao remover categoria' });
      }
    }

    res.json({
      success: true,
      message: 'Operação de remoção concluída',
      results
    });
  } catch (error) {
    console.error('[categories] Erro na remoção em lote:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export { router as brandsAndCategoriesRouter };
