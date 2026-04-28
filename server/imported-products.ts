import fs from "fs";
import path from "path";

type ImportedProduct = {
  id: number;
  name: string;
  code: string;
  description: string;
  brandId: number | null;
  brandName: string | null;
  categoryId: number | null;
  categoryName: string | null;
  diameter: string;
  width: string;
  material: string;
  imageUrl: string | null;
  rating: number;
  reviewCount: number;
  status: string;
  featured: boolean;
};

type ImportedLookup = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  productCount: number;
};

type ImportedCatalog = {
  products: ImportedProduct[];
  brands: ImportedLookup[];
  categories: ImportedLookup[];
};

let cache: ImportedCatalog | null = null;

function loadImportedCatalog(): ImportedCatalog {
  if (cache) return cache;

  const filePath = path.join(process.cwd(), "data", "imported-products.json");
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  cache = JSON.parse(raw) as ImportedCatalog;
  return cache;
}

export function getImportedProducts(filters: {
  search?: string;
  brandId?: number;
  categoryId?: number;
  category?: string;
} = {}) {
  const { products } = loadImportedCatalog();
  const search = filters.search?.trim().toLowerCase();
  const category = filters.category?.trim().toLowerCase();

  return products.filter((product) => {
    if (filters.brandId && product.brandId !== filters.brandId) return false;
    if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
    if (category && category !== "all" && !product.categoryName?.toLowerCase().includes(category)) return false;
    if (search) {
      const haystack = [product.name, product.description, product.code, product.brandName, product.categoryName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

export function getImportedBrands() {
  return loadImportedCatalog().brands;
}

export function getImportedCategories() {
  return loadImportedCatalog().categories;
}
