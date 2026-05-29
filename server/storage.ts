import { 
  products, quotations, quotationItems, customers, categories, brands,
  cmsUsers, cmsPosts, cmsCategories, cmsTags, cmsMedia, cmsComments, cmsOptions, cmsMenus, cmsMenuItems,
  type Product, type InsertProduct, type Quotation, type InsertQuotation, type Customer, type InsertCustomer,
  type Category, type InsertCategory, type Brand, type InsertBrand,
  type CmsUser, type InsertCmsUser, type CmsPost, type InsertCmsPost, type CmsCategory, type InsertCmsCategory,
  type CmsTag, type InsertCmsTag, type CmsMedia, type InsertCmsMedia, type CmsComment, type InsertCmsComment,
  type CmsOption, type InsertCmsOption, type CmsMenu, type InsertCmsMenu, type CmsMenuItem, type InsertCmsMenuItem
} from "@shared/schema";
import { db, getDB } from "./db";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Quotations
  getQuotations(): Promise<Quotation[]>;
  getQuotation(id: number): Promise<Quotation | undefined>;
  createQuotation(quotation: InsertQuotation, items?: { productId: number; quantity: number }[]): Promise<Quotation>;
  updateQuotationStatus(id: number, status: string): Promise<Quotation | undefined>;
  getQuotationsByCustomer(customerId: number): Promise<Quotation[]>;
  getQuotationWithItems(quotationId: number): Promise<any>;
  getCustomerQuotationsWithItems(customerId: number): Promise<any[]>;
  updateQuotationResponse(id: number, responseMessage: string, totalValue?: string, validUntil?: Date): Promise<Quotation | undefined>;
  
  // Customers
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  verifyCustomerPassword(email: string, password: string): Promise<Customer | null>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Brands
  getBrands(): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: number): Promise<boolean>;

  // CMS Users
  getCmsUsers(): Promise<CmsUser[]>;
  getCmsUser(id: number): Promise<CmsUser | undefined>;
  getCmsUserByEmail(email: string): Promise<CmsUser | undefined>;
  getCmsUserByUsername(username: string): Promise<CmsUser | undefined>;
  createCmsUser(user: InsertCmsUser): Promise<CmsUser>;
  updateCmsUser(id: number, user: Partial<InsertCmsUser>): Promise<CmsUser | undefined>;
  deleteCmsUser(id: number): Promise<boolean>;
  verifyCmsUserPassword(username: string, password: string): Promise<CmsUser | null>;

  // CMS Posts
  getCmsPosts(filters?: { type?: string; status?: string; authorId?: number }): Promise<CmsPost[]>;
  getCmsPost(id: number): Promise<CmsPost | undefined>;
  getCmsPostBySlug(slug: string): Promise<CmsPost | undefined>;
  createCmsPost(post: InsertCmsPost): Promise<CmsPost>;
  updateCmsPost(id: number, post: Partial<InsertCmsPost>): Promise<CmsPost | undefined>;
  deleteCmsPost(id: number): Promise<boolean>;
  publishCmsPost(id: number): Promise<CmsPost | undefined>;

  // CMS Pages (subset of posts with type='page')
  getCmsPages(): Promise<CmsPost[]>;
  getCmsPage(id: number): Promise<CmsPost | undefined>;

  // CMS Categories
  getCmsCategories(): Promise<CmsCategory[]>;
  getCmsCategory(id: number): Promise<CmsCategory | undefined>;
  getCmsCategoryBySlug(slug: string): Promise<CmsCategory | undefined>;
  createCmsCategory(category: InsertCmsCategory): Promise<CmsCategory>;
  updateCmsCategory(id: number, category: Partial<InsertCmsCategory>): Promise<CmsCategory | undefined>;
  deleteCmsCategory(id: number): Promise<boolean>;

  // CMS Tags
  getCmsTags(): Promise<CmsTag[]>;
  getCmsTag(id: number): Promise<CmsTag | undefined>;
  getCmsTagBySlug(slug: string): Promise<CmsTag | undefined>;
  createCmsTag(tag: InsertCmsTag): Promise<CmsTag>;
  updateCmsTag(id: number, tag: Partial<InsertCmsTag>): Promise<CmsTag | undefined>;
  deleteCmsTag(id: number): Promise<boolean>;

  // CMS Media
  getCmsMedia(): Promise<CmsMedia[]>;
  getCmsMediaItem(id: number): Promise<CmsMedia | undefined>;
  createCmsMedia(media: InsertCmsMedia): Promise<CmsMedia>;
  updateCmsMedia(id: number, media: Partial<InsertCmsMedia>): Promise<CmsMedia | undefined>;
  deleteCmsMedia(id: number): Promise<boolean>;

  // CMS Comments
  getCmsComments(postId?: number): Promise<CmsComment[]>;
  getCmsComment(id: number): Promise<CmsComment | undefined>;
  createCmsComment(comment: InsertCmsComment): Promise<CmsComment>;
  updateCmsComment(id: number, comment: Partial<InsertCmsComment>): Promise<CmsComment | undefined>;
  deleteCmsComment(id: number): Promise<boolean>;
  moderateCmsComment(id: number, status: string): Promise<CmsComment | undefined>;

  // CMS Options
  getCmsOption(name: string): Promise<CmsOption | undefined>;
  setCmsOption(name: string, value: string): Promise<CmsOption>;
  getCmsOptions(): Promise<CmsOption[]>;

  // Maintenance Mode
  getMaintenanceMode(): Promise<any>;
  setMaintenanceMode(config: any): Promise<void>;

  // Product Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Product Brands
  getBrands(): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, updates: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: number): Promise<boolean>;

  // CMS Menus
  getCmsMenus(): Promise<CmsMenu[]>;
  getCmsMenu(id: number): Promise<CmsMenu | undefined>;
  getCmsMenuBySlug(slug: string): Promise<CmsMenu | undefined>;
  createCmsMenu(menu: InsertCmsMenu): Promise<CmsMenu>;
  updateCmsMenu(id: number, menu: Partial<InsertCmsMenu>): Promise<CmsMenu | undefined>;
  deleteCmsMenu(id: number): Promise<boolean>;

  // CMS Menu Items
  getCmsMenuItems(menuId: number): Promise<CmsMenuItem[]>;
  createCmsMenuItem(item: InsertCmsMenuItem): Promise<CmsMenuItem>;
  updateCmsMenuItem(id: number, item: Partial<InsertCmsMenuItem>): Promise<CmsMenuItem | undefined>;
  deleteCmsMenuItem(id: number): Promise<boolean>;

  // CMS Settings
  getCmsSettings(): Promise<Record<string, any>>;
  updateCmsSettings(settings: Record<string, any>): Promise<Record<string, any>>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    const result = await db.select().from(products).where(eq(products.status, "active"));
    return result;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const result = await db.select().from(products)
      .where(and(eq(products.category, category), eq(products.status, "active")));
    return result;
  }

  async searchProducts(query: string): Promise<Product[]> {
    // Using ILIKE for case-insensitive search
    const searchTerm = `%${query.toLowerCase()}%`;
    const result = await db.select().from(products)
      .where(eq(products.status, "active"));
    
    // Filter results manually since we need complex OR conditions
    return result.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.code.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      console.log(`[storage] Tentando deletar produto ID: ${id}`);
      
      // Verificar se o produto existe antes de deletar
      const existingProduct = await db.select().from(products).where(eq(products.id, id));
      if (existingProduct.length === 0) {
        console.log(`[storage] Produto ${id} não encontrado`);
        return false;
      }

      const product = existingProduct[0];
      
      // Se o produto tem imagem no armazenamento persistente, deletar primeiro
      if (product.imageUrl && product.imageUrl.includes('/uploads/products/')) {
        try {
          const { deleteUploadedFile } = await import('./upload-config-persistent');
          await deleteUploadedFile(product.imageUrl);
          console.log(`[storage] Imagem do produto ${id} removida do armazenamento persistente`);
        } catch (imageError) {
          console.warn(`[storage] Falha ao remover imagem do produto ${id}:`, imageError);
          // Continuar com a exclusão do produto mesmo se a imagem não puder ser removida
        }
      }
      
      console.log(`[storage] Produto ${id} encontrado, realizando exclusão...`);
      const result = await db.delete(products).where(eq(products.id, id));
      console.log(`[storage] Resultado da exclusão:`, result);
      
      const success = result.rowCount !== null && result.rowCount > 0;
      console.log(`[storage] Produto ${id} deletado com sucesso: ${success}`);
      
      return success;
    } catch (error) {
      console.error(`[storage] Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  }

  async getQuotations(): Promise<Quotation[]> {
    const result = await db.select().from(quotations).orderBy(desc(quotations.createdAt));
    return result;
  }

  async getQuotation(id: number): Promise<Quotation | undefined> {
    const [quotation] = await db.select().from(quotations).where(eq(quotations.id, id));
    return quotation || undefined;
  }

  async createQuotation(insertQuotation: InsertQuotation, items?: { productId: number; quantity: number }[]): Promise<Quotation> {
    const [quotation] = await db
      .insert(quotations)
      .values(insertQuotation)
      .returning();
    
    // Se há itens, insere na tabela quotation_items
    if (items && items.length > 0) {
      await db
        .insert(quotationItems)
        .values(
          items.map(item => ({
            quotationId: quotation.id,
            productId: item.productId,
            quantity: item.quantity,
          }))
        );
    }
    
    return quotation;
  }

  async updateQuotationStatus(id: number, status: string): Promise<Quotation | undefined> {
    const [quotation] = await db
      .update(quotations)
      .set({ status })
      .where(eq(quotations.id, id))
      .returning();
    return quotation || undefined;
  }

  async getQuotationsByCustomer(customerId: number): Promise<Quotation[]> {
    const result = await db
      .select()
      .from(quotations)
      .where(eq(quotations.customerId, customerId))
      .orderBy(desc(quotations.createdAt));
    return result;
  }

  async getQuotationWithItems(quotationId: number): Promise<any> {
    return await db.query.quotations.findFirst({
      where: eq(quotations.id, quotationId),
      with: {
        customer: true,
        quotationItems: {
          with: {
            product: true,
          },
        },
      },
    });
  }

  async getCustomerQuotationsWithItems(customerId: number): Promise<any[]> {
    return await db.query.quotations.findMany({
      where: eq(quotations.customerId, customerId),
      with: {
        quotationItems: {
          with: {
            product: true,
          },
        },
      },
      orderBy: [desc(quotations.createdAt)],
    });
  }

  async updateQuotationResponse(id: number, responseMessage: string, totalValue?: string, validUntil?: Date): Promise<Quotation | undefined> {
    const [quotation] = await db
      .update(quotations)
      .set({ 
        responseMessage, 
        totalValue, 
        validUntil,
        status: 'responded',
        updatedAt: new Date()
      })
      .where(eq(quotations.id, id))
      .returning();
    return quotation || undefined;
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer || undefined;
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const hashedPassword = await bcrypt.hash(insertCustomer.password, 10);
    const [customer] = await db
      .insert(customers)
      .values({
        ...insertCustomer,
        password: hashedPassword,
      })
      .returning();
    return customer;
  }

  async updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const updateData = { ...updates };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    const [customer] = await db
      .update(customers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return customer || undefined;
  }

  async verifyCustomerPassword(email: string, password: string): Promise<Customer | null> {
    const customer = await this.getCustomerByEmail(email);
    if (!customer) {
      return null;
    }

    const isValid = await bcrypt.compare(password, customer.password);
    if (!isValid) {
      return null;
    }

    return customer;
  }
}

// In-memory storage implementation as fallback
class MemoryStorage implements IStorage {

  private categories: Category[] = [
    { id: 1, name: "Pneumáticas", description: "Rodas pneumáticas para empilhadeiras", createdAt: new Date() },
    { id: 2, name: "Sólidas", description: "Rodas sólidas sem ar", createdAt: new Date() },
    { id: 3, name: "Poliuretano", description: "Rodas de poliuretano", createdAt: new Date() },
    { id: 4, name: "Borracha", description: "Rodas de borracha", createdAt: new Date() }
  ];

  private brands: Brand[] = [
    { id: 1, name: "Pollyfort", description: "Marca principal da empresa", createdAt: new Date() },
    { id: 2, name: "Industrial Plus", description: "Linha industrial premium", createdAt: new Date() },
    { id: 3, name: "Premium Wheels", description: "Rodas premium para aplicações especiais", createdAt: new Date() },
    { id: 4, name: "Durability Pro", description: "Linha profissional de alta durabilidade", createdAt: new Date() }
  ];

  private products: Product[] = [
    {
      id: 1,
      name: "Roda Pneumática 8.5 x 3.0",
      code: "PN-8530", 
      description: "Roda pneumática robusta para empilhadeiras elétricas.",
      category: "Pneumáticas",
      brand: "Pollyfort",
      diameter: "8.5",
      width: "3.0",
      material: "Borracha Premium", 
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
      rating: 5,
      reviewCount: 12,
      status: "active", 
      featured: true
    },
    {
      id: 2,
      name: "Roda Sólida 10 x 3.5",
      code: "SO-1035",
      description: "Roda sólida sem ar, ideal para ambientes industriais.",
      category: "Sólidas", 
      brand: "Industrial Plus",
      diameter: "10",
      width: "3.5",
      material: "Poliuretano",
      imageUrl: "https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=500",
      rating: 4,
      reviewCount: 8,
      status: "active",
      featured: false
    }
  ];
  
  private quotations: Quotation[] = [];
  private quotationItems: any[] = [];
  private customers: Customer[] = [];
  private cmsUsers: CmsUser[] = [
    {
      id: 1,
      username: "admin",
      email: "admin@pollyfort.com",
      password: "$2b$10$rQZ5xKzPvyZFQQGQQQQQQQ", // senha: admin123
      displayName: "Administrador",
      role: "admin",
      bio: "Administrador principal do sistema CMS",
      avatar: null,
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  private cmsPosts: CmsPost[] = [
    {
      id: 1,
      title: "Bem-vindos ao Pollyfort CMS",
      slug: "bem-vindos-pollyfort-cms",
      content: "<p>Este é seu primeiro post no sistema CMS da Pollyfort. Você pode editar ou excluir este post a qualquer momento.</p><p>O sistema CMS oferece todas as funcionalidades necessárias para gerenciar conteúdo, incluindo posts, páginas, mídia e muito mais.</p>",
      excerpt: "Primeiro post do sistema CMS da Pollyfort com funcionalidades completas de gerenciamento de conteúdo.",
      type: "post",
      status: "published",
      authorId: 1,
      parentId: null,
      featuredImage: null,
      metaTitle: "Bem-vindos ao Pollyfort CMS",
      metaDescription: "Sistema CMS completo da Pollyfort para gerenciamento de conteúdo",
      metaKeywords: "CMS, Pollyfort, gestão conteúdo",
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  private cmsCategories: CmsCategory[] = [
    {
      id: 1,
      name: "Notícias",
      slug: "noticias",
      description: "Categoria para posts de notícias e atualizações",
      parentId: null,
      count: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  private cmsTags: CmsTag[] = [
    {
      id: 1,
      name: "CMS",
      slug: "cms",
      description: "Tag relacionada ao sistema CMS",
      count: 1,
      createdAt: new Date()
    }
  ];
  private cmsMedia: CmsMedia[] = [];
  private cmsComments: CmsComment[] = [];
  private cmsOptions: CmsOption[] = [
    {
      id: 1,
      name: "site_title",
      value: "Pollyfort CMS",
      autoload: true,
      updatedAt: new Date()
    },
    {
      id: 2,
      name: "site_description",
      value: "Sistema de gestão de conteúdo da Pollyfort",
      autoload: true,
      updatedAt: new Date()
    }
  ];
  private cmsMenus: CmsMenu[] = [
    {
      id: 1,
      name: "Menu Principal",
      slug: "menu-principal",
      description: "Menu de navegação principal do site",
      createdAt: new Date()
    }
  ];
  private cmsMenuItems: CmsMenuItem[] = [];
  private nextId = 13;

  async getProducts(): Promise<Product[]> {
    return this.products.filter(p => p.status === "active");
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category === category && p.status === "active");
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowQuery = query.toLowerCase();
    return this.products.filter(p => 
      p.status === "active" && (
        p.name.toLowerCase().includes(lowQuery) ||
        p.description.toLowerCase().includes(lowQuery) ||
        p.category.toLowerCase().includes(lowQuery)
      )
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: this.nextId++,
      rating: 0,
      reviewCount: 0,
      featured: false
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.products.splice(index, 1);
    return true;
  }

  async getQuotations(): Promise<Quotation[]> {
    return this.quotations;
  }

  async getQuotation(id: number): Promise<Quotation | undefined> {
    return this.quotations.find(q => q.id === id);
  }

  async createQuotation(quotation: InsertQuotation, items?: { productId: number; quantity: number }[]): Promise<Quotation> {
    const newQuotation: Quotation = {
      ...quotation,
      id: this.nextId++,
      status: quotation.status || "pending",
      responseMessage: null,
      totalValue: null,
      validUntil: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.quotations.push(newQuotation);
    
    if (items) {
      items.forEach(item => {
        this.quotationItems.push({
          id: this.nextId++,
          quotationId: newQuotation.id,
          productId: item.productId,
          quantity: item.quantity,
          createdAt: new Date()
        });
      });
    }
    
    return newQuotation;
  }

  async updateQuotationStatus(id: number, status: string): Promise<Quotation | undefined> {
    const quotation = this.quotations.find(q => q.id === id);
    if (!quotation) return undefined;
    
    quotation.status = status;
    quotation.updatedAt = new Date();
    return quotation;
  }

  async getQuotationsByCustomer(customerId: number): Promise<Quotation[]> {
    return this.quotations.filter(q => q.customerId === customerId);
  }

  async getQuotationWithItems(quotationId: number): Promise<any> {
    const quotation = this.quotations.find(q => q.id === quotationId);
    if (!quotation) return null;
    
    const items = this.quotationItems.filter(item => item.quotationId === quotationId);
    return { ...quotation, items };
  }

  async getCustomerQuotationsWithItems(customerId: number): Promise<any[]> {
    const customerQuotations = this.quotations.filter(q => q.customerId === customerId);
    return customerQuotations.map(quotation => {
      const items = this.quotationItems.filter(item => item.quotationId === quotation.id);
      return { ...quotation, items };
    });
  }

  async updateQuotationResponse(id: number, responseMessage: string, totalValue?: string, validUntil?: Date): Promise<Quotation | undefined> {
    const quotation = this.quotations.find(q => q.id === id);
    if (!quotation) return undefined;
    
    quotation.responseMessage = responseMessage;
    if (totalValue) quotation.totalValue = totalValue;
    if (validUntil) quotation.validUntil = validUntil;
    quotation.updatedAt = new Date();
    return quotation;
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.find(c => c.id === id);
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return this.customers.find(c => c.email === email);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: this.nextId++,
      phone: customer.phone || null,
      company: customer.company || null,
      address: customer.address || null,
      isActive: customer.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.find(c => c.id === id);
    if (!customer) return undefined;
    
    Object.assign(customer, updates, { updatedAt: new Date() });
    return customer;
  }

  async verifyCustomerPassword(email: string, password: string): Promise<Customer | null> {
    const customer = await this.getCustomerByEmail(email);
    if (!customer) return null;
    
    const isValid = await bcrypt.compare(password, customer.password);
    return isValid ? customer : null;
  }

  // Categories Implementation
  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.find(c => c.id === id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: this.nextId++,
      createdAt: new Date()
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }

  async deleteCategory(id: number): Promise<boolean> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.categories.splice(index, 1);
    return true;
  }

  // Brands Implementation
  async getBrands(): Promise<Brand[]> {
    return this.brands;
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    return this.brands.find(b => b.id === id);
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const newBrand: Brand = {
      ...brand,
      id: this.nextId++,
      createdAt: new Date()
    };
    this.brands.push(newBrand);
    return newBrand;
  }

  async updateBrand(id: number, updates: Partial<InsertBrand>): Promise<Brand | undefined> {
    const index = this.brands.findIndex(b => b.id === id);
    if (index === -1) return undefined;
    
    this.brands[index] = { ...this.brands[index], ...updates };
    return this.brands[index];
  }

  async deleteBrand(id: number): Promise<boolean> {
    const index = this.brands.findIndex(b => b.id === id);
    if (index === -1) return false;
    
    this.brands.splice(index, 1);
    return true;
  }

  // CMS Users Implementation
  async getCmsUsers(): Promise<CmsUser[]> {
    return this.cmsUsers.filter(u => u.isActive);
  }

  async getCmsUser(id: number): Promise<CmsUser | undefined> {
    return this.cmsUsers.find(u => u.id === id);
  }

  async getCmsUserByEmail(email: string): Promise<CmsUser | undefined> {
    return this.cmsUsers.find(u => u.email === email);
  }

  async getCmsUserByUsername(username: string): Promise<CmsUser | undefined> {
    return this.cmsUsers.find(u => u.username === username);
  }

  async createCmsUser(user: InsertCmsUser): Promise<CmsUser> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: CmsUser = {
      ...user,
      id: this.nextId++,
      password: hashedPassword,
      isActive: user.isActive ?? true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cmsUsers.push(newUser);
    return newUser;
  }

  async updateCmsUser(id: number, updates: Partial<InsertCmsUser>): Promise<CmsUser | undefined> {
    const user = this.cmsUsers.find(u => u.id === id);
    if (!user) return undefined;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    Object.assign(user, updates, { updatedAt: new Date() });
    return user;
  }

  async deleteCmsUser(id: number): Promise<boolean> {
    const index = this.cmsUsers.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    this.cmsUsers.splice(index, 1);
    return true;
  }

  async verifyCmsUserPassword(username: string, password: string): Promise<CmsUser | null> {
    const user = await this.getCmsUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // CMS Posts Implementation
  async getCmsPosts(filters?: { type?: string; status?: string; authorId?: number }): Promise<CmsPost[]> {
    let posts = this.cmsPosts;
    
    if (filters?.type) {
      posts = posts.filter(p => p.type === filters.type);
    }
    if (filters?.status) {
      posts = posts.filter(p => p.status === filters.status);
    }
    if (filters?.authorId) {
      posts = posts.filter(p => p.authorId === filters.authorId);
    }
    
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getCmsPost(id: number): Promise<CmsPost | undefined> {
    return this.cmsPosts.find(p => p.id === id);
  }

  async getCmsPostBySlug(slug: string): Promise<CmsPost | undefined> {
    return this.cmsPosts.find(p => p.slug === slug);
  }

  async createCmsPost(post: InsertCmsPost): Promise<CmsPost> {
    const newPost: CmsPost = {
      ...post,
      id: this.nextId++,
      status: post.status || "draft",
      publishedAt: post.status === "published" ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cmsPosts.push(newPost);
    return newPost;
  }

  async updateCmsPost(id: number, updates: Partial<InsertCmsPost>): Promise<CmsPost | undefined> {
    const post = this.cmsPosts.find(p => p.id === id);
    if (!post) return undefined;
    
    if (updates.status === "published" && post.status !== "published") {
      updates.publishedAt = new Date();
    }
    
    Object.assign(post, updates, { updatedAt: new Date() });
    return post;
  }

  async deleteCmsPost(id: number): Promise<boolean> {
    const index = this.cmsPosts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.cmsPosts.splice(index, 1);
    return true;
  }

  async publishCmsPost(id: number): Promise<CmsPost | undefined> {
    return this.updateCmsPost(id, { status: "published", publishedAt: new Date() });
  }

  // CMS Categories Implementation
  async getCmsCategories(): Promise<CmsCategory[]> {
    return this.cmsCategories;
  }

  async getCmsCategory(id: number): Promise<CmsCategory | undefined> {
    return this.cmsCategories.find(c => c.id === id);
  }

  async getCmsCategoryBySlug(slug: string): Promise<CmsCategory | undefined> {
    return this.cmsCategories.find(c => c.slug === slug);
  }

  async createCmsCategory(category: InsertCmsCategory): Promise<CmsCategory> {
    const newCategory: CmsCategory = {
      ...category,
      id: this.nextId++,
      count: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cmsCategories.push(newCategory);
    return newCategory;
  }

  async updateCmsCategory(id: number, updates: Partial<InsertCmsCategory>): Promise<CmsCategory | undefined> {
    const category = this.cmsCategories.find(c => c.id === id);
    if (!category) return undefined;
    
    Object.assign(category, updates, { updatedAt: new Date() });
    return category;
  }

  async deleteCmsCategory(id: number): Promise<boolean> {
    const index = this.cmsCategories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.cmsCategories.splice(index, 1);
    return true;
  }

  // CMS Tags Implementation
  async getCmsTags(): Promise<CmsTag[]> {
    return this.cmsTags;
  }

  async getCmsTag(id: number): Promise<CmsTag | undefined> {
    return this.cmsTags.find(t => t.id === id);
  }

  async getCmsTagBySlug(slug: string): Promise<CmsTag | undefined> {
    return this.cmsTags.find(t => t.slug === slug);
  }

  async createCmsTag(tag: InsertCmsTag): Promise<CmsTag> {
    const newTag: CmsTag = {
      ...tag,
      id: this.nextId++,
      count: 0,
      createdAt: new Date()
    };
    this.cmsTags.push(newTag);
    return newTag;
  }

  async updateCmsTag(id: number, updates: Partial<InsertCmsTag>): Promise<CmsTag | undefined> {
    const tag = this.cmsTags.find(t => t.id === id);
    if (!tag) return undefined;
    
    Object.assign(tag, updates);
    return tag;
  }

  async deleteCmsTag(id: number): Promise<boolean> {
    const index = this.cmsTags.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.cmsTags.splice(index, 1);
    return true;
  }

  // CMS Media Implementation
  async getCmsMedia(): Promise<CmsMedia[]> {
    return this.cmsMedia.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getCmsMediaItem(id: number): Promise<CmsMedia | undefined> {
    return this.cmsMedia.find(m => m.id === id);
  }

  async createCmsMedia(media: InsertCmsMedia): Promise<CmsMedia> {
    const newMedia: CmsMedia = {
      ...media,
      id: this.nextId++,
      createdAt: new Date()
    };
    this.cmsMedia.push(newMedia);
    return newMedia;
  }

  async updateCmsMedia(id: number, updates: Partial<InsertCmsMedia>): Promise<CmsMedia | undefined> {
    const media = this.cmsMedia.find(m => m.id === id);
    if (!media) return undefined;
    
    Object.assign(media, updates);
    return media;
  }

  async deleteCmsMedia(id: number): Promise<boolean> {
    const index = this.cmsMedia.findIndex(m => m.id === id);
    if (index === -1) return false;
    
    this.cmsMedia.splice(index, 1);
    return true;
  }

  // CMS Comments Implementation
  async getCmsComments(postId?: number): Promise<CmsComment[]> {
    let comments = this.cmsComments;
    if (postId) {
      comments = comments.filter(c => c.postId === postId);
    }
    return comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getCmsComment(id: number): Promise<CmsComment | undefined> {
    return this.cmsComments.find(c => c.id === id);
  }

  async createCmsComment(comment: InsertCmsComment): Promise<CmsComment> {
    const newComment: CmsComment = {
      ...comment,
      id: this.nextId++,
      status: comment.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cmsComments.push(newComment);
    return newComment;
  }

  async updateCmsComment(id: number, updates: Partial<InsertCmsComment>): Promise<CmsComment | undefined> {
    const comment = this.cmsComments.find(c => c.id === id);
    if (!comment) return undefined;
    
    Object.assign(comment, updates, { updatedAt: new Date() });
    return comment;
  }

  async deleteCmsComment(id: number): Promise<boolean> {
    const index = this.cmsComments.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.cmsComments.splice(index, 1);
    return true;
  }

  async moderateCmsComment(id: number, status: string): Promise<CmsComment | undefined> {
    return this.updateCmsComment(id, { status });
  }

  // CMS Options Implementation
  async getCmsOption(name: string): Promise<CmsOption | undefined> {
    return this.cmsOptions.find(o => o.name === name);
  }

  async setCmsOption(name: string, value: string): Promise<CmsOption> {
    const existing = this.cmsOptions.find(o => o.name === name);
    if (existing) {
      existing.value = value;
      existing.updatedAt = new Date();
      return existing;
    }
    
    const newOption: CmsOption = {
      id: this.nextId++,
      name,
      value,
      autoload: true,
      updatedAt: new Date()
    };
    this.cmsOptions.push(newOption);
    return newOption;
  }

  async getCmsOptions(): Promise<CmsOption[]> {
    return this.cmsOptions.filter(o => o.autoload);
  }

  // CMS Menus Implementation
  async getCmsMenus(): Promise<CmsMenu[]> {
    return this.cmsMenus;
  }

  async getCmsMenu(id: number): Promise<CmsMenu | undefined> {
    return this.cmsMenus.find(m => m.id === id);
  }

  async getCmsMenuBySlug(slug: string): Promise<CmsMenu | undefined> {
    return this.cmsMenus.find(m => m.slug === slug);
  }

  async createCmsMenu(menu: InsertCmsMenu): Promise<CmsMenu> {
    const newMenu: CmsMenu = {
      ...menu,
      id: this.nextId++,
      createdAt: new Date()
    };
    this.cmsMenus.push(newMenu);
    return newMenu;
  }

  async updateCmsMenu(id: number, updates: Partial<InsertCmsMenu>): Promise<CmsMenu | undefined> {
    const menu = this.cmsMenus.find(m => m.id === id);
    if (!menu) return undefined;
    
    Object.assign(menu, updates);
    return menu;
  }

  async deleteCmsMenu(id: number): Promise<boolean> {
    const index = this.cmsMenus.findIndex(m => m.id === id);
    if (index === -1) return false;
    
    this.cmsMenus.splice(index, 1);
    // Remove all menu items for this menu
    this.cmsMenuItems = this.cmsMenuItems.filter(item => item.menuId !== id);
    return true;
  }

  // CMS Menu Items Implementation
  async getCmsMenuItems(menuId: number): Promise<CmsMenuItem[]> {
    return this.cmsMenuItems
      .filter(item => item.menuId === menuId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createCmsMenuItem(item: InsertCmsMenuItem): Promise<CmsMenuItem> {
    const newItem: CmsMenuItem = {
      ...item,
      id: this.nextId++,
      order: item.order || 0,
      createdAt: new Date()
    };
    this.cmsMenuItems.push(newItem);
    return newItem;
  }

  async updateCmsMenuItem(id: number, updates: Partial<InsertCmsMenuItem>): Promise<CmsMenuItem | undefined> {
    const item = this.cmsMenuItems.find(i => i.id === id);
    if (!item) return undefined;
    
    Object.assign(item, updates);
    return item;
  }

  async deleteCmsMenuItem(id: number): Promise<boolean> {
    const index = this.cmsMenuItems.findIndex(i => i.id === id);
    if (index === -1) return false;
    
    this.cmsMenuItems.splice(index, 1);
    return true;
  }

  // CMS Settings Implementation
  async getCmsSettings(): Promise<Record<string, any>> {
    const settings: Record<string, any> = {};
    
    // Convert CMS options to settings object
    for (const option of this.cmsOptions) {
      settings[option.name] = option.value;
    }
    
    // Default settings if none exist
    if (Object.keys(settings).length === 0) {
      return {
        site_title: "Pollyfort CMS",
        site_description: "Sistema de gerenciamento de conteúdo",
        site_url: "https://pollyfortrodas.com.br",
        admin_email: "admin@pollyfortrodas.com.br",
        posts_per_page: "10",
        default_post_status: "draft",
        allow_comments: "1",
        moderate_comments: "1"
      };
    }
    
    return settings;
  }

  async updateCmsSettings(settings: Record<string, any>): Promise<Record<string, any>> {
    // Update or create CMS options
    for (const [name, value] of Object.entries(settings)) {
      await this.setCmsOption(name, String(value));
    }
    
    return await this.getCmsSettings();
  }

  // Maintenance Mode Implementation
  private maintenanceConfig: any = { 
    enabled: false, 
    title: 'Site em Manutenção',
    message: 'Estamos realizando melhorias em nosso sistema. Voltaremos em breve!',
    estimatedTime: '',
    showContacts: true
  };

  async getMaintenanceMode(): Promise<any> {
    return { ...this.maintenanceConfig };
  }

  async setMaintenanceMode(config: any): Promise<void> {
    this.maintenanceConfig = { ...this.maintenanceConfig, ...config };
    console.log(`[Storage] Maintenance mode updated:`, this.maintenanceConfig);
  }

  // Company Settings Implementation
  private companySettingsData: CompanySettings = {
    id: 1,
    name: 'Pollyfort',
    address: 'R ANTONIO DO VALLE MELO Nº88 - Centro',
    city: 'Sumaré',
    state: 'SP',
    zipCode: '13.170-010',
    phone: '(19) 9 8228-5152 / (19) 9 9419-4339',
    email: 'vendas@pollyfortrodas.com.br',
    whatsapp: '5519999128023',
    website: 'https://pollyfortrodas.com.br',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  async getCompanySettings(): Promise<CompanySettings | undefined> {
    return { ...this.companySettingsData };
  }

  async updateCompanySettings(settings: Partial<InsertCompanySettings>): Promise<CompanySettings> {
    this.companySettingsData = { 
      ...this.companySettingsData, 
      ...settings,
      updatedAt: new Date()
    };
    console.log(`[Storage] Company settings updated:`, this.companySettingsData);
    return { ...this.companySettingsData };
  }
}

// Hybrid storage: Database for products, Memory for CMS features
class HybridStorage implements IStorage {
  private dbStorage = new DatabaseStorage();
  private memStorage = new MemoryStorage();

  // Products - Use database for persistence with fallback
  async getProducts(): Promise<Product[]> {
    try {
      return await this.dbStorage.getProducts();
    } catch (error) {
      console.warn('Database unavailable, using memory storage for products');
      return this.memStorage.getProducts();
    }
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    try {
      return await this.dbStorage.getProduct(id);
    } catch (error) {
      return this.memStorage.getProduct(id);
    }
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      return await this.dbStorage.getProductsByCategory(category);
    } catch (error) {
      return this.memStorage.getProductsByCategory(category);
    }
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    try {
      return await this.dbStorage.searchProducts(query);
    } catch (error) {
      return this.memStorage.searchProducts(query);
    }
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    try {
      return await this.dbStorage.createProduct(product);
    } catch (error) {
      return this.memStorage.createProduct(product);
    }
  }
  
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      return await this.dbStorage.updateProduct(id, product);
    } catch (error) {
      return this.memStorage.updateProduct(id, product);
    }
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    try {
      return await this.dbStorage.deleteProduct(id);
    } catch (error) {
      return this.memStorage.deleteProduct(id);
    }
  }
  
  // Quotations - Use database for persistence with fallback
  async getQuotations(): Promise<Quotation[]> {
    try {
      return await this.dbStorage.getQuotations();
    } catch (error) {
      return this.memStorage.getQuotations();
    }
  }
  
  async getQuotation(id: number): Promise<Quotation | undefined> {
    try {
      return await this.dbStorage.getQuotation(id);
    } catch (error) {
      return this.memStorage.getQuotation(id);
    }
  }
  
  async createQuotation(quotation: InsertQuotation, items?: { productId: number; quantity: number }[]): Promise<Quotation> {
    try {
      return await this.dbStorage.createQuotation(quotation, items);
    } catch (error) {
      return this.memStorage.createQuotation(quotation, items);
    }
  }
  
  async updateQuotationStatus(id: number, status: string): Promise<Quotation | undefined> {
    try {
      return await this.dbStorage.updateQuotationStatus(id, status);
    } catch (error) {
      return this.memStorage.updateQuotationStatus(id, status);
    }
  }
  
  async getQuotationsByCustomer(customerId: number): Promise<Quotation[]> {
    try {
      return await this.dbStorage.getQuotationsByCustomer(customerId);
    } catch (error) {
      return this.memStorage.getQuotationsByCustomer(customerId);
    }
  }
  
  async getQuotationWithItems(quotationId: number): Promise<any> {
    try {
      return await this.dbStorage.getQuotationWithItems(quotationId);
    } catch (error) {
      return this.memStorage.getQuotationWithItems(quotationId);
    }
  }
  
  async getCustomerQuotationsWithItems(customerId: number): Promise<any[]> {
    try {
      return await this.dbStorage.getCustomerQuotationsWithItems(customerId);
    } catch (error) {
      return this.memStorage.getCustomerQuotationsWithItems(customerId);
    }
  }
  
  async updateQuotationResponse(id: number, responseMessage: string, totalValue?: string, validUntil?: Date): Promise<Quotation | undefined> {
    try {
      return await this.dbStorage.updateQuotationResponse(id, responseMessage, totalValue, validUntil);
    } catch (error) {
      return this.memStorage.updateQuotationResponse(id, responseMessage, totalValue, validUntil);
    }
  }
  
  // Customers - Use database for persistence with fallback
  async getCustomer(id: number): Promise<Customer | undefined> {
    try {
      return await this.dbStorage.getCustomer(id);
    } catch (error) {
      return this.memStorage.getCustomer(id);
    }
  }
  
  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    try {
      return await this.dbStorage.getCustomerByEmail(email);
    } catch (error) {
      return this.memStorage.getCustomerByEmail(email);
    }
  }
  
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    try {
      return await this.dbStorage.createCustomer(customer);
    } catch (error) {
      return this.memStorage.createCustomer(customer);
    }
  }
  
  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    try {
      return await this.dbStorage.updateCustomer(id, customer);
    } catch (error) {
      return this.memStorage.updateCustomer(id, customer);
    }
  }
  
  async verifyCustomerPassword(email: string, password: string): Promise<Customer | null> {
    try {
      return await this.dbStorage.verifyCustomerPassword(email, password);
    } catch (error) {
      return this.memStorage.verifyCustomerPassword(email, password);
    }
  }

  // CMS features - Use memory storage for now
  async getCmsUsers(): Promise<CmsUser[]> {
    return this.memStorage.getCmsUsers();
  }
  
  async getCmsUser(id: number): Promise<CmsUser | undefined> {
    return this.memStorage.getCmsUser(id);
  }
  
  async getCmsUserByEmail(email: string): Promise<CmsUser | undefined> {
    return this.memStorage.getCmsUserByEmail(email);
  }
  
  async getCmsUserByUsername(username: string): Promise<CmsUser | undefined> {
    return this.memStorage.getCmsUserByUsername(username);
  }
  
  async createCmsUser(user: InsertCmsUser): Promise<CmsUser> {
    return this.memStorage.createCmsUser(user);
  }
  
  async updateCmsUser(id: number, user: Partial<InsertCmsUser>): Promise<CmsUser | undefined> {
    return this.memStorage.updateCmsUser(id, user);
  }
  
  async deleteCmsUser(id: number): Promise<boolean> {
    return this.memStorage.deleteCmsUser(id);
  }
  
  async verifyCmsUserPassword(username: string, password: string): Promise<CmsUser | null> {
    return this.memStorage.verifyCmsUserPassword(username, password);
  }

  async getCmsPosts(filters?: { type?: string; status?: string; authorId?: number }): Promise<CmsPost[]> {
    return this.memStorage.getCmsPosts(filters);
  }
  
  async getCmsPost(id: number): Promise<CmsPost | undefined> {
    return this.memStorage.getCmsPost(id);
  }
  
  async getCmsPostBySlug(slug: string): Promise<CmsPost | undefined> {
    return this.memStorage.getCmsPostBySlug(slug);
  }
  
  async createCmsPost(post: InsertCmsPost): Promise<CmsPost> {
    return this.memStorage.createCmsPost(post);
  }
  
  async updateCmsPost(id: number, post: Partial<InsertCmsPost>): Promise<CmsPost | undefined> {
    return this.memStorage.updateCmsPost(id, post);
  }
  
  async deleteCmsPost(id: number): Promise<boolean> {
    return this.memStorage.deleteCmsPost(id);
  }
  
  async publishCmsPost(id: number): Promise<CmsPost | undefined> {
    return this.memStorage.publishCmsPost(id);
  }

  async getCmsCategories(): Promise<CmsCategory[]> {
    return this.memStorage.getCmsCategories();
  }
  
  async getCmsCategory(id: number): Promise<CmsCategory | undefined> {
    return this.memStorage.getCmsCategory(id);
  }
  
  async getCmsCategoryBySlug(slug: string): Promise<CmsCategory | undefined> {
    return this.memStorage.getCmsCategoryBySlug(slug);
  }
  
  async createCmsCategory(category: InsertCmsCategory): Promise<CmsCategory> {
    return this.memStorage.createCmsCategory(category);
  }
  
  async updateCmsCategory(id: number, category: Partial<InsertCmsCategory>): Promise<CmsCategory | undefined> {
    return this.memStorage.updateCmsCategory(id, category);
  }
  
  async deleteCmsCategory(id: number): Promise<boolean> {
    return this.memStorage.deleteCmsCategory(id);
  }

  async getCmsTags(): Promise<CmsTag[]> {
    return this.memStorage.getCmsTags();
  }
  
  async getCmsTag(id: number): Promise<CmsTag | undefined> {
    return this.memStorage.getCmsTag(id);
  }
  
  async getCmsTagBySlug(slug: string): Promise<CmsTag | undefined> {
    return this.memStorage.getCmsTagBySlug(slug);
  }
  
  async createCmsTag(tag: InsertCmsTag): Promise<CmsTag> {
    return this.memStorage.createCmsTag(tag);
  }
  
  async updateCmsTag(id: number, tag: Partial<InsertCmsTag>): Promise<CmsTag | undefined> {
    return this.memStorage.updateCmsTag(id, tag);
  }
  
  async deleteCmsTag(id: number): Promise<boolean> {
    return this.memStorage.deleteCmsTag(id);
  }

  async getCmsMedia(): Promise<CmsMedia[]> {
    return this.memStorage.getCmsMedia();
  }
  
  async getCmsMediaItem(id: number): Promise<CmsMedia | undefined> {
    return this.memStorage.getCmsMediaItem(id);
  }
  
  async createCmsMedia(media: InsertCmsMedia): Promise<CmsMedia> {
    return this.memStorage.createCmsMedia(media);
  }
  
  async updateCmsMedia(id: number, media: Partial<InsertCmsMedia>): Promise<CmsMedia | undefined> {
    return this.memStorage.updateCmsMedia(id, media);
  }
  
  async deleteCmsMedia(id: number): Promise<boolean> {
    return this.memStorage.deleteCmsMedia(id);
  }

  async getCmsComments(postId?: number): Promise<CmsComment[]> {
    return this.memStorage.getCmsComments(postId);
  }
  
  async getCmsComment(id: number): Promise<CmsComment | undefined> {
    return this.memStorage.getCmsComment(id);
  }
  
  async createCmsComment(comment: InsertCmsComment): Promise<CmsComment> {
    return this.memStorage.createCmsComment(comment);
  }
  
  async updateCmsComment(id: number, comment: Partial<InsertCmsComment>): Promise<CmsComment | undefined> {
    return this.memStorage.updateCmsComment(id, comment);
  }
  
  async deleteCmsComment(id: number): Promise<boolean> {
    return this.memStorage.deleteCmsComment(id);
  }
  
  async moderateCmsComment(id: number, status: string): Promise<CmsComment | undefined> {
    return this.memStorage.moderateCmsComment(id, status);
  }

  async getCmsOption(name: string): Promise<CmsOption | undefined> {
    return this.memStorage.getCmsOption(name);
  }
  
  async setCmsOption(name: string, value: string): Promise<CmsOption> {
    return this.memStorage.setCmsOption(name, value);
  }
  
  async getCmsOptions(): Promise<CmsOption[]> {
    return this.memStorage.getCmsOptions();
  }

  async getCmsMenus(): Promise<CmsMenu[]> {
    return this.memStorage.getCmsMenus();
  }
  
  async getCmsMenu(id: number): Promise<CmsMenu | undefined> {
    return this.memStorage.getCmsMenu(id);
  }
  
  async getCmsMenuBySlug(slug: string): Promise<CmsMenu | undefined> {
    return this.memStorage.getCmsMenuBySlug(slug);
  }
  
  async createCmsMenu(menu: InsertCmsMenu): Promise<CmsMenu> {
    return this.memStorage.createCmsMenu(menu);
  }
  
  async updateCmsMenu(id: number, menu: Partial<InsertCmsMenu>): Promise<CmsMenu | undefined> {
    return this.memStorage.updateCmsMenu(id, menu);
  }
  
  async deleteCmsMenu(id: number): Promise<boolean> {
    return this.memStorage.deleteCmsMenu(id);
  }

  async getCmsMenuItems(menuId: number): Promise<CmsMenuItem[]> {
    return this.memStorage.getCmsMenuItems(menuId);
  }
  
  async createCmsMenuItem(item: InsertCmsMenuItem): Promise<CmsMenuItem> {
    return this.memStorage.createCmsMenuItem(item);
  }
  
  async updateCmsMenuItem(id: number, item: Partial<InsertCmsMenuItem>): Promise<CmsMenuItem | undefined> {
    return this.memStorage.updateCmsMenuItem(id, item);
  }
  
  async deleteCmsMenuItem(id: number): Promise<boolean> {
    return this.memStorage.deleteCmsMenuItem(id);
  }

  async getCmsSettings(): Promise<Record<string, any>> {
    return this.memStorage.getCmsSettings();
  }
  
  async updateCmsSettings(settings: Record<string, any>): Promise<Record<string, any>> {
    return this.memStorage.updateCmsSettings(settings);
  }

  // Maintenance Mode - Use memory storage for immediate consistency
  async getMaintenanceMode(): Promise<any> {
    return this.memStorage.getMaintenanceMode();
  }

  async setMaintenanceMode(config: any): Promise<void> {
    console.log(`[HybridStorage] Setting maintenance mode:`, config);
    return this.memStorage.setMaintenanceMode(config);
  }

  // Company Settings - Use memory storage for immediate consistency
  async getCompanySettings(): Promise<CompanySettings | undefined> {
    return this.memStorage.getCompanySettings();
  }

  async updateCompanySettings(settings: Partial<InsertCompanySettings>): Promise<CompanySettings> {
    return this.memStorage.updateCompanySettings(settings);
  }
}

export const storage = new HybridStorage();
