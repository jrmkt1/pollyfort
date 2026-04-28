import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `${timestamp}-${file.originalname}`;
    cb(null, filename);
  }
});

// File filter to accept only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Process uploaded file and return URL
export function processUploadedFile(file: Express.Multer.File): string {
  // Generate public URL for the uploaded file
  const publicUrl = `/uploads/products/${file.filename}`;
  console.log(`[Upload] File uploaded successfully: ${publicUrl}`);
  return publicUrl;
}

// Delete uploaded file
export function deleteUploadedFile(imageUrl: string): boolean {
  try {
    if (!imageUrl || !imageUrl.startsWith('/uploads/products/')) {
      return false;
    }
    
    const filename = path.basename(imageUrl);
    const filePath = path.join(uploadDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[Upload] Successfully deleted file: ${filename}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[Upload] Error deleting file:', error);
    return false;
  }
}