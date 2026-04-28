import { Router } from 'express';
import { upload, processUploadedFile } from './upload-config';

const router = Router();

// Simple test upload endpoint
router.post('/test-upload', upload.single('testImage'), async (req, res) => {
  try {
    console.log('[Test Upload] Starting image upload test');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    const imageUrl = processUploadedFile(req.file);
    
    console.log('[Test Upload] File uploaded successfully:', imageUrl);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      imageUrl: imageUrl,
      fileInfo: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        filename: req.file.filename
      }
    });

  } catch (error) {
    console.error('[Test Upload] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Upload failed'
    });
  }
});

export default router;