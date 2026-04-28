import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import simpleRoutes from "./routes-simple";
import productRoutes from "./routes-products";
import productRoutesV2 from "./routes-products-v2";
import productUploadRoutes from "./routes-products-upload";
import storageRepairRoutes from "./routes-storage-repair";
import testUploadRoutes from "./test-upload";
import { brandsAndCategoriesRouter } from "./routes-brands-categories";
import enhancedProductRoutes from "./routes-products-enhanced";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import session from "express-session";
import { getDB } from './db';
import { sendContactEmail } from './contact';

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log the error but don't exit the process in development
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Log the error but don't exit the process in development
});

const app = express();

// CORS middleware for production
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://pollyfortrodas.com.br',
    'http://pollyfortrodas.com.br',
    'http://localhost:5000',
    'http://localhost:3000'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'pollyfort-admin-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  name: 'pollyfort.sid',
  cookie: { 
    secure: false, // Set to false for now to work on both HTTP and HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Import persistent storage for file serving
import { persistentStorage } from './persistent-storage';

// Enhanced file serving with persistent storage fallback
app.get('/uploads/products/:filename', async (req, res) => {
  const filename = req.params.filename;
  
  try {
    console.log(`[File Serve] Requesting: ${filename}`);
    
    // Check if this is an Object Storage file (starts with product-timestamp-random)
    if (filename.match(/^product-\d+-\d+\./)) {
      const objectStorageUrl = `https://storage.replit.com/${filename}`;
      console.log(`[File Serve] Redirecting to Object Storage: ${objectStorageUrl}`);
      return res.redirect(objectStorageUrl);
    }
    
    // For local files, try local storage first
    const localPath = path.join(process.cwd(), 'uploads/products', filename);
    const fs = require('fs');
    if (fs.existsSync(localPath)) {
      console.log(`[File Serve] Serving from local storage: ${filename}`);
      return res.sendFile(localPath);
    }
    
    // File not found locally, try to retrieve from persistent storage
    console.log(`[File Serve] File not found locally, trying persistent storage: ${filename}`);
    const fileUrl = `/uploads/products/${filename}`;
    const buffer = await persistentStorage.retrieveFile(fileUrl);
    
    if (buffer) {
      console.log(`[File Serve] Retrieved from persistent storage: ${filename}`);
      // Set appropriate headers
      res.setHeader('Content-Type', 'image/jpeg'); // Default, could be improved
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      return res.send(buffer);
    }
    
    // File not found anywhere
    console.log(`[File Serve] File not found in any storage: ${filename}`);
    res.status(404).json({ error: 'Image not found' });
    
  } catch (error) {
    console.error(`[File Serve] Error serving file ${filename}:`, error);
    res.status(500).json({ error: 'Error serving image' });
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;

  res.send = function(data) {
    const duration = Date.now() - start;
    log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`, 
        typeof data === 'string' && data.length > 100 ? `${data.substring(0, 100)}…` : data);
    return originalSend.call(this, data);
  };

  next();
});

// Wrap all async operations in an async function to avoid top-level await
async function startServer() {
  try {

    // Admin session middleware
    function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
      if (!req.session.adminUserId) {
        return res.status(401).json({ message: "Admin authentication required" });
      }
      next();
    }

    // Admin login endpoint
    app.post("/api/admin/login", async (req, res) => {
      try {
        const { username, password } = req.body;
        console.log("Admin login attempt for username:", username);

        if (!username || !password) {
          return res.status(400).json({ message: "Username and password required" });
        }

        const { AdminAuthService } = await import('./admin-auth');
        const user = await AdminAuthService.verifyCredentials(username, password);

        if (!user) {
          console.log("Invalid credentials for username:", username);
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Set session
        req.session.adminUserId = user.id;
        await AdminAuthService.updateLastLogin(user.id);
        
        console.log("Admin login successful - Session ID:", req.sessionID);
        console.log("Admin login successful - User ID:", user.id);

        res.json({ 
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            role: user.role
          }
        });
      } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Admin logout endpoint
    app.post("/api/admin/logout", (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Could not log out" });
        }
        res.clearCookie('pollyfort.sid');
        res.json({ message: "Logout successful" });
      });
    });

    // Debug endpoint to check session
    app.get("/api/admin/session-debug", (req, res) => {
      res.json({
        sessionID: req.sessionID,
        session: req.session,
        adminUserId: req.session.adminUserId,
        cookies: req.headers.cookie,
        userAgent: req.headers['user-agent']
      });
    });

    // Admin me endpoint
    app.get("/api/admin/me", async (req, res) => {
      try {
        console.log("Admin /me check - Session ID:", req.sessionID);
        console.log("Admin /me check - adminUserId:", req.session.adminUserId);
        console.log("Admin /me check - Full session:", req.session);
        
        if (!req.session.adminUserId) {
          return res.status(401).json({ message: "Not authenticated" });
        }

        const { AdminAuthService } = await import('./admin-auth');
        const user = await AdminAuthService.getUser(req.session.adminUserId);

        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }

        res.json({
          user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            role: user.role
          }
        });
      } catch (error) {
        console.error("Admin me error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Apply admin auth middleware to protected admin routes
    app.use('/api/admin', (req, res, next) => {
      // Skip auth for login/logout endpoints
      if (req.path === '/login' || req.path === '/logout' || req.path === '/me') {
        return next();
      }
      return requireAdminAuth(req, res, next);
    });

    // Register main routes with admin authentication
    await registerRoutes(app);

    // API routes - order matters for route precedence
    app.use("/api", simpleRoutes);
    app.use("/api", brandsAndCategoriesRouter);
    app.use("/api/v2", productRoutes);
    app.use("/api/v2", productRoutesV2);
    app.use("/api/products", productUploadRoutes);
app.use("/api/storage", storageRepairRoutes);  // Product upload functionality
    app.use("/api", enhancedProductRoutes);  // Enhanced products with JOINs
    app.use("/api/test", testUploadRoutes);

    // Auth routes are handled in registerRoutes function

    // Contact form endpoint
    app.post('/api/contact', sendContactEmail);

    // Protected admin routes

    // Maintenance mode check
    app.use('/api/maintenance', (req, res) => {
      res.json({
        enabled: false,
        title: "Site em Manutenção",
        message: "Estamos realizando melhorias. Voltaremos em breve!"
      });
    });

    if (app.get("env") === "development") {
      await setupVite(app);
    } else {
      serveStatic(app);
    }

    // Global error handler
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      log(`Error: ${err.message}`, err.stack);
      res.status(500).json({ error: "Internal server error" });
    });

    // Seed database on startup
    try {
      await seedDatabase();
    } catch (error) {
      log("Database seeding failed:", error);
      log("Application will continue without seeding - database may need manual setup");
    }

    const PORT = parseInt(process.env.PORT || '5000', 10);
    app.listen(PORT, "0.0.0.0", () => {
      log(`serving on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer().catch((error) => {
  console.error("Unhandled error during server startup:", error);
  process.exit(1);
});
