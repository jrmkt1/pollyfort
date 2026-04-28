import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'products');
    await fs.ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

export const uploadProductImages = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por arquivo
    files: 10 // Máximo 10 arquivos por upload
  }
});

// Função para gerar URL da imagem
export const getImageUrl = (filename: string): string => {
  return `/uploads/products/${filename}`;
};

// Função para deletar arquivo de imagem
export const deleteImageFile = async (filename: string): Promise<boolean> => {
  try {
    const filePath = path.join(process.cwd(), 'uploads', 'products', filename);
    await fs.remove(filePath);
    console.log(`Arquivo deletado: ${filePath}`);
    return true;
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    return false;
  }
};

// Função para limpar imagens órfãs
export const cleanupOrphanedImages = async (): Promise<void> => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'products');
    if (!await fs.pathExists(uploadsDir)) {
      return;
    }

    const files = await fs.readdir(uploadsDir);
    console.log(`Encontrados ${files.length} arquivos no diretório de uploads`);
    
    // Aqui você poderia implementar lógica para verificar quais imagens
    // estão no banco vs quais arquivos existem no sistema
  } catch (error) {
    console.error('Erro ao limpar imagens órfãs:', error);
  }
};