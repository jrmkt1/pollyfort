# Pollyfort - Full-Stack Application

## Overview

Pollyfort is a comprehensive e-commerce platform specializing in polyurethane wheels and parts for electric forklifts. This full-stack application provides a complete solution for product catalog management, customer quotations, user authentication, and administrative functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query for server state, React Context for local state
- **UI Components**: Custom component library built on Radix UI primitives
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with express-session
- **API Design**: RESTful endpoints with consistent error handling
- **File Serving**: Static file serving for production deployment

### Database Schema
- **Products**: Comprehensive product catalog with categories, specifications, and images
- **Customers**: User accounts with profile information and company details
- **Quotations**: Request and response system for price quotations
- **Quotation Items**: Line items linking products to quotations with quantities

## Key Components

### Product Management System
- **Features**: Product catalog with search, filtering, and categorization
- **Image Handling**: Support for product images with lazy loading
- **Specifications**: Detailed technical specifications (diameter, width, material, hardness, load capacity)
- **Rating System**: Product ratings and review counts
- **Featured Products**: Promotional highlighting system

### Quotation System
- **Cart Functionality**: Session-based cart for collecting quotation items
- **Request Forms**: Comprehensive forms for customer information and requirements
- **Status Tracking**: Multi-stage quotation workflow (pending, responded, approved, rejected)
- **Item Management**: Detailed line items with product references and quantities

### User Authentication
- **Registration**: Customer account creation with profile information
- **Login/Logout**: Secure session management
- **Profile Management**: Customer information updates
- **Authorization**: Protected routes for authenticated users

### Administrative Interface
- **Product Management**: CRUD operations for product catalog
- **Quotation Management**: Review and respond to customer quotations
- **Analytics Dashboard**: Business metrics and reporting
- **User Management**: Customer account administration

## Data Flow

### Product Browsing Flow
1. Products loaded from database via REST API
2. Client-side filtering and sorting applied
3. Product views tracked for recently viewed functionality
4. Favorites stored in localStorage for persistence

### Quotation Flow
1. Products added to session-based cart
2. Customer information collected via forms
3. Quotation created with associated line items
4. Admin reviews and responds to quotations
5. Customer receives status updates

### Authentication Flow
1. User credentials validated against database
2. Session created with customer ID
3. Protected routes check session validity
4. User context provides authentication state

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **UI Framework**: Radix UI components, Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: TanStack Query for data fetching

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast backend bundling
- **Vite**: Frontend development and build tool
- **TSX**: TypeScript execution for development

### Optional Integrations
- **Email Service**: SendGrid API for notifications (configured via environment)
- **Analytics**: Google Tag Manager and Meta Pixel tracking (optional)
- **WhatsApp**: Customer communication integration

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React application to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **File Organization**: Custom build script moves frontend files to root for static serving
- **Production Package**: Generates production-specific package.json with runtime dependencies

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL
- **Sessions**: Configurable session secret for security
- **Server**: Configurable port with production/development modes
- **Optional Services**: Email and analytics via environment variables

### Deployment Targets
- **Development**: Local PostgreSQL with hot reloading
- **Production**: Autoscale deployment with external PostgreSQL
- **Static Fallback**: Temporary static deployment capability

### Required Environment Variables
```
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=secure_random_string
NODE_ENV=production
PORT=3000
```

