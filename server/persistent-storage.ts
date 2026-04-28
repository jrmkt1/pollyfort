import fs from 'fs-extra';
import path from 'path';

// Try to import Replit Database for metadata storage
let Database: any = null;
try {
  const replitDB = require('@replit/database');
  Database = replitDB;
} catch (error) {
  console.warn('[PersistentStorage] Replit Database not available');
}

// Try to import Replit Object Storage
let ObjectStorage: any = null;
try {
  const replitStorage = require('@replit/object-storage');
  ObjectStorage = replitStorage.Client;
} catch (error) {
  console.warn('[PersistentStorage] Replit Object Storage not available');
}

interface StoredFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  storageType: 'object-storage' | 'local' | 'database';
  timestamp: number;
  productId?: number;
}

export class PersistentStorageService {
  private static instance: PersistentStorageService;
  private db: any = null;
  private objectStorage: any = null;
  private uploadsDir = path.join(process.cwd(), 'uploads', 'products');
  private useDatabase = false;
  private useObjectStorage = false;

  static getInstance(): PersistentStorageService {
    if (!PersistentStorageService.instance) {
      PersistentStorageService.instance = new PersistentStorageService();
    }
    return PersistentStorageService.instance;
  }

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // Initialize Replit Database for metadata
    try {
      if (Database) {
        this.db = new Database();
        this.useDatabase = true;
        console.log('[PersistentStorage] Replit Database initialized for metadata');
      }
    } catch (error) {
      console.warn('[PersistentStorage] Failed to initialize Database:', error);
    }

    // Initialize Object Storage
    try {
      if (ObjectStorage) {
        this.objectStorage = new ObjectStorage();
        this.useObjectStorage = true;
        console.log('[PersistentStorage] Object Storage initialized');
      }
    } catch (error) {
      console.warn('[PersistentStorage] Failed to initialize Object Storage:', error);
    }

