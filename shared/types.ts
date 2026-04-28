import type { Product } from "./schema";

// Shared interfaces to prevent duplication across components
export interface QuotationItem {
  product: Product;
  quantity: number;
}

export interface FilterOptions {
  category?: string;
  search?: string;
  sortBy?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}