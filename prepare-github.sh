#!/bin/bash

# Pollyfort - GitHub Preparation Script
# This script prepares the project for GitHub upload

echo "🚀 Preparando projeto Pollyfort para GitHub..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git não está instalado. Por favor, instale o Git primeiro."
    exit 1
fi

# Clean up temporary and unnecessary files
echo "🧹 Limpando arquivos temporários..."
rm -f *.log
rm -f *.pid
rm -f cookies.txt
rm -f test-image.jpg
rm -f *.tar.gz
rm -rf node_modules/.cache
rm -rf dist/

# Check if .env exists and warn about sensitive data
if [ -f ".env" ]; then
    echo "⚠️  Arquivo .env encontrado - certifique-se de que não será enviado para o GitHub"
    echo "   (já está no .gitignore)"
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📝 Inicializando repositório Git..."
    git init
    git branch -M main
else
    echo "✅ Repositório Git já inicializado"
fi

# Add all files to staging
echo "📦 Adicionando arquivos ao staging..."
git add .

# Check for changes
if git diff --staged --quiet; then
    echo "ℹ️  Nenhuma mudança detectada para commit"
else
    echo "📝 Criando commit inicial..."
    git commit -m "feat: complete e-commerce platform with admin panel

- React 18 frontend with TypeScript
- Express.js backend with PostgreSQL
- Complete admin authentication system
- Product management with image upload
- Quotation system for customers
- Session-based authentication
- Production-ready deployment configuration"
fi

echo ""
echo "✅ Projeto preparado com sucesso para GitHub!"
echo ""
echo "📋 Próximos passos:"
echo "1. Crie um novo repositório no GitHub:"
echo "   https://github.com/new"
echo ""
echo "2. Conecte este repositório ao GitHub:"
echo "   git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git"
echo ""
echo "3. Faça o push para o GitHub:"
echo "   git push -u origin main"
echo ""
echo "📄 Arquivos incluídos:"
echo "✅ README.md - Documentação completa"
echo "✅ LICENSE - Licença MIT"
echo "✅ .gitignore - Configurado adequadamente"
echo "✅ .env.example - Template de variáveis de ambiente"
echo "✅ CONTRIBUTING.md - Guia para contribuidores"
echo "✅ GITHUB_SETUP.md - Instruções detalhadas"
echo ""
echo "🔐 Lembre-se de configurar as variáveis de ambiente no servidor de produção!"
echo ""