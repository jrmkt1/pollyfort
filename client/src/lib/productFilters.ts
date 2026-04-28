import type { Product } from "@shared/schema";
import type { FilterOptions } from "@shared/types";

export function filterAndSortProducts(
  products: Product[],
  options: FilterOptions
): Product[] {
  if (!products) return [];

  let filtered = [...products];

  // Category filter
  if (options.category && options.category !== "" && options.category !== "all") {
    filtered = filtered.filter(product => 
      (product.categoryName && product.categoryName === options.category) || 
      (product.brandName && product.brandName === options.category) ||
      (product.category && product.category === options.category) ||
      (product.brand && product.brand === options.category)
    );
  }

  // Search filter
  if (options.search) {
    const searchTerm = options.search.toLowerCase();
    filtered = filtered.filter(product => {
      const matchesName = product.name.toLowerCase().includes(searchTerm);
      const matchesDescription = product.description?.toLowerCase().includes(searchTerm);
      const matchesCode = product.code.toLowerCase().includes(searchTerm);
      const matchesCategory = (product.categoryName || product.category || "").toLowerCase().includes(searchTerm);
      const matchesBrand = (product.brandName || product.brand || "").toLowerCase().includes(searchTerm);
      
      return matchesName || matchesDescription || matchesCode || matchesCategory || matchesBrand;
    });
  }

  // Sorting
  const sortBy = options.sortBy || "name";
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return filtered;
}