import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Build connection for Replit's PostgreSQL
function getDatabaseConfig() {
  // Use Replit's PostgreSQL environment variables if available
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: false
    };
  }
  
  // Fallback to local configuration
  return {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE || 'postgres',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    ssl: false
  };
}

let pool: Pool | null = null;
let dbConnectionFailed = false;

// Initialize database connection with error handling
async function initializeDatabase() {
  if (dbConnectionFailed) {
    return null;
  }

  try {
    if (!pool) {
      pool = new Pool(getDatabaseConfig());
      
      pool.on('error', (err) => {
        console.error('Database pool error:', err);
        dbConnectionFailed = true;
      });

      // Test connection
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      
      console.log('Database connected successfully');
      dbInstance = drizzle(pool, { schema });
    }
    
    return dbInstance;
  } catch (error) {
    console.error('Database connection failed:', error);
    dbConnectionFailed = true;
    
    if (pool) {
      await pool.end().catch(() => {});
      pool = null;
    }
    
    return null;
  }
}

// Get database instance with fallback handling
export async function getDB() {
  if (dbConnectionFailed) {
    return null;
  }
  
  if (!dbInstance) {
    return await initializeDatabase();
  }
  
  return dbInstance;
}

// Initialize database instance on startup
let dbInstance: any = null;

async function initDB() {
  if (!dbInstance) {
    dbInstance = await initializeDatabase();
  }
  return dbInstance;
}

// Initialize immediately
initDB();

// Legacy exports for compatibility
export { pool };
export const db = drizzle(new Pool(getDatabaseConfig()), { schema });