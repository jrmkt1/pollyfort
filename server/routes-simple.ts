import express from "express";
import { simpleStorage } from "./storage-clean";
import { insertCategorySchema, insertBrandSchema, insertProductSchema } from "@shared/schema";

const router = express.Router();

// Categories Routes
router.get("/api/admin/categories", async (req, res) => {
  try {
    const categories = await simpleStorage.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

router.post("/api/admin/categories", async (req, res) => {
  try {
    const categoryData = insertCategorySchema.parse(req.body);
    const newCategory = await simpleStorage.createCategory(categoryData);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Failed to create category" });
  }
});

router.put("/api/admin/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = insertCategorySchema.partial().parse(req.body);
    const updated = await simpleStorage.updateCategory(id, updates);
    
    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(updated);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
});

router.delete("/api/admin/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await simpleStorage.deleteCategory(id);
    
    if (!success) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
});

// Brands Routes
router.get("/api/admin/brands", async (req, res) => {
  try {
    const brands = await simpleStorage.getBrands();
    res.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Failed to fetch brands" });
  }
});

router.post("/api/admin/brands", async (req, res) => {
  try {
    const brandData = insertBrandSchema.parse(req.body);
    const newBrand = await simpleStorage.createBrand(brandData);
    res.status(201).json(newBrand);
  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(500).json({ message: "Failed to create brand" });
  }
});

router.put("/api/admin/brands/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = insertBrandSchema.partial().parse(req.body);
    const updated = await simpleStorage.updateBrand(id, updates);
    
    if (!updated) {
      return res.status(404).json({ message: "Brand not found" });
    }
    
    res.json(updated);
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ message: "Failed to update brand" });
  }
});

router.delete("/api/admin/brands/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await simpleStorage.deleteBrand(id);
    
    if (!success) {
      return res.status(404).json({ message: "Brand not found" });
    }
    
    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ message: "Failed to delete brand" });
  }
});

// Products Routes - basic endpoint disabled, using enhanced products route with JOINs
// router.get("/api/products", async (req, res) => {
//   try {
//     const products = await simpleStorage.getProducts();
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Failed to fetch products" });
//   }
// });

router.post("/api/admin/products", async (req, res) => {
  try {
    const productData = insertProductSchema.parse(req.body);
    const newProduct = await simpleStorage.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
});

router.put("/api/admin/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = insertProductSchema.partial().parse(req.body);
    const updated = await simpleStorage.updateProduct(id, updates);
    
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

router.delete("/api/admin/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await simpleStorage.deleteProduct(id);
    
    if (!success) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// Legacy categories endpoint removed - now using proper brands/categories management

// Quotations
router.get("/api/quotations", async (req, res) => {
  try {
    const quotations = await simpleStorage.getQuotations();
    res.json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ message: "Failed to fetch quotations" });
  }
});

export default router;