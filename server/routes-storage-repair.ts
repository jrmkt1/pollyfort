import { Router } from 'express';
import { persistentStorage } from './persistent-storage';

const router = Router();

/**
 * Repair missing images by restoring from backups
 */
router.post('/repair', async (req, res) => {
  try {
    console.log('[Storage Repair] Starting repair process...');
    
    await persistentStorage.repairMissingFiles();
    
    res.json({
      success: true,
      message: 'Storage repair completed successfully'
    });
    
  } catch (error) {
    console.error('[Storage Repair] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Storage repair failed'
    });
  }
});

/**
 * List all stored files with their metadata
 */
router.get('/files', async (req, res) => {
  try {
    const files = await persistentStorage.listFiles();
    
    res.json({
      success: true,
      files: files,
      count: files.length
    });
    
  } catch (error) {
    console.error('[Storage List] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list files'
    });
  }
});

/**
 * Check file status across all storage systems
 */
router.get('/status/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const fileUrl = `/uploads/products/${filename}`;
    
    const exists = await persistentStorage.fileExists(fileUrl);
    
    res.json({
      success: true,
      filename,
      exists,
      fileUrl
    });
    
  } catch (error) {
    console.error('[Storage Status] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check file status'
    });
  }
});

export default router;