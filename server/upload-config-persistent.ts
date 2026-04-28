import multer from 'multer';
import { persistentStorage } from './persistent-storage';

// Configure multer to use memory storage for processing before upload to Replit Storage
const storage = multer.memoryStorage();

// File filter for image validation
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('[Upload] Validating file:', file.originalname, 'MIME:', file.mimetype);
  
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    // Additional check for allowed image types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG and WebP images are allowed!'));
    }
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer with file size limit and validation
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file at a time
  }
});

/**
 * Process uploaded file and store it with maximum persistence using multiple storage strategies
 */
export async function processUploadedFile(file: Express.Multer.File, productId?: number): Promise<string> {
  try {
    console.log('[Upload] Processing file for maximum persistence:', file.originalname);
    
    if (!file.buffer) {
      throw new Error('File buffer is empty');
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit');
    }

    // Store with multiple backup strategies for maximum persistence
    const publicUrl = await persistentStorage.storeFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      productId
    );

    console.log('[Upload] File processed and stored with maximum persistence:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('[Upload] Error processing file:', error);
    throw new Error('Failed to upload file to persistent storage');
  }
}

/**
 * Delete uploaded file from all persistent storage locations
 */
export async function deleteUploadedFile(imageUrl: string): Promise<void> {
  try {
    if (imageUrl && (imageUrl.includes('/uploads/products/') || imageUrl.includes('storage.replit.com'))) {
      console.log('[Upload] Deleting file from all persistent storage locations:', imageUrl);
      await persistentStorage.deleteFile(imageUrl);
    }
  } catch (error) {
    console.error('[Upload] Error deleting file:', error);
    // Don't throw error to avoid blocking other operations
  }
}