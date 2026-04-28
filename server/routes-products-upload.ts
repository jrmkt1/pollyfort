import { Router } from 'express';
import { upload, processUploadedFile, deleteUploadedFile } from './upload-config-persistent';
import { storage } from './storage';
import { insertProductSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// Enhanced product schema with image validation and proper type coercion
const productWithImageSchema = insertProductSchema.extend({
  imageUrl: z.string().optional(),
  brandId: z.union([z.string(), z.number()]).transform(val => val === "" || val === null ? null : Number(val)).nullable(),
  categoryId: z.union([z.string(), z.number()]).transform(val => val === "" || val === null ? null : Number(val)).nullable(),
  rating: z.union([z.string(), z.number()]).transform(val => val === "" || val === null ? 0 : Number(val)),
  reviewCount: z.union([z.string(), z.number()]).transform(val => val === "" || val === null ? 0 : Number(val)),
  featured: z.union([z.string(), z.boolean()]).transform(val => val === "true" || val === true),
});

// POST /api/products/upload - Create product with image upload
router.post('/upload', upload.single('productImage'), async (req, res) => {
  try {
    console.log('[Product Upload] Starting product creation with image upload');
    console.log('[Product Upload] Request body:', req.body);
    console.log('[Product Upload] File info:', req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file provided');

    // Validate that file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Product image is required'
      });
    }

    // Validate product data
    const validationResult = productWithImageSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.log('[Product Upload] Validation error:', validationResult.error);
      return res.status(400).json({
        success: false,
        error: 'Invalid product data',
        details: validationResult.error.errors
      });
    }

    // Process uploaded image file
    console.log('[Product Upload] Processing uploaded image...');
    const imageUrl = await processUploadedFile(req.file);
    console.log('[Product Upload] Image processed successfully:', imageUrl);

    // Prepare product data with image URL
    const productData = {
      ...validationResult.data,
      imageUrl: imageUrl,
      status: validationResult.data.status || 'active'
    };

    // Create product in database
    console.log('[Product Upload] Creating product in database...');
    const newProduct = await storage.createProduct(productData);
    console.log('[Product Upload] Product created successfully:', newProduct.id);

    res.status(201).json({
      success: true,
      message: 'Product created successfully with image upload',
      product: newProduct
    });

  } catch (error: any) {
    console.error('[Product Upload] Error:', error);
    
    // Handle specific multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      });
    }
    
    if (error.message === 'Only image files are allowed!') {
      return res.status(400).json({
        success: false,
        error: 'Only image files (PNG, JPEG, JPG) are allowed.'
      });
    }

    // Handle upload errors
    if (error.message === 'Failed to upload file to storage') {
      return res.status(500).json({
        success: false,
        error: 'Failed to upload image. Please try again.'
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      error: 'Internal server error while creating product'
    });
  }
});

// PUT /api/products/:id/upload - Update product with new image
router.put('/:id/upload', upload.single('productImage'), async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    console.log(`[Product Upload] Updating product ${productId} with new image`);

    // Get existing product
    const existingProduct = await storage.getProduct(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    let imageUrl = existingProduct.imageUrl;

    // If new image provided, process it
    if (req.file) {
      console.log('[Product Upload] New image provided, processing...');
      imageUrl = await processUploadedFile(req.file);
      console.log('[Product Upload] New image processed successfully:', imageUrl);
    }

    // Validate and prepare update data
    const validationResult = productWithImageSchema.partial().safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product data',
        details: validationResult.error.errors
      });
    }

    // Update product
    const updateData = {
      ...validationResult.data,
      imageUrl: imageUrl
    };

    const updatedProduct = await storage.updateProduct(productId, updateData);
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error: any) {
    console.error('[Product Upload] Update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while updating product'
    });
  }
});

export default router;