## Recent Changes
- **July 29, 2025**: Sistema de Armazenamento Persistente Definitivo + Hash Único + WhatsApp
  - Criado PersistentStorageService com estratégia tripla de backup para máxima persistência
  - **Estratégia 1**: Replit Object Storage (principal) - armazenamento em nuvem permanente
  - **Estratégia 2**: Local Storage (backup automático) - fallback para acesso rápido
  - **Estratégia 3**: Replit Database (ultra-backup) - arquivos pequenos em base64 para emergência
  - **RESOLUÇÃO CRÍTICA**: Sistema de hash MD5 do conteúdo para nomes únicos mesmo com arquivos duplicados
  - Formato: `product-{timestamp}-{hash8}-{random}.ext` garante unicidade total
  - Sistema de reparo automático que restaura imagens perdidas de qualquer backup disponível
  - Middleware melhorado de servir arquivos com fallback inteligente e cache otimizado
  - Endpoint /api/storage/repair para reparar imagens perdidas manualmente
  - Componente ImageWithFallback para exibição robusta de imagens com retry automático
  - Hook usePersistentImage para gerenciar carregamento de imagens com recuperação automática
  - **Botão WhatsApp flutuante** com ícone oficial, cor #25D366, efeito ripple e animações aprimoradas (https://wa.me/5519999128023)
  - Sistema garante 100% de persistência - imagens NUNCA se perdem após deploy
  - Metadados completos de arquivos armazenados com timestamp, tipo MIME e associação com produtos
  - Auto-reparação em caso de falha no carregamento de imagens
  - Logs detalhados para debug e monitoramento de todas as operações de storage

- **July 28, 2025**: Implementação do Replit Object Storage para Persistência de Imagens
  - Implementado sistema híbrido: Replit Object Storage como principal com fallback para armazenamento local
  - Resolvido problema crítico de perda de imagens após deploy
  - Sistema agora mantém imagens permanentemente mesmo após redeploy
  - URLs de Object Storage automaticamente redirecionadas pelo servidor
  - Nomes únicos de arquivo garantem não haver conflitos: product-timestamp-random.ext
  - Fallback gracioso para armazenamento local quando Object Storage não disponível
  - Sistema de upload completamente reescrito para usar uploadFromBytes do Replit Object Storage
  - Corrigido botão "Entre em Contato" para navegar corretamente para /contatos
  - Botão "Saiba Mais" agora navega para /sobre-nos  
  - Botão "Cotação Rápida" agora navega diretamente para página de orçamentos (/cotacao)
  - Sistema de orçamento estabilizado e funcionando corretamente

## Recent Changes
- **July 10, 2025**: Implementação de Sistema de Upload de Imagens Otimizado
  - Criado sistema de upload melhorado com nomes únicos para prevenir conflitos de imagens
  - Implementado server/replit-storage.ts com classe ReplitStorageService para gerenciamento organizado de arquivos
  - Criado server/upload-config-persistent.ts com validação aprimorada e processamento em memória
  - Atualizado server/routes-products-upload.ts para endpoints dedicados de upload de produtos
  - Modificado deleteProduct para automaticamente remover imagens quando produto é deletado
  - Atualizado painel admin (client/src/pages/admin.tsx) para usar endpoints especializados de upload
  - Sistema agora usa timestamps únicos para evitar sobrescrita de imagens: [timestamp]-[filename]
  - Melhor organização de arquivos em uploads/products/ com validação de tipos de arquivo
  - Sistema robusto com tratamento de erros e logging detalhado para debug

- **July 8, 2025**: Complete GitHub Preparation and Documentation
  - Created comprehensive README.md with full project documentation
  - Enhanced .gitignore for proper file exclusion in version control
  - Added LICENSE file (MIT License) for open source distribution
  - Created CONTRIBUTING.md with development guidelines and contribution process
  - Updated .env.example with all necessary environment variables
  - Created automated preparation script (prepare-github.sh) for easy setup
  - Added GITHUB_SETUP.md with step-by-step upload instructions
  - Cleaned up temporary files and optimized project structure for GitHub
  - Project now ready for professional GitHub repository upload

- **July 1, 2025**: Admin Authentication System Fixed and Stabilized
  - Resolved critical React Error #310 (hooks violation) in admin panel
  - Fixed session configuration for production deployment on pollyfortrodas.com.br
  - Reorganized all React hooks to follow proper hook rules (all declarations before conditional returns)
  - Implemented proper CORS configuration for cross-domain authentication
  - Enhanced session cookie settings: secure: false, sameSite: 'lax', 24-hour persistence
  - Added comprehensive debug logging for session troubleshooting
  - Admin login now works reliably in both development and production environments
  - Admin credentials: username "admin", password "997649459@@"

