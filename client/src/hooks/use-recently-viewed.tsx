import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "@shared/schema";

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
      setRecentlyViewed(JSON.parse(saved));
    }
  }, []);

  const saveRecentlyViewed = (products: Product[]) => {
    setRecentlyViewed(products);
    localStorage.setItem('recentlyViewed', JSON.stringify(products));
  };

  const addToRecentlyViewed = (product: Product) => {
    const filtered = recentlyViewed.filter(p => p.id !== product.id);
    const newList = [product, ...filtered].slice(0, 10); // Keep only 10 most recent
    saveRecentlyViewed(newList);
  };

  const clearRecentlyViewed = () => {
    saveRecentlyViewed([]);
  };

  return (
    <RecentlyViewedContext.Provider value={{
      recentlyViewed,
      addToRecentlyViewed,
      clearRecentlyViewed
    }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}