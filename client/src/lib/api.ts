import { apiRequest } from "@/lib/queryClient";
import type { Product, Quotation, InsertProduct, InsertQuotation } from "@shared/schema";

export const api = {
  // Products
  getProducts: async (params?: { category?: string; search?: string }): Promise<Product[]> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    
    const url = `/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await apiRequest('GET', url);
    return response.json();
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await apiRequest('GET', `/api/products/${id}`);
    return response.json();
  },

  createProduct: async (product: InsertProduct): Promise<Product> => {
    const response = await apiRequest('POST', '/api/products', product);
    return response.json();
  },

  updateProduct: async (id: number, updates: Partial<InsertProduct>): Promise<Product> => {
    const response = await apiRequest('PUT', `/api/products/${id}`, updates);
    return response.json();
  },

  deleteProduct: async (id: number): Promise<void> => {
    const response = await apiRequest('DELETE', `/api/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  },

  // Quotations
  getQuotations: async (): Promise<Quotation[]> => {
    const response = await apiRequest('GET', '/api/quotations');
    return response.json();
  },

  createQuotation: async (quotation: InsertQuotation): Promise<Quotation> => {
    const response = await apiRequest('POST', '/api/quotations', quotation);
    return response.json();
  },

  updateQuotationStatus: async (id: number, status: string): Promise<Quotation> => {
    const response = await apiRequest('PUT', `/api/quotations/${id}/status`, { status });
    return response.json();
  },

  // Categories
  getCategories: async (): Promise<{ name: string; count: number }[]> => {
    const response = await apiRequest('GET', '/api/categories');
    return response.json();
  },
};