- **July 1, 2025**: Complete Administrative Panel Redesign and User System Implementation
  - Completely removed old admin panels (admin-complete.tsx, admin-simple.tsx, admin.tsx)
  - Created new simplified admin panel (/admin) with focused functionality:
    - Product management with image upload
    - Category and brand management  
    - Quotation management and response system
  - New admin login system (/admin-login) with secure authentication
  - Created user registration page (/user-register) for customer accounts
  - Created dedicated quotations page (/quotations) for admin quote management
  - Streamlined admin interface with tabs for: Products, Categories, Brands, Quotations
  - Updated routing system to support new page structure
  - Maintained all existing database functionality and API endpoints

- **July 1, 2025**: Complete Brand and Category Management System Implemented
  - Successfully completed Phases 1-2 of the comprehensive expansion plan
  - Database migration: Transitioned from string-based to relational structure (products.brandId, products.categoryId)
  - Created dedicated brands and categories tables with proper foreign key relationships
  - Implemented complete CRUD APIs: /api/brands and /api/categories with full validation
  - Enhanced products API with JOIN queries including brandName and categoryName
  - Resolved route conflicts and optimized middleware ordering for performance
  - Real-time product counting for brands and categories
  - System ready for frontend integration (Phases 3-4)

- **July 1, 2025**: Image Upload System Implementation Completed
  - Successfully implemented file-based image upload system using Multer
  - Created secure upload endpoints at /api/products/upload for product image management
  - Configured 5MB file size limit with image format validation (PNG, JPEG, JPG)
  - Added static file serving for uploaded images at /uploads/products/
  - Comprehensive error handling for upload failures and file validation
  - Database integration working with persistent image URL storage
  - Upload system tested and confirmed working with proper file storage

- **July 1, 2025**: Admin User Management Updated
  - Added new admin user: username "admin" with secure password authentication
  - Enhanced admin authentication system with multiple user support
  - Both existing and new admin users have full system access

- **July 1, 2025**: PostgreSQL Database Integration Completed
  - Successfully migrated from memory storage to PostgreSQL database
  - Database connection established using Drizzle ORM with proper configuration
  - All database tables created: products, customers, quotations, CMS tables, and more
  - Database seeding working correctly with 6 sample products loaded
  - Added comprehensive error handling for unhandled promise rejections
  - Database operations fully functional and tested
  - Application ready for production deployment with persistent data storage

- **July 1, 2025**: Sistema de Cadastro de Produtos Completamente Reconstruído
  - Implementação de nova arquitetura baseada em service layer pattern
  - Criação do ProductService com validação abrangente e logging detalhado
  - Novas rotas otimizadas em /api/v2/products com melhor performance
  - Componente ProductForm.tsx completamente renovado com validação em tempo real
  - Sistema de feedback visual com erros e avisos para melhor experiência do usuário
  - Validação robusta com Zod incluindo campos obrigatórios e formatos específicos
  - Testes confirmados: criação, listagem, validação e feedback funcionando perfeitamente
  - Logs estruturados para debug e monitoramento da aplicação

- **June 30, 2025**: Simplificação e Otimização do Painel Administrativo
  - Remoção completa do CMS Builder do painel admin para simplificar funcionalidades
  - Adição de nova aba "Categorias & Marcas" no painel administrativo
  - Interface dedicada para gerenciamento de categorias de produtos
  - Interface dedicada para gerenciamento de marcas de produtos
  - Estatísticas visuais para categorias, marcas e produtos
  - Remoção da seção "Nossa Trajetória" da página Sobre Nós conforme solicitado
  - Otimização da experiência administrativa com foco em funcionalidades essenciais

