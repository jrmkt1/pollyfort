import fs from 'fs-extra';
import path from 'path';

// Try to import Replit Object Storage, fallback gracefully if not available
let Client: any = null;
try {
  const replitStorage = require('@replit/object-storage');
  Client = replitStorage.Client;
} catch (error) {
  console.warn('[Storage] Replit Object Storage not available, using local storage only');
}

export class ReplitStorageService {
  private static instance: ReplitStorageService;
  private objectStorage: any = null;
  private bucketName = 'pollyfort-images';
  private uploadsDir = path.join(process.cwd(), 'uploads', 'products');
  private useObjectStorage = false;

  static getInstance(): ReplitStorageService {
    if (!ReplitStorageService.instance) {
      ReplitStorageService.instance = new ReplitStorageService();
    }
    return ReplitStorageService.instance;
  }

  constructor() {
    // Initialize Replit Object Storage client if available
    try {
      if (Client) {
        this.objectStorage = new Client();
        this.useObjectStorage = true;
        console.log('[Storage] Replit Object Storage initialized successfully');
      }
    } catch (error) {
      console.warn('[Storage] Failed to initialize Object Storage, using local storage only:', error);
      this.useObjectStorage = false;
    }
    
    // Ensure local uploads directory exists as fallback
    fs.ensureDirSync(this.uploadsDir);
  }

  /**
   * Upload file to Replit Object Storage with local fallback
   */
  async uploadFile(buffer: Buffer, filename: string, mimetype: string): Promise<string> {
    try {
      console.log(`[Storage] Uploading file: ${filename}`);
      console.log(`[Storage] File size: ${buffer.length} bytes`);
      console.log(`[Storage] MIME type: ${mimetype}`);

      // Generate a unique filename to avoid conflicts using content hash
      const { createHash } = await import('crypto');
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000000);
      const extension = filename.split('.').pop() || 'jpg';
      
      // Create hash from file buffer to ensure uniqueness even for same-named files
      const fileHash = createHash('md5').update(buffer).digest('hex').substring(0, 8);
      const uniqueFilename = `product-${timestamp}-${fileHash}-${random}.${extension}`;

      if (this.useObjectStorage && this.objectStorage) {
        try {
          // Try Replit Object Storage first using correct API
          console.log(`[Object Storage] Attempting upload: ${uniqueFilename}`);
          
          // Upload using uploadFromBytes method
          await this.objectStorage.uploadFromBytes(uniqueFilename, buffer);

          // For Object Storage, construct the public URL
          const publicUrl = `https://storage.replit.com/${uniqueFilename}`;
          console.log(`[Object Storage] File uploaded successfully: ${publicUrl}`);
          
          return publicUrl;
        } catch (objectStorageError) {
          console.warn('[Object Storage] Failed, falling back to local storage:', objectStorageError);
        }
      }
      
      // Fallback to local storage (or if Object Storage not available)
      const localFilePath = path.join(this.uploadsDir, uniqueFilename);
      await fs.writeFile(localFilePath, buffer);
      
      const publicUrl = `/uploads/products/${uniqueFilename}`;
      console.log(`[Local Storage] File uploaded successfully: ${publicUrl}`);
      
      return publicUrl;
    } catch (error) {
      console.error('[Storage] Upload failed completely:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  /**
   * Delete file from storage (Object Storage or local)
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      console.log(`[Storage] Deleting file: ${fileUrl}`);
      
      if (fileUrl.includes('storage.replit.com') && this.useObjectStorage && this.objectStorage) {
        // Extract filename from Object Storage URL
        const urlParts = fileUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        try {
          await this.objectStorage.delete(filename);
          console.log(`[Object Storage] File deleted successfully: ${filename}`);
        } catch (objectStorageError) {
          console.warn('[Object Storage] Delete failed:', objectStorageError);
        }
      } else if (fileUrl.includes('/uploads/products/')) {
        // Handle local storage deletion
        const actualFilename = path.basename(fileUrl);
        const filePath = path.join(this.uploadsDir, actualFilename);

        if (await fs.pathExists(filePath)) {
          await fs.remove(filePath);
          console.log(`[Local Storage] File deleted successfully: ${actualFilename}`);
        } else {
          console.log(`[Local Storage] File not found: ${actualFilename}`);
        }
      }
    } catch (error) {
      console.error('[Storage] Delete failed:', error);
      // Don't throw error for delete failures to avoid blocking other operations
    }
  }

  /**
   * List all files in the storage
   */
  async listFiles(): Promise<string[]> {
    try {
      if (this.useObjectStorage && this.objectStorage) {
        try {
          const result = await this.objectStorage.list();
          if (result.ok) {
            return result.value || [];
          }
        } catch (objectStorageError) {
          console.warn('[Object Storage] List failed, falling back to local storage');
        }
      }
      
      // Fallback to local storage
      const files = await fs.readdir(this.uploadsDir);
      return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
      });
    } catch (error) {
      console.error('[Storage] List failed:', error);
      return [];
    }
  }

  /**
   * Check if file exists in storage
   */
  async fileExists(fileUrl: string): Promise<boolean> {
    try {
      if (fileUrl.includes('storage.replit.com') && this.useObjectStorage && this.objectStorage) {
        // Check Object Storage
        const urlParts = fileUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        try {
          const result = await this.objectStorage.downloadAsBytes(filename);
          return result.ok;
        } catch {
          return false;
        }
      } else if (fileUrl.includes('/uploads/products/')) {
        // Check local storage
        const actualFilename = path.basename(fileUrl);
        const filePath = path.join(this.uploadsDir, actualFilename);
        return await fs.pathExists(filePath);
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }
}

export const replitStorage = ReplitStorageService.getInstance();