# Pollyfort - E-commerce Platform for Polyurethane Wheels

A comprehensive full-stack e-commerce platform specializing in polyurethane wheels and parts for electric forklifts. Built with modern web technologies and designed for production deployment.

![Pollyfort](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)

## 🚀 Features

### Core Functionality
- **Product Catalog**: Comprehensive product management with categories, specifications, and images
- **Quotation System**: Complete request and response workflow for customer quotations
- **User Authentication**: Secure session-based authentication for customers and administrators
- **Admin Panel**: Full-featured administrative interface with product, category, and brand management
- **Image Upload**: Secure image upload system with validation and storage
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Advanced Features
- **Session Management**: Robust session handling with PostgreSQL storage
- **Database Integration**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Form Validation**: Comprehensive form validation with Zod schemas
- **Error Handling**: Production-ready error handling and logging
- **Production Deployment**: Optimized for production environments

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Query** for state management
- **React Hook Form** with Zod validation
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **Express Session** for authentication
- **Multer** for file uploads
- **Zod** for data validation

### Development Tools
- **ESBuild** for backend bundling
- **Drizzle Kit** for database migrations
- **TSX** for TypeScript execution
- **Custom build scripts** for production deployment

## 📋 Prerequisites

- Node.js 20 or higher
- PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pollyfort.git
   cd pollyfort
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   Configure your environment variables:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   SESSION_SECRET=your_secure_session_secret
   NODE_ENV=development
   PORT=3000
   ```

4. **Database setup**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:5173/admin-login

## 🗃 Database Schema

The application uses PostgreSQL with the following main entities:

- **Products**: Product catalog with specifications and images
- **Categories**: Product categorization system
- **Brands**: Brand management for products
- **Customers**: User account information
- **Quotations**: Customer quotation requests
- **Quotation Items**: Line items for quotations
- **Product Images**: Image storage and management

## 🔐 Authentication

### Customer Authentication
- Session-based authentication
- Secure password hashing with bcrypt
- Protected routes for authenticated users

### Admin Authentication
- Separate admin authentication flow
- Enhanced security for administrative functions
- Session management with PostgreSQL storage

**Default Admin Credentials:**
- Username: `admin`
- Password: `997649459@@`

## 📁 Project Structure

```
pollyfort/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages/routes
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express.js backend
│   ├── routes/             # API route handlers
│   ├── auth/               # Authentication logic
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
├── database/               # Database scripts and migrations
├── uploads/                # File upload storage
└── scripts/                # Build and deployment scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:seed` - Seed database with sample data
- `npm run type-check` - Run TypeScript type checking

## 📈 Production Deployment

The application is production-ready with:

- Optimized build process
- Session configuration for production environments
- CORS handling for cross-domain requests
- Comprehensive error logging
- Environment-based configuration

### Build Process

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

The build process:
- Compiles TypeScript to JavaScript
- Bundles frontend with Vite
- Optimizes assets for production
- Generates production-specific package.json

## 🌐 API Documentation

### Product Endpoints
- `GET /api/products` - List products with filtering
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/upload` - Upload product images

### Authentication Endpoints
- `POST /api/auth/login` - Customer login
- `POST /api/auth/register` - Customer registration
- `GET /api/auth/me` - Get current customer
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin

### Additional APIs
- Categories and Brands management
- Quotation system endpoints
- Contact form submissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]
- Website: [pollyfortrodas.com.br](https://pollyfortrodas.com.br)

## 🔄 Recent Updates

- **July 2025**: Fixed critical React Error #310 in admin authentication
- **July 2025**: Enhanced session management for production deployment
- **July 2025**: Complete admin panel redesign with improved UX
- **July 2025**: Implemented comprehensive brand and category management
- **July 2025**: Added secure image upload system with validation

---

Built with ❤️ for the material handling industry# pollyfort-ecommerce