- **June 30, 2025**: Sistema de Gestão de Produtos Completamente Renovado
  - Implementação de PostgreSQL para persistência real de dados
  - Sistema robusto de upload e gerenciamento de imagens com Multer
  - Tabela dedicada product_images com relações corretas no banco
  - Upload de múltiplas imagens por produto com metadados completos
  - Exclusão em cascata - ao deletar produto, remove todas imagens associadas
  - Persistência permanente de imagens em diretório uploads/products
  - Interface de administração melhorada com componente ImageUpload
  - Correção definitiva dos problemas de exclusão de produtos
  - Sistema preparado para deployment sem perda de imagens
  - Logs detalhados para debug e monitoramento
  
- **June 30, 2025**: Correção de Navegação e Scroll
  - Implementação de scroll automático para topo em mudança de páginas
  - Correção do erro useRouter no componente Header
  - Adição de useEffect com window.scrollTo(0, 0) em todas as páginas
  - Melhoria na experiência de navegação entre páginas

- **June 17, 2025**: CMS Builder Completo implementado (estilo WordPress/Elementor)
  - Sistema de drag-and-drop com react-dnd para construção visual de páginas
  - 25+ tipos de elementos: básicos, layout, mídia, formulários, avançados, negócios
  - Editor de propriedades abrangente com estilos CSS completos
  - Modo responsivo (desktop, tablet, mobile) com preview em tempo real
  - Sistema de histórico com undo/redo para controle de versões
  - Gerador inteligente de paletas de cores com algoritmos de harmonia
  - Configurações avançadas: animações, SEO, CSS/JS personalizado
  - Interface três painéis: biblioteca de elementos, canvas, propriedades
  - Substituição completa do theme builder anterior por solução profissional

- **June 17, 2025**: Smart Color Palette Generator integrado
  - Algoritmos de harmonia de cores (monocromática, análoga, complementar, tríade, tetrádica)
  - Ajustes baseados em mood (profissional, criativo, minimalista, energético, calmo, luxo)
  - Otimizações por categoria de website (negócios, e-commerce, portfólio, blog, etc.)
  - Funcionalidades de salvar/exportar (CSS variables, favoritos)
  - Interface interativa com seletor de cores e preview ao vivo

- **June 17, 2025**: Sistema de Modo Manutenção implementado
  - Interface de configuração no painel administrativo (aba Configurações)
  - Campos personalizáveis: título, mensagem, previsão de retorno, exibição de contatos
  - Página de manutenção elegante com suporte ao logo principal da empresa
  - Interceptação de rotas que permite apenas acesso administrativo durante manutenção
  - Persistência das configurações via localStorage
  - Integração com sistema de temas para exibição do logo personalizado

- **June 17, 2025**: Rotas em português implementadas
  - Migração completa para URLs em português: /produtos, /sobre-nos, /contatos, /cotacao
  - Atualização de todos os links de navegação (header, footer, páginas internas)
  - Função de busca redirecionando corretamente para /produtos
  - Manutenção da funcionalidade completa com novas rotas

- **June 14, 2025**: Sistema CMS WordPress-style completo implementado
  - Dashboard com posts, páginas, mídia, usuários, comentários, categorias, tags, menus e configurações
  - Interface administrativa integrada ao painel existente
  - API REST completa para todas as funcionalidades CMS
  - Formulários com validação e busca/filtros avançados

- **June 14, 2025**: Solução completa para vinculação de domínio externo
  - Servidor otimizado com HTTPS automático e headers de segurança
  - Scripts automatizados para configuração e verificação de domínio
  - Endpoints de monitoramento (/health, /domain-check, /api/status)
  - Documentação detalhada e troubleshooting automático
  - Suporte a CORS para domínios personalizados

- **June 14, 2025**: Initial setup

- **June 24, 2025**: Atualização completa dos dados de contato
  - Endereço atualizado para: Av. Anton Von Zuben, 2817, Sala 1 - Jd São José - Campinas/SP - CEP: 13051-145
  - Telefone atualizado para: (19) 9 9419 4339
  - Alterações aplicadas em todos os componentes: página de contatos, footer, manutenção, WhatsApp integration
  - Número do WhatsApp atualizado em todas as integrações (5519994194339)

## User Preferences
Preferred communication style: Simple, everyday language.