    // Ensure local directory exists
    await fs.ensureDir(this.uploadsDir);
    console.log('[PersistentStorage] Local storage directory ensured');
  }

  /**
   * Store file with multiple backup strategies for maximum persistence
   */
  async storeFile(buffer: Buffer, originalName: string, mimetype: string, productId?: number): Promise<string> {
    const { createHash } = await import('crypto');
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    const extension = originalName.split('.').pop() || 'jpg';
    
    // Create hash from file buffer to ensure uniqueness even for same-named files
    const fileHash = createHash('md5').update(buffer).digest('hex').substring(0, 8);
    const uniqueFilename = `product-${timestamp}-${fileHash}-${random}.${extension}`;

    console.log(`[PersistentStorage] Storing file: ${uniqueFilename} (${buffer.length} bytes)`);

    const fileMetadata: StoredFile = {
      filename: uniqueFilename,
      originalName,
      mimetype,
      size: buffer.length,
      url: '',
      storageType: 'local',
      timestamp,
      productId
    };

    let primaryUrl = '';
    let backupUrls: string[] = [];

    // Strategy 1: Try Object Storage (primary)
    if (this.useObjectStorage && this.objectStorage) {
      try {
        await this.objectStorage.uploadFromBytes(uniqueFilename, buffer);
        primaryUrl = `https://storage.replit.com/${uniqueFilename}`;
        fileMetadata.storageType = 'object-storage';
        fileMetadata.url = primaryUrl;
        console.log(`[PersistentStorage] Object Storage upload successful: ${primaryUrl}`);
      } catch (error) {
        console.warn('[PersistentStorage] Object Storage failed:', error);
      }
    }

    // Strategy 2: Always store locally as backup
    try {
      const localPath = path.join(this.uploadsDir, uniqueFilename);
      await fs.writeFile(localPath, buffer);
      const localUrl = `/uploads/products/${uniqueFilename}`;
      backupUrls.push(localUrl);
      
      if (!primaryUrl) {
        primaryUrl = localUrl;
        fileMetadata.storageType = 'local';
        fileMetadata.url = primaryUrl;
      }
      console.log(`[PersistentStorage] Local backup stored: ${localUrl}`);
    } catch (error) {
      console.error('[PersistentStorage] Local storage failed:', error);
    }

    // Strategy 3: Store in Database as base64 (ultra-backup for small files)
    if (this.useDatabase && buffer.length < 1024 * 1024) { // Only for files < 1MB
      try {
        const base64Data = buffer.toString('base64');
        const dbKey = `file:${uniqueFilename}`;
        await this.db.set(dbKey, {
          ...fileMetadata,
          base64Data,
          backupUrls
        });
        console.log(`[PersistentStorage] Database backup stored: ${dbKey}`);
      } catch (error) {
        console.warn('[PersistentStorage] Database backup failed:', error);
      }
    }

    // Store metadata in database
    if (this.useDatabase) {
      try {
        const metadataKey = `metadata:${uniqueFilename}`;
        await this.db.set(metadataKey, {
          ...fileMetadata,
          backupUrls,
          createdAt: new Date().toISOString()
        });
        console.log(`[PersistentStorage] Metadata stored: ${metadataKey}`);
      } catch (error) {
        console.warn('[PersistentStorage] Metadata storage failed:', error);
      }
    }

    if (!primaryUrl) {
      throw new Error('All storage strategies failed');
    }

    console.log(`[PersistentStorage] File stored successfully with ${backupUrls.length} backups: ${primaryUrl}`);
    return primaryUrl;
  }

  /**
   * Retrieve file from any available storage
   */
  async retrieveFile(fileUrl: string): Promise<Buffer | null> {
    try {
      const filename = this.extractFilename(fileUrl);
      console.log(`[PersistentStorage] Retrieving file: ${filename}`);

      // Try Object Storage first
      if (fileUrl.includes('storage.replit.com') && this.useObjectStorage && this.objectStorage) {
        try {
          const result = await this.objectStorage.downloadAsBytes(filename);
          if (result.ok && result.value) {
            console.log(`[PersistentStorage] Retrieved from Object Storage: ${filename}`);
            return Buffer.from(result.value);
          }
        } catch (error) {
          console.warn('[PersistentStorage] Object Storage retrieval failed:', error);
        }
      }

      // Try local storage
      const localPath = path.join(this.uploadsDir, filename);
      if (await fs.pathExists(localPath)) {
        const buffer = await fs.readFile(localPath);
        console.log(`[PersistentStorage] Retrieved from local storage: ${filename}`);
        return buffer;
      }

      // Try database backup
      if (this.useDatabase) {
        try {
          const dbKey = `file:${filename}`;
          const storedData = await this.db.get(dbKey);
          if (storedData && storedData.base64Data) {
            const buffer = Buffer.from(storedData.base64Data, 'base64');
            console.log(`[PersistentStorage] Retrieved from database backup: ${filename}`);
            
            // Restore to local storage for faster future access
            try {
              await fs.writeFile(localPath, buffer);
              console.log(`[PersistentStorage] Restored to local storage: ${filename}`);
            } catch (restoreError) {
              console.warn('[PersistentStorage] Failed to restore to local:', restoreError);
            }
            
            return buffer;
          }
        } catch (error) {
          console.warn('[PersistentStorage] Database retrieval failed:', error);
        }
      }

      console.log(`[PersistentStorage] File not found in any storage: ${filename}`);
      return null;
    } catch (error) {
      console.error('[PersistentStorage] Retrieval error:', error);
      return null;
    }
  }

  /**
   * Delete file from all storage locations
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filename = this.extractFilename(fileUrl);
      console.log(`[PersistentStorage] Deleting file: ${filename}`);

      // Delete from Object Storage
      if (fileUrl.includes('storage.replit.com') && this.useObjectStorage && this.objectStorage) {
        try {
          await this.objectStorage.delete(filename);
          console.log(`[PersistentStorage] Deleted from Object Storage: ${filename}`);
        } catch (error) {
          console.warn('[PersistentStorage] Object Storage deletion failed:', error);
        }
      }

      // Delete from local storage
      const localPath = path.join(this.uploadsDir, filename);
      if (await fs.pathExists(localPath)) {
        await fs.remove(localPath);
        console.log(`[PersistentStorage] Deleted from local storage: ${filename}`);
      }

      // Delete from database
      if (this.useDatabase) {
        try {
          await this.db.delete(`file:${filename}`);
          await this.db.delete(`metadata:${filename}`);
          console.log(`[PersistentStorage] Deleted from database: ${filename}`);
        } catch (error) {
          console.warn('[PersistentStorage] Database deletion failed:', error);
        }
      }
    } catch (error) {
      console.error('[PersistentStorage] Deletion error:', error);
    }
  }

  /**
   * List all stored files
   */
  async listFiles(): Promise<StoredFile[]> {
    const files: StoredFile[] = [];

    try {
      // Get files from database metadata if available
      if (this.useDatabase) {
        try {
          const keys = await this.db.list('metadata:');
          for (const key of keys) {
            const metadata = await this.db.get(key);
            if (metadata) {
              files.push(metadata);
            }
          }
          return files;
        } catch (error) {
          console.warn('[PersistentStorage] Database listing failed:', error);
        }
      }

      // Fallback to local directory listing
      const localFiles = await fs.readdir(this.uploadsDir);
      for (const filename of localFiles) {
        const filePath = path.join(this.uploadsDir, filename);
        const stats = await fs.stat(filePath);
        files.push({
          filename,
          originalName: filename,
          mimetype: 'image/jpeg', // Default, could be improved
          size: stats.size,
          url: `/uploads/products/${filename}`,
          storageType: 'local',
          timestamp: stats.mtime.getTime()
        });
      }
    } catch (error) {
      console.error('[PersistentStorage] Listing error:', error);
    }

    return files;
  }

  /**
   * Check if file exists in any storage
   */
  async fileExists(fileUrl: string): Promise<boolean> {
    const filename = this.extractFilename(fileUrl);

    // Check Object Storage
    if (fileUrl.includes('storage.replit.com') && this.useObjectStorage && this.objectStorage) {
      try {
        const result = await this.objectStorage.downloadAsBytes(filename);
        if (result.ok) return true;
      } catch (error) {
        // Continue to next check
      }
    }

    // Check local storage
    const localPath = path.join(this.uploadsDir, filename);
    if (await fs.pathExists(localPath)) return true;

    // Check database backup
    if (this.useDatabase) {
      try {
        const dbKey = `file:${filename}`;
        const data = await this.db.get(dbKey);
        if (data && data.base64Data) return true;
      } catch (error) {
        // Continue
      }
    }

    return false;
  }

  /**
   * Repair missing files by restoring from backups
   */
  async repairMissingFiles(): Promise<void> {
    console.log('[PersistentStorage] Starting file repair process...');
    
    if (!this.useDatabase) {
      console.log('[PersistentStorage] Database not available, cannot repair files');
      return;
    }

    try {
      const keys = await this.db.list('metadata:');
      let repairedCount = 0;

      for (const key of keys) {
        const metadata = await this.db.get(key);
        if (!metadata) continue;

        const primaryExists = await this.fileExists(metadata.url);
        
        if (!primaryExists) {
          console.log(`[PersistentStorage] Repairing missing file: ${metadata.filename}`);
          
          // Try to restore from database backup
          const dbFileKey = `file:${metadata.filename}`;
          const fileData = await this.db.get(dbFileKey);
          
          if (fileData && fileData.base64Data) {
            const buffer = Buffer.from(fileData.base64Data, 'base64');
            const localPath = path.join(this.uploadsDir, metadata.filename);
            
            await fs.writeFile(localPath, buffer);
            console.log(`[PersistentStorage] Restored file to local storage: ${metadata.filename}`);
            repairedCount++;
          }
        }
      }

      console.log(`[PersistentStorage] File repair completed. Restored ${repairedCount} files.`);
    } catch (error) {
      console.error('[PersistentStorage] File repair failed:', error);
    }
  }

  private extractFilename(fileUrl: string): string {
    if (fileUrl.includes('storage.replit.com')) {
      return fileUrl.split('/').pop() || '';
    } else if (fileUrl.includes('/uploads/products/')) {
      return path.basename(fileUrl);
    }
    return fileUrl;
  }
}

export const persistentStorage = PersistentStorageService.getInstance();