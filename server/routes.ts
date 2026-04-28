import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertProductSchema, insertQuotationSchema, loginSchema, registerSchema, insertCategorySchema, insertBrandSchema } from "@shared/schema";
import { setupSession, authenticateCustomer, optionalAuth } from "./auth";
import { uploadProductImages, getImageUrl, deleteImageFile } from "./upload";
import { z } from "zod";
import { getImportedProducts } from "./imported-products";

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint específico para imagens de produtos com headers anti-cache
  app.get('/uploads/products/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', 'products', filename);
    
    // Headers agressivos para prevenir cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Last-Modified', new Date().toUTCString());
    res.setHeader('ETag', `"${Date.now()}"`);
    
    // Enviar arquivo se existir
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  });

  // Serve static files from uploads directory (outros arquivos)
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  // Setup session management
  setupSession(app);

  // Authentication API
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if email already exists
      const existingCustomer = await storage.getCustomerByEmail(userData.email);
      if (existingCustomer) {
        return res.status(400).json({ message: "E-mail já está em uso" });
      }

      const customer = await storage.createCustomer(userData);
      req.session.customerId = customer.id;
      req.session.customer = customer;

      // Return customer without password
      const { password, ...customerData } = customer;
      res.json(customerData);
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message || "Erro ao criar conta" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const customer = await storage.verifyCustomerPassword(email, password);
      if (!customer) {
        return res.status(401).json({ message: "E-mail ou senha inválidos" });
      }

      req.session.customerId = customer.id;
      req.session.customer = customer;

      // Return customer without password
      const { password: _, ...customerData } = customer;
      res.json(customerData);
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "Erro ao fazer login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/auth/me", authenticateCustomer, (req, res) => {
    const { password, ...customerData } = req.session.customer!;
    res.json(customerData);
  });

  // Products API with enhanced JOIN support
  app.get("/api/products", async (req, res) => {
    try {
      const { search, category, brand_id, category_id } = req.query;
      console.log("Products query params:", { search, category, brand_id, category_id });
      
      // Use database directly for filtering with JOIN queries
      const { db } = await import('./db');
      const { products, categories, brands } = await import('../shared/schema');
      const { eq, and, ilike } = await import('drizzle-orm');
      
      let query = db
        .select({
          id: products.id,
          name: products.name,
          code: products.code,
          description: products.description,
          brandId: products.brandId,
          categoryId: products.categoryId,
          diameter: products.diameter,
          width: products.width,
          material: products.material,
          imageUrl: products.imageUrl,
          rating: products.rating,
          reviewCount: products.reviewCount,
          status: products.status,
          featured: products.featured,
          categoryName: categories.name,
          brandName: brands.name
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(brands, eq(products.brandId, brands.id));

      // Build WHERE conditions dynamically
      const conditions = [];
      
      // Filter by brand_id if provided
      if (brand_id && typeof brand_id === 'string' && brand_id !== '') {
        const brandIdNum = parseInt(brand_id);
        if (!isNaN(brandIdNum)) {
          conditions.push(eq(products.brandId, brandIdNum));
        }
      }
      
      // Filter by category_id if provided
      if (category_id && typeof category_id === 'string' && category_id !== '') {
        const categoryIdNum = parseInt(category_id);
        if (!isNaN(categoryIdNum)) {
          conditions.push(eq(products.categoryId, categoryIdNum));
        }
      }
      
      // Filter by search term if provided
      if (search && typeof search === 'string' && search.trim() !== '') {
        conditions.push(ilike(products.name, `%${search.trim()}%`));
      }
      
      // Legacy category filter support (by name)
      if (category && typeof category === 'string' && category !== '' && category !== 'all') {
        conditions.push(ilike(categories.name, `%${category}%`));
      }
      
      // Apply conditions if any exist
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const filteredProducts = await query;
      
      console.log(`[products] Retornados ${filteredProducts.length} produtos (PostgreSQL)`);
      res.json(filteredProducts);
      
    } catch (error) {
      console.error("Error fetching products:", error);

      const { search, category, brand_id, category_id } = req.query;
      const fallbackProducts = getImportedProducts({
        search: typeof search === "string" ? search : undefined,
        category: typeof category === "string" ? category : undefined,
        brandId: typeof brand_id === "string" ? parseInt(brand_id) || undefined : undefined,
        categoryId: typeof category_id === "string" ? parseInt(category_id) || undefined : undefined,
      });

      console.log(`[products] Retornados ${fallbackProducts.length} produtos importados do CSV`);
      res.json(fallbackProducts);
    }
  });

  app.get("/api/products/search-suggestions", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.json([]);
      }
      
      const products = await storage.searchProducts(q);
      const suggestions = products.slice(0, 5).map(product => ({
        id: product.id,
        name: product.name,
        category: product.category
      }));
      
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  });

  // Individual product route - disabled in favor of enhanced products route with JOINs
  // app.get("/api/products/:id", async (req, res) => {
  //   try {
  //     const id = parseInt(req.params.id);
  //     const product = await storage.getProduct(id);
  //     
  //     if (!product) {
  //       return res.status(404).json({ message: "Product not found" });
  //     }
  //     
  //     res.json(product);
  //   } catch (error) {
  //     res.status(500).json({ message: "Failed to fetch product" });
  //   }
  // });

  app.post("/api/products", uploadProductImages.single('image'), async (req, res) => {
    try {
      // Processar dados do FormData ou JSON
      let productData;
      if (req.body.name && typeof req.body.name === 'string') {
        // É FormData
        productData = {
          name: req.body.name,
          code: req.body.code,
          description: req.body.description,
          categoryId: req.body.categoryId && req.body.categoryId !== '' && req.body.categoryId !== 'undefined' && !isNaN(parseInt(req.body.categoryId)) ? parseInt(req.body.categoryId) : null,
          brandId: req.body.brandId && req.body.brandId !== '' && req.body.brandId !== 'undefined' && !isNaN(parseInt(req.body.brandId)) ? parseInt(req.body.brandId) : null,
          diameter: req.body.diameter,
          width: req.body.width,
          material: req.body.material,
          hardness: req.body.hardness || null,
          maxLoad: req.body.maxLoad || null,
          application: req.body.application || null,
          price: req.body.price || null,
          featured: req.body.featured === 'true' || req.body.featured === true,
          status: req.body.status || 'active'
        };
        
        // Se há imagem, gerar URL única para forçar reload
        if (req.file) {
          const timestamp = Date.now();
          productData.imageUrl = getImageUrl(req.file.filename) + `?v=${timestamp}&force=1`;
        }
      } else {
        // É JSON
        productData = req.body;
      }
      
      const validatedData = insertProductSchema.parse(productData);
      const product = await storage.createProduct(validatedData);
      console.log("Produto criado:", product);
      res.status(201).json(product);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", uploadProductImages.single('image'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Processar dados do FormData ou JSON
      let updateData;
      if (req.body.name && typeof req.body.name === 'string') {
        // É FormData
        updateData = {
          name: req.body.name,
          code: req.body.code,
          description: req.body.description,
          categoryId: req.body.categoryId && req.body.categoryId !== '' && req.body.categoryId !== 'undefined' && !isNaN(parseInt(req.body.categoryId)) ? parseInt(req.body.categoryId) : null,
          brandId: req.body.brandId && req.body.brandId !== '' && req.body.brandId !== 'undefined' && !isNaN(parseInt(req.body.brandId)) ? parseInt(req.body.brandId) : null,
          diameter: req.body.diameter,
          width: req.body.width,
          material: req.body.material,
          hardness: req.body.hardness || null,
          maxLoad: req.body.maxLoad || null,
          application: req.body.application || null,
          price: req.body.price || null,
          featured: req.body.featured === 'true' || req.body.featured === true,
          status: req.body.status || 'active'
        };
        
        // Se há nova imagem, gerar URL única para forçar reload
        if (req.file) {
          const timestamp = Date.now();
          updateData.imageUrl = getImageUrl(req.file.filename) + `?v=${timestamp}&force=1`;
        }
      } else {
        // É JSON
        updateData = req.body;
      }
      
      // Validar dados
      const updates = insertProductSchema.partial().parse(updateData);
      const product = await storage.updateProduct(id, updates);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      console.log(`Produto ${id} atualizado:`, updates);
      res.json(product);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log(`Tentando deletar produto ID: ${id}`);
      
      const success = await storage.deleteProduct(id);
      console.log(`Resultado da exclusão do produto ${id}:`, success);
      
      if (!success) {
        console.log(`Produto ${id} não encontrado para exclusão`);
        return res.status(404).json({ message: "Product not found" });
      }
      
      console.log(`Produto ${id} deletado com sucesso`);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Upload de imagens para produtos
  app.post("/api/products/upload-images", uploadProductImages.array('images', 10), async (req, res) => {
    try {
      const productId = parseInt(req.body.productId);
      const files = req.files as Express.Multer.File[];

      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No images uploaded" });
      }

      // Store images in the storage system
      const uploadedImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageData = {
          id: Date.now() + i,
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: file.path,
          url: getImageUrl(file.filename),
          productId: productId,
          isPrimary: i === 0 // First image is primary
        };
        uploadedImages.push(imageData);
        
        // Update product with first image as main image
        if (i === 0) {
          const product = await storage.getProduct(productId);
          if (product) {
            await storage.updateProduct(productId, { 
              ...product, 
              imageUrl: imageData.url 
            });
          }
        }
      }

      console.log(`Uploaded ${uploadedImages.length} images for product ${productId}`);
      res.json(uploadedImages);
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Failed to upload images" });
    }
  });

  // Deletar imagem específica
  app.delete("/api/products/images/:imageId", async (req, res) => {
    try {
      const imageId = parseInt(req.params.imageId);
      
      // Mock implementation - always return success
      console.log(`Deleted image ${imageId}`);
      res.json({ success: true });
    } catch (error) {
      console.error("Image deletion error:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

  // Definir imagem principal
  app.patch("/api/products/images/:imageId/primary", async (req, res) => {
    try {
      const imageId = parseInt(req.params.imageId);
      
      // Mock implementation - always return success
      console.log(`Set image ${imageId} as primary`);
      res.json({ success: true });
    } catch (error) {
      console.error("Set primary image error:", error);
      res.status(500).json({ error: "Failed to set primary image" });
    }
  });

  // Categories API
  app.get("/api/product-categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/product-categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/product-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, categoryData);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/product-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Brands API
  app.get("/api/product-brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  app.post("/api/product-brands", async (req, res) => {
    try {
      const brandData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(brandData);
      res.status(201).json(brand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brand data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create brand" });
    }
  });

  app.put("/api/product-brands/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const brandData = insertBrandSchema.partial().parse(req.body);
      const brand = await storage.updateBrand(id, brandData);
      
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      res.json(brand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brand data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update brand" });
    }
  });

  app.delete("/api/product-brands/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBrand(id);
      
      if (!success) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      res.json({ message: "Brand deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });

  // Quotations API
  app.get("/api/quotations", optionalAuth, async (req, res) => {
    try {
      if (req.session.customerId) {
        // Return only customer's quotations
        const quotations = await storage.getQuotationsByCustomer(req.session.customerId);
        res.json(quotations);
      } else {
        // Return all quotations for admin
        const quotations = await storage.getQuotations();
        res.json(quotations);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotations" });
    }
  });

  app.post("/api/quotations", optionalAuth, async (req, res) => {
    try {
      const quotationData = insertQuotationSchema.parse(req.body);
      const items = req.body.items || [];
      
      // Associate quotation with logged-in customer if available
      if (req.session.customerId) {
        quotationData.customerId = req.session.customerId;
      }
      
      const quotation = await storage.createQuotation(quotationData, items);
      res.status(201).json(quotation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quotation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quotation" });
    }
  });

  app.post("/api/quotations/bulk", async (req, res) => {
    try {
      const { customerName, customerEmail, customerPhone, companyName, message, items } = req.body;
      
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Items are required for bulk quotation" });
      }

      const quotationData = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        company: companyName || "",
        products: message || `Cotação em lote para ${items.length} produtos`,
        status: "pending"
      };

      const quotation = await storage.createQuotation(quotationData, items);
      res.status(201).json(quotation);
    } catch (error) {
      console.error("Bulk quotation error:", error);
      res.status(500).json({ message: "Failed to create bulk quotation" });
    }
  });

  app.get("/api/quotations/my", authenticateCustomer, async (req, res) => {
    try {
      const quotations = await storage.getCustomerQuotationsWithItems(req.session.customerId!);
      res.json(quotations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer quotations" });
    }
  });

  // Get single quotation with items for authenticated customer
  app.get("/api/quotations/:id/details", authenticateCustomer, async (req: any, res) => {
    try {
      const quotationId = parseInt(req.params.id);
      const quotation = await storage.getQuotationWithItems(quotationId);
      
      if (!quotation) {
        return res.status(404).json({ message: "Cotação não encontrada" });
      }

      // Check if customer owns this quotation
      if (quotation.customerId !== req.session.customerId) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      res.json(quotation);
    } catch (error: any) {
      console.error("Error fetching quotation details:", error);
      res.status(500).json({ message: "Erro ao buscar detalhes da cotação" });
    }
  });

  app.put("/api/quotations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const quotation = await storage.updateQuotationStatus(id, status);
      
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      
      res.json(quotation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update quotation status" });
    }
  });

  // Legacy categories endpoint removed - now handled by dedicated brands-categories router

  // CMS Posts API
  app.get("/api/cms/posts", async (req, res) => {
    try {
      const { status, type } = req.query;
      const posts = await storage.getCmsPosts();
      
      let filteredPosts = posts;
      if (status && status !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.status === status);
      }
      if (type && type !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.type === type);
      }
      
      res.json(filteredPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/cms/posts", async (req, res) => {
    try {
      const postData = req.body;
      const post = await storage.createCmsPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/cms/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const postData = req.body;
      const post = await storage.updateCmsPost(id, postData);
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/cms/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCmsPost(id);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  app.post("/api/cms/posts/:id/publish", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.updateCmsPost(id, { 
        status: 'published' as any,
        publishedAt: new Date() as any
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to publish post" });
    }
  });

  // CMS Pages API
  app.get("/api/cms/pages", async (req, res) => {
    try {
      const pages = await storage.getCmsPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.get("/api/cms/pages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const page = await storage.getCmsPage(id);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  app.post("/api/cms/pages", async (req, res) => {
    try {
      const pageData = {
        ...req.body,
        id: Date.now(), // Temporary ID for memory storage
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Mock storage for pages since CMS methods don't exist yet
      res.status(201).json(pageData);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  app.put("/api/cms/pages", async (req, res) => {
    try {
      const pageData = {
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      
      if (!pageData.id) {
        // Create new page if no ID provided
        pageData.id = Date.now();
        pageData.createdAt = new Date().toISOString();
        return res.status(201).json(pageData);
      }
      
      // Mock update for existing page
      res.json(pageData);
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  app.delete("/api/cms/pages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // Mock deletion
      res.json({ message: "Page deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // Maintenance Mode API
  app.get("/api/maintenance", async (req, res) => {
    try {
      const maintenanceConfig = await storage.getMaintenanceMode();
      res.json(maintenanceConfig || { enabled: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to get maintenance status" });
    }
  });

  app.post("/api/maintenance", async (req, res) => {
    try {
      const config = req.body;
      await storage.setMaintenanceMode(config);
      res.json({ message: "Maintenance mode updated successfully", config });
    } catch (error) {
      res.status(500).json({ message: "Failed to update maintenance mode" });
    }
  });

  // Company Settings API
  app.get("/api/company-settings", async (req, res) => {
    try {
      const settings = await storage.getCompanySettings();
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to get company settings" });
    }
  });

  app.post("/api/company-settings", async (req, res) => {
    try {
      const settings = req.body;
      const updatedSettings = await storage.updateCompanySettings(settings);
      res.json({ message: "Company settings updated successfully", settings: updatedSettings });
    } catch (error) {
      res.status(500).json({ message: "Failed to update company settings" });
    }
  });

  // CMS Categories API
  app.get("/api/cms/categories", async (req, res) => {
    try {
      const categories = await storage.getCmsCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/cms/categories", async (req, res) => {
    try {
      const categoryData = req.body;
      const category = await storage.createCmsCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // CMS Tags API
  app.get("/api/cms/tags", async (req, res) => {
    try {
      const tags = await storage.getCmsTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  app.post("/api/cms/tags", async (req, res) => {
    try {
      const tagData = req.body;
      const tag = await storage.createCmsTag(tagData);
      res.status(201).json(tag);
    } catch (error) {
      res.status(500).json({ message: "Failed to create tag" });
    }
  });

  // CMS Media API
  app.get("/api/cms/media", async (req, res) => {
    try {
      const media = await storage.getCmsMedia();
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  app.post("/api/cms/media", async (req, res) => {
    try {
      const mediaData = req.body;
      const media = await storage.createCmsMedia(mediaData);
      res.status(201).json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload media" });
    }
  });

  // CMS Users API
  app.get("/api/cms/users", async (req, res) => {
    try {
      const users = await storage.getCmsUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/cms/users", async (req, res) => {
    try {
      const userData = req.body;
      const user = await storage.createCmsUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // CMS Comments API
  app.get("/api/cms/comments", async (req, res) => {
    try {
      const comments = await storage.getCmsComments();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/cms/comments", async (req, res) => {
    try {
      const commentData = req.body;
      const comment = await storage.createCmsComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // CMS Menus API
  app.get("/api/cms/menus", async (req, res) => {
    try {
      const menus = await storage.getCmsMenus();
      res.json(menus);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menus" });
    }
  });

  app.post("/api/cms/menus", async (req, res) => {
    try {
      const menuData = req.body;
      const menu = await storage.createCmsMenu(menuData);
      res.status(201).json(menu);
    } catch (error) {
      res.status(500).json({ message: "Failed to create menu" });
    }
  });

  // CMS Settings API
  app.get("/api/cms/settings", async (req, res) => {
    try {
      const settings = await storage.getCmsSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post("/api/cms/settings", async (req, res) => {
    try {
      const settingsData = req.body;
      const settings = await storage.updateCmsSettings(settingsData);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios" });
      }

      const { AdminAuthService } = await import('./admin-auth');
      const user = await AdminAuthService.verifyCredentials(username, password);
      
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Usuário desativado" });
      }

      // Set session
      (req.session as any).adminUserId = user.id;
      (req.session as any).adminUser = user;

      // Update last login
      await AdminAuthService.updateLastLogin(user.id);

      res.json({
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/admin/me", async (req, res) => {
    try {
      const adminUserId = (req.session as any).adminUserId;
      if (!adminUserId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const { AdminAuthService } = await import('./admin-auth');
      const user = await AdminAuthService.getUser(adminUserId);
      
      if (!user || !user.isActive) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "Usuário não encontrado ou desativado" });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Admin middleware for protected routes
  async function requireAdminAuth(req: any, res: any, next: any) {
    try {
      const adminUserId = (req.session as any).adminUserId;
      if (!adminUserId) {
        return res.status(401).json({ message: "Autenticação necessária" });
      }

      const { AdminAuthService } = await import('./admin-auth');
      const user = await AdminAuthService.getUser(adminUserId);
      
      if (!user || !user.isActive) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "Usuário não autorizado" });
      }

      req.adminUser = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "Erro de autenticação" });
    }
  }

  // Admin Users Management Routes
  app.get("/api/admin/users", requireAdminAuth, async (req, res) => {
    try {
      const { AdminAuthService } = await import('./admin-auth');
      const users = await AdminAuthService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  app.post("/api/admin/users", requireAdminAuth, async (req, res) => {
    try {
      const { username, email, password, displayName, role, isActive } = req.body;
      
      if (!username || !email || !password || !displayName) {
        return res.status(400).json({ message: "Campos obrigatórios: username, email, password, displayName" });
      }

      const { AdminAuthService } = await import('./admin-auth');
      
      // Check if username already exists
      const existingUser = await AdminAuthService.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Nome de usuário já existe" });
      }

      const newUser = await AdminAuthService.createUser({
        username,
        email,
        password,
        displayName,
        role: role || "admin",
        isActive: isActive !== undefined ? isActive : true
      });

      res.status(201).json({
        message: "Usuário criado com sucesso",
        user: {
          id: newUser.id,
          username: newUser.username,
          displayName: newUser.displayName,
          email: newUser.email,
          role: newUser.role,
          isActive: newUser.isActive
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar usuário" });
    }
  });

  app.put("/api/admin/users/:id", requireAdminAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { username, email, displayName, role, isActive, password } = req.body;

      const { AdminAuthService } = await import('./admin-auth');

      const updateData: any = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (displayName) updateData.displayName = displayName;
      if (role) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (password) updateData.password = password;

      const updatedUser = await AdminAuthService.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json({
        message: "Usuário atualizado com sucesso",
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          displayName: updatedUser.displayName,
          email: updatedUser.email,
          role: updatedUser.role,
          isActive: updatedUser.isActive
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  });

  app.delete("/api/admin/users/:id", requireAdminAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Prevent self-deletion
      if (userId === req.adminUser.id) {
        return res.status(400).json({ message: "Não é possível excluir seu próprio usuário" });
      }

      const { AdminAuthService } = await import('./admin-auth');
      const deleted = await AdminAuthService.deleteUser(userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir usuário" });
    }
  });

  // Health check and domain verification endpoints
  app.get("/health", (req, res) => {
    const status = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      domain: process.env.DOMAIN || "not configured",
      host: req.get('Host'),
      protocol: req.protocol,
      url: `${req.protocol}://${req.get('Host')}`,
      headers: {
        origin: req.get('Origin'),
        referer: req.get('Referer'),
        userAgent: req.get('User-Agent')
      }
    };
    res.json(status);
  });

  app.get("/domain-check", (req, res) => {
    const domainInfo = {
      configuredDomain: process.env.DOMAIN || null,
      currentHost: req.get('Host'),
      isCustomDomain: req.get('Host') !== 'localhost:5000' && !req.get('Host')?.includes('.replit.'),
      protocol: req.protocol,
      secure: req.secure || req.get('x-forwarded-proto') === 'https',
      timestamp: new Date().toISOString()
    };
    res.json(domainInfo);
  });

  app.get("/api/status", (req, res) => {
    res.json({
      api: "operational",
      database: "checking",
      cms: "operational",
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
