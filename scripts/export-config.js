#!/usr/bin/env node

/**
 * Script de Exportação de Configurações - Pollyfort
 * Exporta todas as configurações do site para backup ou migração
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConfigExporter {
  constructor() {
    this.exportData = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      site: {},
      database: {},
      files: {}
    };
  }

  async exportAll() {
    console.log('🔄 Iniciando exportação das configurações...');
    
    try {
      await this.exportSiteConfig();
      await this.exportDatabaseSchema();
      await this.exportImportantFiles();
      await this.saveExportFile();
      
      console.log('✅ Exportação concluída com sucesso!');
      console.log(`📁 Arquivo salvo: pollyfort-config-${this.getTimestamp()}.json`);
    } catch (error) {
      console.error('❌ Erro durante exportação:', error.message);
    }
  }

  async exportSiteConfig() {
    console.log('📋 Exportando configurações do site...');
    
    // Configurações do package.json
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      this.exportData.site.package = {
        name: packageJson.name,
        version: packageJson.version,
        dependencies: packageJson.dependencies,
        devDependencies: packageJson.devDependencies,
        scripts: packageJson.scripts
      };
    } catch (e) {
      console.warn('⚠️ Não foi possível ler package.json');
    }

    // Configurações do Vite
    try {
      const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
      this.exportData.site.viteConfig = viteConfig;
    } catch (e) {
      console.warn('⚠️ Não foi possível ler vite.config.ts');
    }

    // Configurações do Tailwind
    try {
      const tailwindConfig = fs.readFileSync('tailwind.config.ts', 'utf8');
      this.exportData.site.tailwindConfig = tailwindConfig;
    } catch (e) {
      console.warn('⚠️ Não foi possível ler tailwind.config.ts');
    }

    // Configurações do TypeScript
    try {
      const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
      this.exportData.site.tsConfig = tsConfig;
    } catch (e) {
      console.warn('⚠️ Não foi possível ler tsconfig.json');
    }
  }

  async exportDatabaseSchema() {
    console.log('🗄️ Exportando schema do banco de dados...');
    
    try {
      const schemaContent = fs.readFileSync('shared/schema.ts', 'utf8');
      this.exportData.database.schema = schemaContent;
    } catch (e) {
      console.warn('⚠️ Não foi possível ler shared/schema.ts');
    }

    try {
      const drizzleConfig = fs.readFileSync('drizzle.config.ts', 'utf8');
      this.exportData.database.drizzleConfig = drizzleConfig;
    } catch (e) {
      console.warn('⚠️ Não foi possível ler drizzle.config.ts');
    }
  }

  async exportImportantFiles() {
    console.log('📄 Exportando arquivos importantes...');
    
    const importantFiles = [
      'replit.md',
      '.replit',
      'README.md',
      'server/index.ts',
      'server/routes.ts',
      'server/storage-clean.ts'
    ];

    for (const file of importantFiles) {
      try {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          this.exportData.files[file] = content;
        }
      } catch (e) {
        console.warn(`⚠️ Não foi possível ler ${file}`);
      }
    }

    // Listar uploads de imagens
    try {
      if (fs.existsSync('uploads')) {
        const uploadsInfo = this.getDirectoryInfo('uploads');
        this.exportData.files.uploadsInfo = uploadsInfo;
      }
    } catch (e) {
      console.warn('⚠️ Não foi possível ler diretório uploads');
    }
  }

  getDirectoryInfo(dirPath) {
    const info = {
      files: [],
      totalSize: 0,
      totalFiles: 0
    };

    const scanDirectory = (currentPath) => {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          scanDirectory(itemPath);
        } else {
          info.files.push({
            path: itemPath,
            size: stats.size,
            modified: stats.mtime
          });
          info.totalSize += stats.size;
          info.totalFiles++;
        }
      }
    };

    scanDirectory(dirPath);
    return info;
  }

  async saveExportFile() {
    const filename = `pollyfort-config-${this.getTimestamp()}.json`;
    const filepath = path.join(process.cwd(), filename);
    
    fs.writeFileSync(filepath, JSON.stringify(this.exportData, null, 2));
    
    // Criar também um resumo em markdown
    await this.createSummaryFile();
  }

  async createSummaryFile() {
    const summaryFilename = `pollyfort-summary-${this.getTimestamp()}.md`;
    
    let summary = `# Resumo das Configurações - Pollyfort\n\n`;
    summary += `**Data da Exportação:** ${this.exportData.timestamp}\n\n`;
    
    summary += `## 📋 Informações do Site\n`;
    if (this.exportData.site.package) {
      summary += `- **Nome:** ${this.exportData.site.package.name}\n`;
      summary += `- **Versão:** ${this.exportData.site.package.version}\n`;
      summary += `- **Dependências:** ${Object.keys(this.exportData.site.package.dependencies || {}).length}\n`;
      summary += `- **Dev Dependencies:** ${Object.keys(this.exportData.site.package.devDependencies || {}).length}\n\n`;
    }
    
    summary += `## 🗄️ Banco de Dados\n`;
    summary += `- **Schema:** ${this.exportData.database.schema ? 'Exportado' : 'Não encontrado'}\n`;
    summary += `- **Drizzle Config:** ${this.exportData.database.drizzleConfig ? 'Exportado' : 'Não encontrado'}\n\n`;
    
    summary += `## 📁 Arquivos\n`;
    summary += `- **Total de arquivos exportados:** ${Object.keys(this.exportData.files).length}\n`;
    
    if (this.exportData.files.uploadsInfo) {
      summary += `- **Uploads:** ${this.exportData.files.uploadsInfo.totalFiles} arquivos (${this.formatBytes(this.exportData.files.uploadsInfo.totalSize)})\n`;
    }
    
    summary += `\n## 📝 Arquivos Exportados\n`;
    for (const filename of Object.keys(this.exportData.files)) {
      if (filename !== 'uploadsInfo') {
        summary += `- ${filename}\n`;
      }
    }
    
    fs.writeFileSync(summaryFilename, summary);
  }

  getTimestamp() {
    return new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Executar exportação
const exporter = new ConfigExporter();
exporter.exportAll();