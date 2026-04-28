import type { QuotationItem } from "@shared/types";

const QUOTATION_ITEMS_KEY = 'quotationItems';

export const sessionStorageService = {
  getQuotationItems(): QuotationItem[] {
    try {
      const saved = sessionStorage.getItem(QUOTATION_ITEMS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('Error loading quotation items from sessionStorage:', error);
      return [];
    }
  },

  saveQuotationItems(items: QuotationItem[]): void {
    try {
      sessionStorage.setItem(QUOTATION_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('Error saving quotation items to sessionStorage:', error);
    }
  },

  clearQuotationItems(): void {
    try {
      sessionStorage.removeItem(QUOTATION_ITEMS_KEY);
    } catch (error) {
      console.warn('Error clearing quotation items from sessionStorage:', error);
    }
  }
};