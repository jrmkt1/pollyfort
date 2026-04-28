import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import type { 
  User, Customer, Product, InsertProduct, Quotation, InsertQuotation, 
  Category, InsertCategory, Brand, InsertBrand 
} from "@shared/schema";

// Simplified interface with only essential methods
export interface ISimpleStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Brands  
  getBrands(): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, updates: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: number): Promise<boolean>;

  // Basic data
  getProductsByCategory(category: string): Promise<Product[]>;
  getQuotations(): Promise<Quotation[]>;
  createQuotation(quotation: InsertQuotation): Promise<Quotation>;
}

// Simple memory storage implementation
export class SimpleMemoryStorage implements ISimpleStorage {
  private categories: Category[] = [
    { id: 1, name: "Pneumáticas", description: "Rodas pneumáticas para empilhadeiras", createdAt: new Date() },
    { id: 2, name: "Sólidas", description: "Rodas sólidas sem ar", createdAt: new Date() },
    { id: 3, name: "Poliuretano", description: "Rodas de poliuretano", createdAt: new Date() },
    { id: 4, name: "Borracha", description: "Rodas de borracha", createdAt: new Date() }
  ];

  private brands: Brand[] = [
    { id: 1, name: "Pollyfort", description: "Marca principal da empresa", createdAt: new Date() },
    { id: 2, name: "Industrial Plus", description: "Linha industrial avançada", createdAt: new Date() },
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
      hardness: "80 Shore A",
      maxLoad: "1500kg",
      application: "Empilhadeiras elétricas internas",
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
      hardness: "95 Shore A",
      maxLoad: "2000kg", 
      application: "Ambientes industriais severos",
      imageUrl: "https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=500",
      rating: 4,
      reviewCount: 8,
      status: "active",
      featured: false
    }
  ];

  private quotations: Quotation[] = [];

  // Products
  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = Math.max(...this.products.map(p => p.id), 0) + 1;
    const newProduct: Product = {
      id,
      ...product,
      brand: product.brand || null,
      hardness: product.hardness || null,
      maxLoad: product.maxLoad || null,
      application: product.application || null,
      imageUrl: product.imageUrl || null,
      price: product.price || null,
      rating: 0,
      reviewCount: 0,
      status: product.status || "active",
      featured: product.featured || false
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    // Normalize updates to ensure proper types
    const normalizedUpdates = {
      ...updates,
      brand: updates.brand === undefined ? this.products[index].brand : (updates.brand || null),
      hardness: updates.hardness === undefined ? this.products[index].hardness : (updates.hardness || null),
      maxLoad: updates.maxLoad === undefined ? this.products[index].maxLoad : (updates.maxLoad || null),
      application: updates.application === undefined ? this.products[index].application : (updates.application || null),
      imageUrl: updates.imageUrl === undefined ? this.products[index].imageUrl : (updates.imageUrl || null),
      price: updates.price === undefined ? this.products[index].price : (updates.price || null),
      featured: updates.featured === undefined ? this.products[index].featured : (updates.featured || false)
    };
    
    this.products[index] = { ...this.products[index], ...normalizedUpdates };
    return this.products[index];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.products.splice(index, 1);
    return true;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = Math.max(...this.categories.map(c => c.id), 0) + 1;
    const newCategory: Category = {
      id,
      name: category.name,
      description: category.description || null,
      createdAt: new Date()
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    const normalizedUpdates = {
      ...updates,
      description: updates.description === undefined ? this.categories[index].description : (updates.description || null)
    };
    
    this.categories[index] = { ...this.categories[index], ...normalizedUpdates };
    return this.categories[index];
  }

  async deleteCategory(id: number): Promise<boolean> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    // Verificar se há produtos usando esta categoria
    const categoryName = this.categories[index].name;
    const productsUsingCategory = this.products.filter(p => p.category === categoryName);
    
    if (productsUsingCategory.length > 0) {
      console.log(`[storage] Não é possível deletar categoria ${categoryName}: ${productsUsingCategory.length} produtos em uso`);
      return false;
    }
    
    this.categories.splice(index, 1);
    console.log(`[storage] Categoria ${categoryName} deletada com sucesso`);
    return true;
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    return this.brands;
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = Math.max(...this.brands.map(b => b.id), 0) + 1;
    const newBrand: Brand = {
      id,
      name: brand.name,
      description: brand.description || null,
      createdAt: new Date()
    };
    this.brands.push(newBrand);
    return newBrand;
  }

  async updateBrand(id: number, updates: Partial<InsertBrand>): Promise<Brand | undefined> {
    const index = this.brands.findIndex(b => b.id === id);
    if (index === -1) return undefined;
    
    const normalizedUpdates = {
      ...updates,
      description: updates.description === undefined ? this.brands[index].description : (updates.description || null)
    };
    
    this.brands[index] = { ...this.brands[index], ...normalizedUpdates };
    return this.brands[index];
  }

  async deleteBrand(id: number): Promise<boolean> {
    const index = this.brands.findIndex(b => b.id === id);
    if (index === -1) return false;
    
    // Verificar se há produtos usando esta marca
    const brandName = this.brands[index].name;
    const productsUsingBrand = this.products.filter(p => p.brand === brandName);
    
    if (productsUsingBrand.length > 0) {
      console.log(`[storage] Não é possível deletar marca ${brandName}: ${productsUsingBrand.length} produtos em uso`);
      return false;
    }
    
    this.brands.splice(index, 1);
    console.log(`[storage] Marca ${brandName} deletada com sucesso`);
    return true;
  }

  // Utility methods
  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category === category);
  }

  async getQuotations(): Promise<Quotation[]> {
    return this.quotations;
  }

  async createQuotation(quotation: InsertQuotation): Promise<Quotation> {
    const id = Math.max(...this.quotations.map(q => q.id), 0) + 1;
    const newQuotation: Quotation = {
      id,
      name: quotation.name,
      email: quotation.email,
      phone: quotation.phone,
      products: quotation.products,
      company: quotation.company || null,
      customerId: quotation.customerId || null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      responseMessage: null,
      totalValue: null,
      validUntil: null
    };
    this.quotations.push(newQuotation);
    return newQuotation;
  }
}

// Create storage instance
export const simpleStorage = new SimpleMemoryStorage();