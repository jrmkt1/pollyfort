# Contributing to Pollyfort

Thank you for your interest in contributing to Pollyfort! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- PostgreSQL database
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/pollyfort.git
   cd pollyfort
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and other settings
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use Prettier for code formatting
- Write meaningful commit messages

### Database Changes
- Use Drizzle ORM for all database operations
- Run `npm run db:push` to apply schema changes
- Never write raw SQL migrations
- Test database changes thoroughly

### API Development
- Follow RESTful conventions
- Use Zod for request validation
- Include proper error handling
- Add appropriate TypeScript types

### Frontend Development
- Use React functional components with hooks
- Follow component composition patterns
- Use Tailwind CSS for styling
- Ensure responsive design

### Testing
- Test all new features manually
- Verify admin panel functionality
- Check mobile responsiveness
- Test database operations

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run type-check` - Run TypeScript checks

### Database
- `npm run db:push` - Push schema changes
- `npm run db:seed` - Seed database with sample data

### Production
- `npm run build` - Build for production
- `npm run start` - Start production server

## 📝 Commit Guidelines

Use conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add product image upload functionality
fix: resolve admin authentication session issue
docs: update API documentation
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment details**
   - Operating system
   - Node.js version
   - Browser (if frontend issue)

2. **Steps to reproduce**
   - Clear, numbered steps
   - Expected vs actual behavior

3. **Additional information**
   - Error messages
   - Screenshots (if applicable)
   - Console logs

## 💡 Feature Requests

For new features:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** the feature would solve
3. **Provide detailed requirements**
4. **Consider implementation** complexity

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests if applicable
   - Update documentation

3. **Test thoroughly**
   - Manual testing
   - Check for TypeScript errors
   - Verify database operations

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: description of your changes"
   git push origin feature/your-feature-name
   ```

5. **Create pull request**
   - Clear title and description
   - Reference related issues
   - Include screenshots for UI changes

## 🏗 Architecture Overview

### Project Structure
```
pollyfort/
├── client/          # React frontend
├── server/          # Express.js backend
├── shared/          # Shared types and schemas
├── database/        # Database scripts
├── uploads/         # File storage
└── scripts/         # Build and deployment
```

### Key Technologies
- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter
- **Backend**: Node.js, Express.js, PostgreSQL, Drizzle ORM
- **Build**: Vite, ESBuild, custom scripts

### Authentication
- Session-based authentication
- Separate admin and customer flows
- PostgreSQL session storage

## 🔒 Security Considerations

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Validate all user inputs
- Follow security best practices

## 📞 Support

- Create an issue for bugs or questions
- Use discussions for general questions
- Check existing documentation first

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Pollyfort! 🎉