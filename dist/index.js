var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  brands: () => brands,
  brandsRelations: () => brandsRelations,
  categories: () => categories,
  categoriesRelations: () => categoriesRelations,
  cmsCategories: () => cmsCategories,
  cmsCategoriesRelations: () => cmsCategoriesRelations,
  cmsComments: () => cmsComments,
  cmsCommentsRelations: () => cmsCommentsRelations,
  cmsMedia: () => cmsMedia,
  cmsMediaRelations: () => cmsMediaRelations,
  cmsMenuItems: () => cmsMenuItems,
  cmsMenuItemsRelations: () => cmsMenuItemsRelations,
  cmsMenus: () => cmsMenus,
  cmsMenusRelations: () => cmsMenusRelations,
  cmsOptions: () => cmsOptions,
  cmsPostCategories: () => cmsPostCategories,
  cmsPostTags: () => cmsPostTags,
  cmsPosts: () => cmsPosts,
  cmsPostsRelations: () => cmsPostsRelations,
  cmsTags: () => cmsTags,
  cmsTagsRelations: () => cmsTagsRelations,
  cmsUsers: () => cmsUsers,
  cmsUsersRelations: () => cmsUsersRelations,
  customers: () => customers,
  customersRelations: () => customersRelations,
  insertBrandSchema: () => insertBrandSchema,
  insertCategorySchema: () => insertCategorySchema,
  insertCmsCategorySchema: () => insertCmsCategorySchema,
  insertCmsCommentSchema: () => insertCmsCommentSchema,
  insertCmsMediaSchema: () => insertCmsMediaSchema,
  insertCmsMenuItemSchema: () => insertCmsMenuItemSchema,
  insertCmsMenuSchema: () => insertCmsMenuSchema,
  insertCmsOptionSchema: () => insertCmsOptionSchema,
  insertCmsPostSchema: () => insertCmsPostSchema,
  insertCmsTagSchema: () => insertCmsTagSchema,
  insertCmsUserSchema: () => insertCmsUserSchema,
  insertCustomerSchema: () => insertCustomerSchema,
  insertProductImageSchema: () => insertProductImageSchema,
  insertProductSchema: () => insertProductSchema,
  insertQuotationItemSchema: () => insertQuotationItemSchema,
  insertQuotationSchema: () => insertQuotationSchema,
  loginSchema: () => loginSchema,
  productImages: () => productImages,
  productImagesRelations: () => productImagesRelations,
  products: () => products,
  productsRelations: () => productsRelations,
  productsRelations2: () => productsRelations2,
  quotationItems: () => quotationItems,
  quotationItemsRelations: () => quotationItemsRelations,
  quotations: () => quotations,
  quotationsRelations: () => quotationsRelations,
  registerSchema: () => registerSchema
});
import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var customers, brands, categories, products, quotations, quotationItems, cmsUsers, cmsCategories, cmsTags, cmsPosts, cmsMedia, cmsPostCategories, cmsPostTags, cmsComments, cmsOptions, cmsMenus, cmsMenuItems, productImages, insertProductSchema, insertProductImageSchema, insertQuotationSchema, insertQuotationItemSchema, insertCustomerSchema, insertCategorySchema, insertBrandSchema, insertCmsUserSchema, insertCmsPostSchema, insertCmsCategorySchema, insertCmsTagSchema, insertCmsMediaSchema, insertCmsCommentSchema, insertCmsOptionSchema, insertCmsMenuSchema, insertCmsMenuItemSchema, loginSchema, registerSchema, customersRelations, quotationsRelations, quotationItemsRelations, brandsRelations, categoriesRelations, productsRelations, productImagesRelations, cmsUsersRelations, cmsCategoriesRelations, cmsTagsRelations, cmsPostsRelations, cmsMediaRelations, cmsCommentsRelations, cmsMenusRelations, cmsMenuItemsRelations, productsRelations2;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    customers = pgTable("customers", {
      id: serial("id").primaryKey(),
      email: varchar("email", { length: 255 }).notNull().unique(),
      password: varchar("password", { length: 255 }).notNull(),
      name: varchar("name", { length: 255 }).notNull(),
      phone: varchar("phone", { length: 50 }),
      company: varchar("company", { length: 255 }),
      address: text("address"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    brands = pgTable("brands", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull().unique(),
      description: text("description"),
      createdAt: timestamp("created_at").defaultNow()
    });
    categories = pgTable("categories", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull().unique(),
      description: text("description"),
      createdAt: timestamp("created_at").defaultNow()
    });
    products = pgTable("products", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      code: text("code").notNull().unique(),
      description: text("description").notNull(),
      brandId: integer("brand_id").references(() => brands.id, { onDelete: "set null" }),
      categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
      diameter: text("diameter").notNull(),
      width: text("width").notNull(),
      material: text("material").notNull(),
      imageUrl: text("image_url"),
      rating: integer("rating").default(0),
      reviewCount: integer("review_count").default(0),
      status: text("status").notNull().default("active"),
      featured: boolean("featured").default(false)
    });
    quotations = pgTable("quotations", {
      id: serial("id").primaryKey(),
      customerId: integer("customer_id").references(() => customers.id),
      name: text("name").notNull(),
      email: text("email").notNull(),
      phone: text("phone").notNull(),
      company: text("company"),
      products: text("products").notNull(),
      status: text("status").notNull().default("pending"),
      responseMessage: text("response_message"),
      totalValue: text("total_value"),
      validUntil: timestamp("valid_until"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    quotationItems = pgTable("quotation_items", {
      id: serial("id").primaryKey(),
      quotationId: integer("quotation_id").notNull().references(() => quotations.id, { onDelete: "cascade" }),
      productId: integer("product_id").notNull().references(() => products.id),
      quantity: integer("quantity").notNull().default(1),
      createdAt: timestamp("created_at").defaultNow()
    });
    cmsUsers = pgTable("cms_users", {
      id: serial("id").primaryKey(),
      username: varchar("username", { length: 100 }).notNull().unique(),
      email: varchar("email", { length: 255 }).notNull().unique(),
      password: varchar("password", { length: 255 }).notNull(),
      displayName: varchar("display_name", { length: 255 }).notNull(),
      role: varchar("role", { length: 50 }).notNull().default("editor"),
      // admin, editor, author, contributor
      bio: text("bio"),
      avatar: text("avatar"),
      isActive: boolean("is_active").default(true),
      lastLogin: timestamp("last_login"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    cmsCategories = pgTable("cms_categories", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      slug: varchar("slug", { length: 255 }).notNull().unique(),
      description: text("description"),
      parentId: integer("parent_id"),
      count: integer("count").default(0),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    cmsTags = pgTable("cms_tags", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      slug: varchar("slug", { length: 255 }).notNull().unique(),
      description: text("description"),
      count: integer("count").default(0),
      createdAt: timestamp("created_at").defaultNow()
    });
    cmsPosts = pgTable("cms_posts", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 500 }).notNull(),
      slug: varchar("slug", { length: 500 }).notNull().unique(),
      content: text("content").notNull(),
      excerpt: text("excerpt"),
      type: varchar("type", { length: 50 }).notNull().default("post"),
      // post, page, product, etc
      status: varchar("status", { length: 50 }).notNull().default("draft"),
      // draft, published, private, trash
      authorId: integer("author_id").notNull().references(() => cmsUsers.id),
      parentId: integer("parent_id"),
      featuredImage: text("featured_image"),
      metaTitle: varchar("meta_title", { length: 255 }),
      metaDescription: text("meta_description"),
      metaKeywords: text("meta_keywords"),
      publishedAt: timestamp("published_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    cmsMedia = pgTable("cms_media", {
      id: serial("id").primaryKey(),
      filename: varchar("filename", { length: 255 }).notNull(),
      originalName: varchar("original_name", { length: 255 }).notNull(),
      mimeType: varchar("mime_type", { length: 100 }).notNull(),
      size: integer("size").notNull(),
      url: text("url").notNull(),
      alt: varchar("alt", { length: 255 }),
      caption: text("caption"),
      description: text("description"),
      uploadedBy: integer("uploaded_by").notNull().references(() => cmsUsers.id),
      createdAt: timestamp("created_at").defaultNow()
    });
    cmsPostCategories = pgTable("cms_post_categories", {
      postId: integer("post_id").notNull().references(() => cmsPosts.id, { onDelete: "cascade" }),
      categoryId: integer("category_id").notNull().references(() => cmsCategories.id, { onDelete: "cascade" })
    });
    cmsPostTags = pgTable("cms_post_tags", {
      postId: integer("post_id").notNull().references(() => cmsPosts.id, { onDelete: "cascade" }),
      tagId: integer("tag_id").notNull().references(() => cmsTags.id, { onDelete: "cascade" })
    });
    cmsComments = pgTable("cms_comments", {
      id: serial("id").primaryKey(),
      postId: integer("post_id").notNull().references(() => cmsPosts.id, { onDelete: "cascade" }),
      parentId: integer("parent_id"),
      authorName: varchar("author_name", { length: 255 }).notNull(),
      authorEmail: varchar("author_email", { length: 255 }).notNull(),
      authorUrl: varchar("author_url", { length: 255 }),
      content: text("content").notNull(),
      status: varchar("status", { length: 50 }).notNull().default("pending"),
      // approved, pending, spam, trash
      userAgent: text("user_agent"),
      ipAddress: varchar("ip_address", { length: 45 }),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    cmsOptions = pgTable("cms_options", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull().unique(),
      value: text("value"),
      autoload: boolean("autoload").default(true),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    cmsMenus = pgTable("cms_menus", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      slug: varchar("slug", { length: 255 }).notNull().unique(),
      description: text("description"),
      createdAt: timestamp("created_at").defaultNow()
    });
    cmsMenuItems = pgTable("cms_menu_items", {
      id: serial("id").primaryKey(),
      menuId: integer("menu_id").notNull().references(() => cmsMenus.id, { onDelete: "cascade" }),
      title: varchar("title", { length: 255 }).notNull(),
      url: text("url").notNull(),
      target: varchar("target", { length: 50 }).default("_self"),
      classes: varchar("classes", { length: 255 }),
      parentId: integer("parent_id"),
      order: integer("order").default(0),
      createdAt: timestamp("created_at").defaultNow()
    });
    productImages = pgTable("product_images", {
      id: serial("id").primaryKey(),
      filename: varchar("filename", { length: 255 }).notNull(),
      originalName: varchar("original_name", { length: 255 }).notNull(),
      mimeType: varchar("mime_type", { length: 100 }).notNull(),
      size: integer("size").notNull(),
      path: varchar("path", { length: 500 }).notNull(),
      url: varchar("url", { length: 500 }).notNull(),
      productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }),
      isPrimary: boolean("is_primary").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertProductSchema = createInsertSchema(products).omit({
      id: true
    });
    insertProductImageSchema = createInsertSchema(productImages).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertQuotationSchema = createInsertSchema(quotations).omit({
      id: true,
      createdAt: true
    });
    insertQuotationItemSchema = createInsertSchema(quotationItems).omit({
      id: true,
      createdAt: true
    });
    insertCustomerSchema = createInsertSchema(customers).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertCategorySchema = createInsertSchema(categories).omit({
      id: true,
      createdAt: true
    });
    insertBrandSchema = createInsertSchema(brands).omit({
      id: true,
      createdAt: true
    });
    insertCmsUserSchema = createInsertSchema(cmsUsers).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true
    });
    insertCmsPostSchema = createInsertSchema(cmsPosts).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertCmsCategorySchema = createInsertSchema(cmsCategories).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      count: true
    });
    insertCmsTagSchema = createInsertSchema(cmsTags).omit({
      id: true,
      createdAt: true,
      count: true
    });
    insertCmsMediaSchema = createInsertSchema(cmsMedia).omit({
      id: true,
      createdAt: true
    });
    insertCmsCommentSchema = createInsertSchema(cmsComments).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertCmsOptionSchema = createInsertSchema(cmsOptions).omit({
      id: true,
      updatedAt: true
    });
    insertCmsMenuSchema = createInsertSchema(cmsMenus).omit({
      id: true,
      createdAt: true
    });
    insertCmsMenuItemSchema = createInsertSchema(cmsMenuItems).omit({
      id: true,
      createdAt: true
    });
    loginSchema = z.object({
      email: z.string().email("E-mail inv\xE1lido"),
      password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
    });
    registerSchema = z.object({
      name: z.string().min(1, "Nome \xE9 obrigat\xF3rio"),
      email: z.string().email("E-mail inv\xE1lido"),
      password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
      phone: z.string().optional(),
      company: z.string().optional(),
      address: z.string().optional()
    });
    customersRelations = relations(customers, ({ many }) => ({
      quotations: many(quotations)
    }));
    quotationsRelations = relations(quotations, ({ one, many }) => ({
      customer: one(customers, {
        fields: [quotations.customerId],
        references: [customers.id]
      }),
      quotationItems: many(quotationItems)
    }));
    quotationItemsRelations = relations(quotationItems, ({ one }) => ({
      quotation: one(quotations, {
        fields: [quotationItems.quotationId],
        references: [quotations.id]
      }),
      product: one(products, {
        fields: [quotationItems.productId],
        references: [products.id]
      })
    }));
    brandsRelations = relations(brands, ({ many }) => ({
      products: many(products)
    }));
    categoriesRelations = relations(categories, ({ many }) => ({
      products: many(products)
    }));
    productsRelations = relations(products, ({ one, many }) => ({
      brand: one(brands, {
        fields: [products.brandId],
        references: [brands.id]
      }),
      category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id]
      }),
      quotationItems: many(quotationItems),
      images: many(productImages)
    }));
    productImagesRelations = relations(productImages, ({ one }) => ({
      product: one(products, {
        fields: [productImages.productId],
        references: [products.id]
      })
    }));
    cmsUsersRelations = relations(cmsUsers, ({ many }) => ({
      posts: many(cmsPosts),
      media: many(cmsMedia)
    }));
    cmsCategoriesRelations = relations(cmsCategories, ({ one, many }) => ({
      parent: one(cmsCategories, {
        fields: [cmsCategories.parentId],
        references: [cmsCategories.id]
      }),
      children: many(cmsCategories),
      posts: many(cmsPostCategories)
    }));
    cmsTagsRelations = relations(cmsTags, ({ many }) => ({
      posts: many(cmsPostTags)
    }));
    cmsPostsRelations = relations(cmsPosts, ({ one, many }) => ({
      author: one(cmsUsers, {
        fields: [cmsPosts.authorId],
        references: [cmsUsers.id]
      }),
      parent: one(cmsPosts, {
        fields: [cmsPosts.parentId],
        references: [cmsPosts.id]
      }),
      children: many(cmsPosts),
      categories: many(cmsPostCategories),
      tags: many(cmsPostTags),
      comments: many(cmsComments)
    }));
    cmsMediaRelations = relations(cmsMedia, ({ one }) => ({
      uploadedByUser: one(cmsUsers, {
        fields: [cmsMedia.uploadedBy],
        references: [cmsUsers.id]
      })
    }));
    cmsCommentsRelations = relations(cmsComments, ({ one, many }) => ({
      post: one(cmsPosts, {
        fields: [cmsComments.postId],
        references: [cmsPosts.id]
      }),
      parent: one(cmsComments, {
        fields: [cmsComments.parentId],
        references: [cmsComments.id]
      }),
      replies: many(cmsComments)
    }));
    cmsMenusRelations = relations(cmsMenus, ({ many }) => ({
      items: many(cmsMenuItems)
    }));
    cmsMenuItemsRelations = relations(cmsMenuItems, ({ one, many }) => ({
      menu: one(cmsMenus, {
        fields: [cmsMenuItems.menuId],
        references: [cmsMenus.id]
      }),
      parent: one(cmsMenuItems, {
        fields: [cmsMenuItems.parentId],
        references: [cmsMenuItems.id]
      }),
      children: many(cmsMenuItems)
    }));
    productsRelations2 = relations(products, ({ many }) => ({
      quotationItems: many(quotationItems)
    }));
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  db: () => db2,
  getDB: () => getDB,
  pool: () => pool
});
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
function getDatabaseConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: false,
      connectionTimeoutMillis: 1500
    };
  }
  return {
    host: process.env.PGHOST || "localhost",
    port: parseInt(process.env.PGPORT || "5432"),
    database: process.env.PGDATABASE || "postgres",
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "",
    ssl: false,
    connectionTimeoutMillis: 1500
  };
}
async function initializeDatabase() {
  if (dbConnectionFailed) {
    return null;
  }
  try {
    if (!pool) {
      pool = new Pool(getDatabaseConfig());
      pool.on("error", (err) => {
        console.error("Database pool error:", err);
        dbConnectionFailed = true;
      });
      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();
      console.log("Database connected successfully");
      dbInstance = drizzle(pool, { schema: schema_exports });
    }
    return dbInstance;
  } catch (error) {
    console.error("Database connection failed:", error);
    dbConnectionFailed = true;
    if (pool) {
      await pool.end().catch(() => {
      });
      pool = null;
    }
    return null;
  }
}
async function getDB() {
  if (dbConnectionFailed) {
    return null;
  }
  if (!dbInstance) {
    return await initializeDatabase();
  }
  return dbInstance;
}
async function initDB() {
  if (!dbInstance) {
    dbInstance = await initializeDatabase();
  }
  return dbInstance;
}
var pool, dbConnectionFailed, dbInstance, db2;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    pool = null;
    dbConnectionFailed = false;
    dbInstance = null;
    initDB();
    db2 = drizzle(new Pool(getDatabaseConfig()), { schema: schema_exports });
  }
});

// server/persistent-storage.ts
import fs from "fs-extra";
import path from "path";
var Database, ObjectStorage, PersistentStorageService, persistentStorage;
var init_persistent_storage = __esm({
  "server/persistent-storage.ts"() {
    "use strict";
    Database = null;
    try {
      const replitDB = __require("@replit/database");
      Database = replitDB;
    } catch (error) {
      console.warn("[PersistentStorage] Replit Database not available");
    }
    ObjectStorage = null;
    try {
      const replitStorage = __require("@replit/object-storage");
      ObjectStorage = replitStorage.Client;
    } catch (error) {
      console.warn("[PersistentStorage] Replit Object Storage not available");
    }
    PersistentStorageService = class _PersistentStorageService {
      static instance;
      db = null;
      objectStorage = null;
      uploadsDir = path.join(process.cwd(), "uploads", "products");
      useDatabase = false;
      useObjectStorage = false;
      static getInstance() {
        if (!_PersistentStorageService.instance) {
          _PersistentStorageService.instance = new _PersistentStorageService();
        }
        return _PersistentStorageService.instance;
      }
      constructor() {
        this.initialize();
      }
      async initialize() {
        try {
          if (Database) {
            this.db = new Database();
            this.useDatabase = true;
            console.log("[PersistentStorage] Replit Database initialized for metadata");
          }
        } catch (error) {
          console.warn("[PersistentStorage] Failed to initialize Database:", error);
        }
        try {
          if (ObjectStorage) {
            this.objectStorage = new ObjectStorage();
            this.useObjectStorage = true;
            console.log("[PersistentStorage] Object Storage initialized");
          }
        } catch (error) {
          console.warn("[PersistentStorage] Failed to initialize Object Storage:", error);
        }
        await fs.ensureDir(this.uploadsDir);
        console.log("[PersistentStorage] Local storage directory ensured");
      }
      /**
       * Store file with multiple backup strategies for maximum persistence
       */
      async storeFile(buffer, originalName, mimetype, productId) {
        const { createHash } = await import("crypto");
        const timestamp2 = Date.now();
        const random = Math.floor(Math.random() * 1e6);
        const extension = originalName.split(".").pop() || "jpg";
        const fileHash = createHash("md5").update(buffer).digest("hex").substring(0, 8);
        const uniqueFilename = `product-${timestamp2}-${fileHash}-${random}.${extension}`;
        console.log(`[PersistentStorage] Storing file: ${uniqueFilename} (${buffer.length} bytes)`);
        const fileMetadata = {
          filename: uniqueFilename,
          originalName,
          mimetype,
          size: buffer.length,
          url: "",
          storageType: "local",
          timestamp: timestamp2,
          productId
        };
        let primaryUrl = "";
        let backupUrls = [];
        if (this.useObjectStorage && this.objectStorage) {
          try {
            await this.objectStorage.uploadFromBytes(uniqueFilename, buffer);
            primaryUrl = `https://storage.replit.com/${uniqueFilename}`;
            fileMetadata.storageType = "object-storage";
            fileMetadata.url = primaryUrl;
            console.log(`[PersistentStorage] Object Storage upload successful: ${primaryUrl}`);
          } catch (error) {
            console.warn("[PersistentStorage] Object Storage failed:", error);
          }
        }
        try {
          const localPath = path.join(this.uploadsDir, uniqueFilename);
          await fs.writeFile(localPath, buffer);
          const localUrl = `/uploads/products/${uniqueFilename}`;
          backupUrls.push(localUrl);
          if (!primaryUrl) {
            primaryUrl = localUrl;
            fileMetadata.storageType = "local";
            fileMetadata.url = primaryUrl;
          }
          console.log(`[PersistentStorage] Local backup stored: ${localUrl}`);
        } catch (error) {
          console.error("[PersistentStorage] Local storage failed:", error);
        }
        if (this.useDatabase && buffer.length < 1024 * 1024) {
          try {
            const base64Data = buffer.toString("base64");
            const dbKey = `file:${uniqueFilename}`;
            await this.db.set(dbKey, {
              ...fileMetadata,
              base64Data,
              backupUrls
            });
            console.log(`[PersistentStorage] Database backup stored: ${dbKey}`);
          } catch (error) {
            console.warn("[PersistentStorage] Database backup failed:", error);
          }
        }
        if (this.useDatabase) {
          try {
            const metadataKey = `metadata:${uniqueFilename}`;
            await this.db.set(metadataKey, {
              ...fileMetadata,
              backupUrls,
              createdAt: (/* @__PURE__ */ new Date()).toISOString()
            });
            console.log(`[PersistentStorage] Metadata stored: ${metadataKey}`);
          } catch (error) {
            console.warn("[PersistentStorage] Metadata storage failed:", error);
          }
        }
        if (!primaryUrl) {
          throw new Error("All storage strategies failed");
        }
        console.log(`[PersistentStorage] File stored successfully with ${backupUrls.length} backups: ${primaryUrl}`);
        return primaryUrl;
      }
      /**
       * Retrieve file from any available storage
       */
      async retrieveFile(fileUrl) {
        try {
          const filename = this.extractFilename(fileUrl);
          console.log(`[PersistentStorage] Retrieving file: ${filename}`);
          if (fileUrl.includes("storage.replit.com") && this.useObjectStorage && this.objectStorage) {
            try {
              const result = await this.objectStorage.downloadAsBytes(filename);
              if (result.ok && result.value) {
                console.log(`[PersistentStorage] Retrieved from Object Storage: ${filename}`);
                return Buffer.from(result.value);
              }
            } catch (error) {
              console.warn("[PersistentStorage] Object Storage retrieval failed:", error);
            }
          }
          const localPath = path.join(this.uploadsDir, filename);
          if (await fs.pathExists(localPath)) {
            const buffer = await fs.readFile(localPath);
            console.log(`[PersistentStorage] Retrieved from local storage: ${filename}`);
            return buffer;
          }
          if (this.useDatabase) {
            try {
              const dbKey = `file:${filename}`;
              const storedData = await this.db.get(dbKey);
              if (storedData && storedData.base64Data) {
                const buffer = Buffer.from(storedData.base64Data, "base64");
                console.log(`[PersistentStorage] Retrieved from database backup: ${filename}`);
                try {
                  await fs.writeFile(localPath, buffer);
                  console.log(`[PersistentStorage] Restored to local storage: ${filename}`);
                } catch (restoreError) {
                  console.warn("[PersistentStorage] Failed to restore to local:", restoreError);
                }
                return buffer;
              }
            } catch (error) {
              console.warn("[PersistentStorage] Database retrieval failed:", error);
            }
          }
          console.log(`[PersistentStorage] File not found in any storage: ${filename}`);
          return null;
        } catch (error) {
          console.error("[PersistentStorage] Retrieval error:", error);
          return null;
        }
      }
      /**
       * Delete file from all storage locations
       */
      async deleteFile(fileUrl) {
        try {
          const filename = this.extractFilename(fileUrl);
          console.log(`[PersistentStorage] Deleting file: ${filename}`);
          if (fileUrl.includes("storage.replit.com") && this.useObjectStorage && this.objectStorage) {
            try {
              await this.objectStorage.delete(filename);
              console.log(`[PersistentStorage] Deleted from Object Storage: ${filename}`);
            } catch (error) {
              console.warn("[PersistentStorage] Object Storage deletion failed:", error);
            }
          }
          const localPath = path.join(this.uploadsDir, filename);
          if (await fs.pathExists(localPath)) {
            await fs.remove(localPath);
            console.log(`[PersistentStorage] Deleted from local storage: ${filename}`);
          }
          if (this.useDatabase) {
            try {
              await this.db.delete(`file:${filename}`);
              await this.db.delete(`metadata:${filename}`);
              console.log(`[PersistentStorage] Deleted from database: ${filename}`);
            } catch (error) {
              console.warn("[PersistentStorage] Database deletion failed:", error);
            }
          }
        } catch (error) {
          console.error("[PersistentStorage] Deletion error:", error);
        }
      }
      /**
       * List all stored files
       */
      async listFiles() {
        const files = [];
        try {
          if (this.useDatabase) {
            try {
              const keys = await this.db.list("metadata:");
              for (const key of keys) {
                const metadata = await this.db.get(key);
                if (metadata) {
                  files.push(metadata);
                }
              }
              return files;
            } catch (error) {
              console.warn("[PersistentStorage] Database listing failed:", error);
            }
          }
          const localFiles = await fs.readdir(this.uploadsDir);
          for (const filename of localFiles) {
            const filePath = path.join(this.uploadsDir, filename);
            const stats = await fs.stat(filePath);
            files.push({
              filename,
              originalName: filename,
              mimetype: "image/jpeg",
              // Default, could be improved
              size: stats.size,
              url: `/uploads/products/${filename}`,
              storageType: "local",
              timestamp: stats.mtime.getTime()
            });
          }
        } catch (error) {
          console.error("[PersistentStorage] Listing error:", error);
        }
        return files;
      }
      /**
       * Check if file exists in any storage
       */
      async fileExists(fileUrl) {
        const filename = this.extractFilename(fileUrl);
        if (fileUrl.includes("storage.replit.com") && this.useObjectStorage && this.objectStorage) {
          try {
            const result = await this.objectStorage.downloadAsBytes(filename);
            if (result.ok) return true;
          } catch (error) {
          }
        }
        const localPath = path.join(this.uploadsDir, filename);
        if (await fs.pathExists(localPath)) return true;
        if (this.useDatabase) {
          try {
            const dbKey = `file:${filename}`;
            const data = await this.db.get(dbKey);
            if (data && data.base64Data) return true;
          } catch (error) {
          }
        }
        return false;
      }
      /**
       * Repair missing files by restoring from backups
       */
      async repairMissingFiles() {
        console.log("[PersistentStorage] Starting file repair process...");
        if (!this.useDatabase) {
          console.log("[PersistentStorage] Database not available, cannot repair files");
          return;
        }
        try {
          const keys = await this.db.list("metadata:");
          let repairedCount = 0;
          for (const key of keys) {
            const metadata = await this.db.get(key);
            if (!metadata) continue;
            const primaryExists = await this.fileExists(metadata.url);
            if (!primaryExists) {
              console.log(`[PersistentStorage] Repairing missing file: ${metadata.filename}`);
              const dbFileKey = `file:${metadata.filename}`;
              const fileData = await this.db.get(dbFileKey);
              if (fileData && fileData.base64Data) {
                const buffer = Buffer.from(fileData.base64Data, "base64");
                const localPath = path.join(this.uploadsDir, metadata.filename);
                await fs.writeFile(localPath, buffer);
                console.log(`[PersistentStorage] Restored file to local storage: ${metadata.filename}`);
                repairedCount++;
              }
            }
          }
          console.log(`[PersistentStorage] File repair completed. Restored ${repairedCount} files.`);
        } catch (error) {
          console.error("[PersistentStorage] File repair failed:", error);
        }
      }
      extractFilename(fileUrl) {
        if (fileUrl.includes("storage.replit.com")) {
          return fileUrl.split("/").pop() || "";
        } else if (fileUrl.includes("/uploads/products/")) {
          return path.basename(fileUrl);
        }
        return fileUrl;
      }
    };
    persistentStorage = PersistentStorageService.getInstance();
  }
});

// server/upload-config-persistent.ts
var upload_config_persistent_exports = {};
__export(upload_config_persistent_exports, {
  deleteUploadedFile: () => deleteUploadedFile,
  processUploadedFile: () => processUploadedFile,
  upload: () => upload
});
import multer from "multer";
async function processUploadedFile(file, productId) {
  try {
    console.log("[Upload] Processing file for maximum persistence:", file.originalname);
    if (!file.buffer) {
      throw new Error("File buffer is empty");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds 5MB limit");
    }
    const publicUrl = await persistentStorage.storeFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      productId
    );
    console.log("[Upload] File processed and stored with maximum persistence:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("[Upload] Error processing file:", error);
    throw new Error("Failed to upload file to persistent storage");
  }
}
async function deleteUploadedFile(imageUrl) {
  try {
    if (imageUrl && (imageUrl.includes("/uploads/products/") || imageUrl.includes("storage.replit.com"))) {
      console.log("[Upload] Deleting file from all persistent storage locations:", imageUrl);
      await persistentStorage.deleteFile(imageUrl);
    }
  } catch (error) {
    console.error("[Upload] Error deleting file:", error);
  }
}
var storage, fileFilter, upload;
var init_upload_config_persistent = __esm({
  "server/upload-config-persistent.ts"() {
    "use strict";
    init_persistent_storage();
    storage = multer.memoryStorage();
    fileFilter = (req, file, cb) => {
      console.log("[Upload] Validating file:", file.originalname, "MIME:", file.mimetype);
      if (file.mimetype.startsWith("image/")) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Only JPEG, JPG, PNG and WebP images are allowed!"));
        }
      } else {
        cb(new Error("Only image files are allowed!"));
      }
    };
    upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024,
        // 5MB limit
        files: 1
        // Only one file at a time
      }
    });
  }
});

// server/admin-auth.ts
var admin_auth_exports = {};
__export(admin_auth_exports, {
  AdminAuthService: () => AdminAuthService
});
import bcrypt2 from "bcrypt";
var DEFAULT_ADMIN, ADMIN_USER, adminUsers, nextUserId, AdminAuthService;
var init_admin_auth = __esm({
  "server/admin-auth.ts"() {
    "use strict";
    DEFAULT_ADMIN = {
      id: 1,
      username: "jrmkt",
      password: bcrypt2.hashSync("JR@a4xpc2zs", 10),
      // Senha atualizada
      displayName: "Jo\xE3o Roberto",
      email: "admin@pollyfort.com",
      role: "admin",
      isActive: true,
      createdAt: /* @__PURE__ */ new Date()
    };
    ADMIN_USER = {
      id: 2,
      username: "admin",
      password: bcrypt2.hashSync("997649459@@", 10),
      displayName: "Administrador",
      email: "admin@pollyfort.com",
      role: "admin",
      isActive: true,
      createdAt: /* @__PURE__ */ new Date()
    };
    adminUsers = [DEFAULT_ADMIN, ADMIN_USER];
    nextUserId = 3;
    AdminAuthService = class {
      static async verifyCredentials(username, password) {
        const user = adminUsers.find((u) => u.username === username && u.isActive);
        if (!user) {
          return null;
        }
        const isValid = await bcrypt2.compare(password, user.password);
        return isValid ? user : null;
      }
      static async getUser(id) {
        return adminUsers.find((u) => u.id === id && u.isActive) || null;
      }
      static async getUserByUsername(username) {
        return adminUsers.find((u) => u.username === username) || null;
      }
      static async getAllUsers() {
        return adminUsers.map(({ password, ...user }) => user);
      }
      static async createUser(userData) {
        const hashedPassword = await bcrypt2.hash(userData.password, 10);
        const newUser = {
          id: nextUserId++,
          username: userData.username,
          password: hashedPassword,
          displayName: userData.displayName,
          email: userData.email,
          role: userData.role || "admin",
          isActive: userData.isActive !== void 0 ? userData.isActive : true,
          createdAt: /* @__PURE__ */ new Date()
        };
        adminUsers.push(newUser);
        return newUser;
      }
      static async updateUser(id, updates) {
        const userIndex = adminUsers.findIndex((u) => u.id === id);
        if (userIndex === -1) {
          return null;
        }
        if (updates.password) {
          updates.password = await bcrypt2.hash(updates.password, 10);
        }
        adminUsers[userIndex] = { ...adminUsers[userIndex], ...updates };
        return adminUsers[userIndex];
      }
      static async deleteUser(id) {
        const userIndex = adminUsers.findIndex((u) => u.id === id);
        if (userIndex === -1) {
          return false;
        }
        adminUsers.splice(userIndex, 1);
        return true;
      }
      static async updateLastLogin(id) {
        const user = adminUsers.find((u) => u.id === id);
        if (user) {
          user.lastLogin = /* @__PURE__ */ new Date();
        }
      }
    };
  }
});

// server/log.ts
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var init_log = __esm({
  "server/log.ts"() {
    "use strict";
  }
});

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path6 from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var __dirname, vite_config_default;
var init_vite_config = __esm({
  async "vite.config.ts"() {
    "use strict";
    __dirname = path6.dirname(fileURLToPath(import.meta.url));
    vite_config_default = defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay(),
        ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
          await import("@replit/vite-plugin-cartographer").then(
            (m) => m.cartographer()
          )
        ] : []
      ],
      resolve: {
        alias: {
          "@": path6.resolve(__dirname, "client", "src"),
          "@shared": path6.resolve(__dirname, "shared"),
          "@assets": path6.resolve(__dirname, "assets", "images")
        }
      },
      root: path6.resolve(__dirname, "client"),
      build: {
        outDir: path6.resolve(__dirname, "dist/public"),
        emptyOutDir: true
      },
      server: {
        fs: {
          strict: true,
          deny: ["**/.*"]
        }
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log,
  serveStatic: () => serveStatic,
  setupVite: () => setupVite
});
import express3 from "express";
import fs6 from "fs";
import path7 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path7.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs6.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path7.resolve(__dirname2, "public");
  if (!fs6.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express3.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path7.resolve(distPath, "index.html"));
  });
}
var viteLogger, __dirname2;
var init_vite = __esm({
  async "server/vite.ts"() {
    "use strict";
    await init_vite_config();
    init_log();
    viteLogger = createLogger();
    __dirname2 = path7.dirname(fileURLToPath2(import.meta.url));
  }
});

// server/index.ts
import express4 from "express";
import { createServer as createServer2 } from "http";
import path8 from "path";
import { pathToFileURL } from "url";

// server/routes.ts
import express from "express";
import { createServer } from "http";
import path4 from "path";
import fs4 from "fs";

// server/storage.ts
init_schema();
init_db();
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcrypt";
var DatabaseStorage = class {
  async getProducts() {
    const result = await db2.select().from(products).where(eq(products.status, "active"));
    return result;
  }
  async getProduct(id) {
    const [product] = await db2.select().from(products).where(eq(products.id, id));
    return product || void 0;
  }
  async getProductsByCategory(category) {
    const result = await db2.select().from(products).where(and(eq(products.category, category), eq(products.status, "active")));
    return result;
  }
  async searchProducts(query) {
    const searchTerm = `%${query.toLowerCase()}%`;
    const result = await db2.select().from(products).where(eq(products.status, "active"));
    return result.filter(
      (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()) || p.code.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())
    );
  }
  async createProduct(insertProduct) {
    const [product] = await db2.insert(products).values(insertProduct).returning();
    return product;
  }
  async updateProduct(id, updates) {
    const [product] = await db2.update(products).set(updates).where(eq(products.id, id)).returning();
    return product || void 0;
  }
  async deleteProduct(id) {
    try {
      console.log(`[storage] Tentando deletar produto ID: ${id}`);
      const existingProduct = await db2.select().from(products).where(eq(products.id, id));
      if (existingProduct.length === 0) {
        console.log(`[storage] Produto ${id} n\xE3o encontrado`);
        return false;
      }
      const product = existingProduct[0];
      if (product.imageUrl && product.imageUrl.includes("/uploads/products/")) {
        try {
          const { deleteUploadedFile: deleteUploadedFile3 } = await Promise.resolve().then(() => (init_upload_config_persistent(), upload_config_persistent_exports));
          await deleteUploadedFile3(product.imageUrl);
          console.log(`[storage] Imagem do produto ${id} removida do armazenamento persistente`);
        } catch (imageError) {
          console.warn(`[storage] Falha ao remover imagem do produto ${id}:`, imageError);
        }
      }
      console.log(`[storage] Produto ${id} encontrado, realizando exclus\xE3o...`);
      const result = await db2.delete(products).where(eq(products.id, id));
      console.log(`[storage] Resultado da exclus\xE3o:`, result);
      const success = result.rowCount !== null && result.rowCount > 0;
      console.log(`[storage] Produto ${id} deletado com sucesso: ${success}`);
      return success;
    } catch (error) {
      console.error(`[storage] Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  }
  async getQuotations() {
    const result = await db2.select().from(quotations).orderBy(desc(quotations.createdAt));
    return result;
  }
  async getQuotation(id) {
    const [quotation] = await db2.select().from(quotations).where(eq(quotations.id, id));
    return quotation || void 0;
  }
  async createQuotation(insertQuotation, items) {
    const [quotation] = await db2.insert(quotations).values(insertQuotation).returning();
    if (items && items.length > 0) {
      await db2.insert(quotationItems).values(
        items.map((item) => ({
          quotationId: quotation.id,
          productId: item.productId,
          quantity: item.quantity
        }))
      );
    }
    return quotation;
  }
  async updateQuotationStatus(id, status) {
    const [quotation] = await db2.update(quotations).set({ status }).where(eq(quotations.id, id)).returning();
    return quotation || void 0;
  }
  async getQuotationsByCustomer(customerId) {
    const result = await db2.select().from(quotations).where(eq(quotations.customerId, customerId)).orderBy(desc(quotations.createdAt));
    return result;
  }
  async getQuotationWithItems(quotationId) {
    return await db2.query.quotations.findFirst({
      where: eq(quotations.id, quotationId),
      with: {
        customer: true,
        quotationItems: {
          with: {
            product: true
          }
        }
      }
    });
  }
  async getCustomerQuotationsWithItems(customerId) {
    return await db2.query.quotations.findMany({
      where: eq(quotations.customerId, customerId),
      with: {
        quotationItems: {
          with: {
            product: true
          }
        }
      },
      orderBy: [desc(quotations.createdAt)]
    });
  }
  async updateQuotationResponse(id, responseMessage, totalValue, validUntil) {
    const [quotation] = await db2.update(quotations).set({
      responseMessage,
      totalValue,
      validUntil,
      status: "responded",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(quotations.id, id)).returning();
    return quotation || void 0;
  }
  async getCustomer(id) {
    const [customer] = await db2.select().from(customers).where(eq(customers.id, id));
    return customer || void 0;
  }
  async getCustomerByEmail(email) {
    const [customer] = await db2.select().from(customers).where(eq(customers.email, email));
    return customer || void 0;
  }
  async createCustomer(insertCustomer) {
    const hashedPassword = await bcrypt.hash(insertCustomer.password, 10);
    const [customer] = await db2.insert(customers).values({
      ...insertCustomer,
      password: hashedPassword
    }).returning();
    return customer;
  }
  async updateCustomer(id, updates) {
    const updateData = { ...updates };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const [customer] = await db2.update(customers).set({ ...updateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(customers.id, id)).returning();
    return customer || void 0;
  }
  async verifyCustomerPassword(email, password) {
    const customer = await this.getCustomerByEmail(email);
    if (!customer) {
      return null;
    }
    const isValid = await bcrypt.compare(password, customer.password);
    if (!isValid) {
      return null;
    }
    return customer;
  }
};
var MemoryStorage = class {
  categories = [
    { id: 1, name: "Pneum\xE1ticas", description: "Rodas pneum\xE1ticas para empilhadeiras", createdAt: /* @__PURE__ */ new Date() },
    { id: 2, name: "S\xF3lidas", description: "Rodas s\xF3lidas sem ar", createdAt: /* @__PURE__ */ new Date() },
    { id: 3, name: "Poliuretano", description: "Rodas de poliuretano", createdAt: /* @__PURE__ */ new Date() },
    { id: 4, name: "Borracha", description: "Rodas de borracha", createdAt: /* @__PURE__ */ new Date() }
  ];
  brands = [
    { id: 1, name: "Pollyfort", description: "Marca principal da empresa", createdAt: /* @__PURE__ */ new Date() },
    { id: 2, name: "Industrial Plus", description: "Linha industrial premium", createdAt: /* @__PURE__ */ new Date() },
    { id: 3, name: "Premium Wheels", description: "Rodas premium para aplica\xE7\xF5es especiais", createdAt: /* @__PURE__ */ new Date() },
    { id: 4, name: "Durability Pro", description: "Linha profissional de alta durabilidade", createdAt: /* @__PURE__ */ new Date() }
  ];
  products = [
    {
      id: 1,
      name: "Roda Pneum\xE1tica 8.5 x 3.0",
      code: "PN-8530",
      description: "Roda pneum\xE1tica robusta para empilhadeiras el\xE9tricas.",
      category: "Pneum\xE1ticas",
      brand: "Pollyfort",
      diameter: "8.5",
      width: "3.0",
      material: "Borracha Premium",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
      rating: 5,
      reviewCount: 12,
      status: "active",
      featured: true
    },
    {
      id: 2,
      name: "Roda S\xF3lida 10 x 3.5",
      code: "SO-1035",
      description: "Roda s\xF3lida sem ar, ideal para ambientes industriais.",
      category: "S\xF3lidas",
      brand: "Industrial Plus",
      diameter: "10",
      width: "3.5",
      material: "Poliuretano",
      imageUrl: "https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=500",
      rating: 4,
      reviewCount: 8,
      status: "active",
      featured: false
    }
  ];
  quotations = [];
  quotationItems = [];
  customers = [];
  cmsUsers = [
    {
      id: 1,
      username: "admin",
      email: "admin@pollyfort.com",
      password: "$2b$10$rQZ5xKzPvyZFQQGQQQQQQQ",
      // senha: admin123
      displayName: "Administrador",
      role: "admin",
      bio: "Administrador principal do sistema CMS",
      avatar: null,
      isActive: true,
      lastLogin: null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  ];
  cmsPosts = [
    {
      id: 1,
      title: "Bem-vindos ao Pollyfort CMS",
      slug: "bem-vindos-pollyfort-cms",
      content: "<p>Este \xE9 seu primeiro post no sistema CMS da Pollyfort. Voc\xEA pode editar ou excluir este post a qualquer momento.</p><p>O sistema CMS oferece todas as funcionalidades necess\xE1rias para gerenciar conte\xFAdo, incluindo posts, p\xE1ginas, m\xEDdia e muito mais.</p>",
      excerpt: "Primeiro post do sistema CMS da Pollyfort com funcionalidades completas de gerenciamento de conte\xFAdo.",
      type: "post",
      status: "published",
      authorId: 1,
      parentId: null,
      featuredImage: null,
      metaTitle: "Bem-vindos ao Pollyfort CMS",
      metaDescription: "Sistema CMS completo da Pollyfort para gerenciamento de conte\xFAdo",
      metaKeywords: "CMS, Pollyfort, gest\xE3o conte\xFAdo",
      publishedAt: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  ];
  cmsCategories = [
    {
      id: 1,
      name: "Not\xEDcias",
      slug: "noticias",
      description: "Categoria para posts de not\xEDcias e atualiza\xE7\xF5es",
      parentId: null,
      count: 1,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  ];
  cmsTags = [
    {
      id: 1,
      name: "CMS",
      slug: "cms",
      description: "Tag relacionada ao sistema CMS",
      count: 1,
      createdAt: /* @__PURE__ */ new Date()
    }
  ];
  cmsMedia = [];
  cmsComments = [];
  cmsOptions = [
    {
      id: 1,
      name: "site_title",
      value: "Pollyfort CMS",
      autoload: true,
      updatedAt: /* @__PURE__ */ new Date()
    },
    {
      id: 2,
      name: "site_description",
      value: "Sistema de gest\xE3o de conte\xFAdo da Pollyfort",
      autoload: true,
      updatedAt: /* @__PURE__ */ new Date()
    }
  ];
  cmsMenus = [
    {
      id: 1,
      name: "Menu Principal",
      slug: "menu-principal",
      description: "Menu de navega\xE7\xE3o principal do site",
      createdAt: /* @__PURE__ */ new Date()
    }
  ];
  cmsMenuItems = [];
  nextId = 13;
  async getProducts() {
    return this.products.filter((p) => p.status === "active");
  }
  async getProduct(id) {
    return this.products.find((p) => p.id === id);
  }
  async getProductsByCategory(category) {
    return this.products.filter((p) => p.category === category && p.status === "active");
  }
  async searchProducts(query) {
    const lowQuery = query.toLowerCase();
    return this.products.filter(
      (p) => p.status === "active" && (p.name.toLowerCase().includes(lowQuery) || p.description.toLowerCase().includes(lowQuery) || p.category.toLowerCase().includes(lowQuery))
    );
  }
  async createProduct(product) {
    const newProduct = {
      ...product,
      id: this.nextId++,
      rating: 0,
      reviewCount: 0,
      featured: false
    };
    this.products.push(newProduct);
    return newProduct;
  }
  async updateProduct(id, updates) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return void 0;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }
  async deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }
  async getQuotations() {
    return this.quotations;
  }
  async getQuotation(id) {
    return this.quotations.find((q) => q.id === id);
  }
  async createQuotation(quotation, items) {
    const newQuotation = {
      ...quotation,
      id: this.nextId++,
      status: quotation.status || "pending",
      responseMessage: null,
      totalValue: null,
      validUntil: null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.quotations.push(newQuotation);
    if (items) {
      items.forEach((item) => {
        this.quotationItems.push({
          id: this.nextId++,
          quotationId: newQuotation.id,
          productId: item.productId,
          quantity: item.quantity,
          createdAt: /* @__PURE__ */ new Date()
        });
      });
    }
    return newQuotation;
  }
  async updateQuotationStatus(id, status) {
    const quotation = this.quotations.find((q) => q.id === id);
    if (!quotation) return void 0;
    quotation.status = status;
    quotation.updatedAt = /* @__PURE__ */ new Date();
    return quotation;
  }
  async getQuotationsByCustomer(customerId) {
    return this.quotations.filter((q) => q.customerId === customerId);
  }
  async getQuotationWithItems(quotationId) {
    const quotation = this.quotations.find((q) => q.id === quotationId);
    if (!quotation) return null;
    const items = this.quotationItems.filter((item) => item.quotationId === quotationId);
    return { ...quotation, items };
  }
  async getCustomerQuotationsWithItems(customerId) {
    const customerQuotations = this.quotations.filter((q) => q.customerId === customerId);
    return customerQuotations.map((quotation) => {
      const items = this.quotationItems.filter((item) => item.quotationId === quotation.id);
      return { ...quotation, items };
    });
  }
  async updateQuotationResponse(id, responseMessage, totalValue, validUntil) {
    const quotation = this.quotations.find((q) => q.id === id);
    if (!quotation) return void 0;
    quotation.responseMessage = responseMessage;
    if (totalValue) quotation.totalValue = totalValue;
    if (validUntil) quotation.validUntil = validUntil;
    quotation.updatedAt = /* @__PURE__ */ new Date();
    return quotation;
  }
  async getCustomer(id) {
    return this.customers.find((c) => c.id === id);
  }
  async getCustomerByEmail(email) {
    return this.customers.find((c) => c.email === email);
  }
  async createCustomer(customer) {
    const newCustomer = {
      ...customer,
      id: this.nextId++,
      phone: customer.phone || null,
      company: customer.company || null,
      address: customer.address || null,
      isActive: customer.isActive ?? true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }
  async updateCustomer(id, updates) {
    const customer = this.customers.find((c) => c.id === id);
    if (!customer) return void 0;
    Object.assign(customer, updates, { updatedAt: /* @__PURE__ */ new Date() });
    return customer;
  }
  async verifyCustomerPassword(email, password) {
    const customer = await this.getCustomerByEmail(email);
    if (!customer) return null;
    const isValid = await bcrypt.compare(password, customer.password);
    return isValid ? customer : null;
  }
  // Categories Implementation
  async getCategories() {
    return this.categories;
  }
  async getCategory(id) {
    return this.categories.find((c) => c.id === id);
  }
  async createCategory(category) {
    const newCategory = {
      ...category,
      id: this.nextId++,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.categories.push(newCategory);
    return newCategory;
  }
  async updateCategory(id, updates) {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return void 0;
    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }
  async deleteCategory(id) {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.categories.splice(index, 1);
    return true;
  }
  // Brands Implementation
  async getBrands() {
    return this.brands;
  }
  async getBrand(id) {
    return this.brands.find((b) => b.id === id);
  }
  async createBrand(brand) {
    const newBrand = {
      ...brand,
      id: this.nextId++,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.brands.push(newBrand);
    return newBrand;
  }
  async updateBrand(id, updates) {
    const index = this.brands.findIndex((b) => b.id === id);
    if (index === -1) return void 0;
    this.brands[index] = { ...this.brands[index], ...updates };
    return this.brands[index];
  }
  async deleteBrand(id) {
    const index = this.brands.findIndex((b) => b.id === id);
    if (index === -1) return false;
    this.brands.splice(index, 1);
    return true;
  }
  // CMS Users Implementation
  async getCmsUsers() {
    return this.cmsUsers.filter((u) => u.isActive);
  }
  async getCmsUser(id) {
    return this.cmsUsers.find((u) => u.id === id);
  }
  async getCmsUserByEmail(email) {
    return this.cmsUsers.find((u) => u.email === email);
  }
  async getCmsUserByUsername(username) {
    return this.cmsUsers.find((u) => u.username === username);
  }
  async createCmsUser(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      ...user,
      id: this.nextId++,
      password: hashedPassword,
      isActive: user.isActive ?? true,
      lastLogin: null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.cmsUsers.push(newUser);
    return newUser;
  }
  async updateCmsUser(id, updates) {
    const user = this.cmsUsers.find((u) => u.id === id);
    if (!user) return void 0;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    Object.assign(user, updates, { updatedAt: /* @__PURE__ */ new Date() });
    return user;
  }
  async deleteCmsUser(id) {
    const index = this.cmsUsers.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.cmsUsers.splice(index, 1);
    return true;
  }
  async verifyCmsUserPassword(username, password) {
    const user = await this.getCmsUserByUsername(username);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
  // CMS Posts Implementation
  async getCmsPosts(filters) {
    let posts = this.cmsPosts;
    if (filters?.type) {
      posts = posts.filter((p) => p.type === filters.type);
    }
    if (filters?.status) {
      posts = posts.filter((p) => p.status === filters.status);
    }
    if (filters?.authorId) {
      posts = posts.filter((p) => p.authorId === filters.authorId);
    }
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getCmsPost(id) {
    return this.cmsPosts.find((p) => p.id === id);
  }
  async getCmsPostBySlug(slug) {
    return this.cmsPosts.find((p) => p.slug === slug);
  }
  async createCmsPost(post) {
    const newPost = {
      ...post,
      id: this.nextId++,
      status: post.status || "draft",
      publishedAt: post.status === "published" ? /* @__PURE__ */ new Date() : null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.cmsPosts.push(newPost);
    return newPost;
  }
  async updateCmsPost(id, updates) {
    const post = this.cmsPosts.find((p) => p.id === id);
    if (!post) return void 0;
    if (updates.status === "published" && post.status !== "published") {
      updates.publishedAt = /* @__PURE__ */ new Date();
    }
    Object.assign(post, updates, { updatedAt: /* @__PURE__ */ new Date() });
    return post;
  }
  async deleteCmsPost(id) {
    const index = this.cmsPosts.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.cmsPosts.splice(index, 1);
    return true;
  }
  async publishCmsPost(id) {
    return this.updateCmsPost(id, { status: "published", publishedAt: /* @__PURE__ */ new Date() });
  }
  // CMS Categories Implementation
  async getCmsCategories() {
    return this.cmsCategories;
  }
  async getCmsCategory(id) {
    return this.cmsCategories.find((c) => c.id === id);
  }
  async getCmsCategoryBySlug(slug) {
    return this.cmsCategories.find((c) => c.slug === slug);
  }
  async createCmsCategory(category) {
    const newCategory = {
      ...category,
      id: this.nextId++,
      count: 0,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.cmsCategories.push(newCategory);
    return newCategory;
  }
  async updateCmsCategory(id, updates) {
    const category = this.cmsCategories.find((c) => c.id === id);
    if (!category) return void 0;
    Object.assign(category, updates, { updatedAt: /* @__PURE__ */ new Date() });
    return category;
  }
  async deleteCmsCategory(id) {
    const index = this.cmsCategories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.cmsCategories.splice(index, 1);
    return true;
  }
  // CMS Tags Implementation
  async getCmsTags() {
    return this.cmsTags;
  }
  async getCmsTag(id) {
    return this.cmsTags.find((t) => t.id === id);
  }
  async getCmsTagBySlug(slug) {
    return this.cmsTags.find((t) => t.slug === slug);
  }
  async createCmsTag(tag) {
    const newTag = {
      ...tag,
      id: this.nextId++,
      count: 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.cmsTags.push(newTag);
    return newTag;
  }
  async updateCmsTag(id, updates) {
    const tag = this.cmsTags.find((t) => t.id === id);
    if (!tag) return void 0;
    Object.assign(tag, updates);
    return tag;
  }
  async deleteCmsTag(id) {
    const index = this.cmsTags.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.cmsTags.splice(index, 1);
    return true;
  }
  // CMS Media Implementation
  async getCmsMedia() {
    return this.cmsMedia.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getCmsMediaItem(id) {
    return this.cmsMedia.find((m) => m.id === id);
  }
  async createCmsMedia(media) {
    const newMedia = {
      ...media,
      id: this.nextId++,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.cmsMedia.push(newMedia);
    return newMedia;
  }
  async updateCmsMedia(id, updates) {
    const media = this.cmsMedia.find((m) => m.id === id);
    if (!media) return void 0;
    Object.assign(media, updates);
    return media;
  }
  async deleteCmsMedia(id) {
    const index = this.cmsMedia.findIndex((m) => m.id === id);
    if (index === -1) return false;
    this.cmsMedia.splice(index, 1);
    return true;
  }
  // CMS Comments Implementation
  async getCmsComments(postId) {
    let comments = this.cmsComments;
    if (postId) {
      comments = comments.filter((c) => c.postId === postId);
    }
    return comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getCmsComment(id) {
    return this.cmsComments.find((c) => c.id === id);
  }
  async createCmsComment(comment) {
    const newComment = {
      ...comment,
      id: this.nextId++,
      status: comment.status || "pending",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.cmsComments.push(newComment);
    return newComment;
  }
  async updateCmsComment(id, updates) {
    const comment = this.cmsComments.find((c) => c.id === id);
    if (!comment) return void 0;
    Object.assign(comment, updates, { updatedAt: /* @__PURE__ */ new Date() });
    return comment;
  }
  async deleteCmsComment(id) {
    const index = this.cmsComments.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.cmsComments.splice(index, 1);
    return true;
  }
  async moderateCmsComment(id, status) {
    return this.updateCmsComment(id, { status });
  }
  // CMS Options Implementation
  async getCmsOption(name) {
    return this.cmsOptions.find((o) => o.name === name);
  }
  async setCmsOption(name, value) {
    const existing = this.cmsOptions.find((o) => o.name === name);
    if (existing) {
      existing.value = value;
      existing.updatedAt = /* @__PURE__ */ new Date();
      return existing;
    }
    const newOption = {
      id: this.nextId++,
      name,
      value,
      autoload: true,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.cmsOptions.push(newOption);
    return newOption;
  }
  async getCmsOptions() {
    return this.cmsOptions.filter((o) => o.autoload);
  }
  // CMS Menus Implementation
  async getCmsMenus() {
    return this.cmsMenus;
  }
  async getCmsMenu(id) {
    return this.cmsMenus.find((m) => m.id === id);
  }
  async getCmsMenuBySlug(slug) {
    return this.cmsMenus.find((m) => m.slug === slug);
  }
  async createCmsMenu(menu) {
    const newMenu = {
      ...menu,
      id: this.nextId++,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.cmsMenus.push(newMenu);
    return newMenu;
  }
  async updateCmsMenu(id, updates) {
    const menu = this.cmsMenus.find((m) => m.id === id);
    if (!menu) return void 0;
    Object.assign(menu, updates);
    return menu;
  }
  async deleteCmsMenu(id) {
    const index = this.cmsMenus.findIndex((m) => m.id === id);
    if (index === -1) return false;
    this.cmsMenus.splice(index, 1);
    this.cmsMenuItems = this.cmsMenuItems.filter((item) => item.menuId !== id);
    return true;
  }
  // CMS Menu Items Implementation
  async getCmsMenuItems(menuId) {
    return this.cmsMenuItems.filter((item) => item.menuId === menuId).sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  async createCmsMenuItem(item) {
    const newItem = {
      ...item,
      id: this.nextId++,
      order: item.order || 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.cmsMenuItems.push(newItem);
    return newItem;
  }
  async updateCmsMenuItem(id, updates) {
    const item = this.cmsMenuItems.find((i) => i.id === id);
    if (!item) return void 0;
    Object.assign(item, updates);
    return item;
  }
  async deleteCmsMenuItem(id) {
    const index = this.cmsMenuItems.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.cmsMenuItems.splice(index, 1);
    return true;
  }
  // CMS Settings Implementation
  async getCmsSettings() {
    const settings = {};
    for (const option of this.cmsOptions) {
      settings[option.name] = option.value;
    }
    if (Object.keys(settings).length === 0) {
      return {
        site_title: "Pollyfort CMS",
        site_description: "Sistema de gerenciamento de conte\xFAdo",
        site_url: "https://pollyfortrodas.com.br",
        admin_email: "admin@pollyfortrodas.com.br",
        posts_per_page: "10",
        default_post_status: "draft",
        allow_comments: "1",
        moderate_comments: "1"
      };
    }
    return settings;
  }
  async updateCmsSettings(settings) {
    for (const [name, value] of Object.entries(settings)) {
      await this.setCmsOption(name, String(value));
    }
    return await this.getCmsSettings();
  }
  // Maintenance Mode Implementation
  maintenanceConfig = {
    enabled: false,
    title: "Site em Manuten\xE7\xE3o",
    message: "Estamos realizando melhorias em nosso sistema. Voltaremos em breve!",
    estimatedTime: "",
    showContacts: true
  };
  async getMaintenanceMode() {
    return { ...this.maintenanceConfig };
  }
  async setMaintenanceMode(config) {
    this.maintenanceConfig = { ...this.maintenanceConfig, ...config };
    console.log(`[Storage] Maintenance mode updated:`, this.maintenanceConfig);
  }
  // Company Settings Implementation
  companySettingsData = {
    id: 1,
    name: "Pollyfort",
    address: "R ANTONIO DO VALLE MELO N\xBA88 - Centro",
    city: "Sumar\xE9",
    state: "SP",
    zipCode: "13.170-010",
    phone: "(19) 9 8228-5152 / (19) 9 9419-4339",
    email: "vendas@pollyfortrodas.com.br",
    whatsapp: "5519999128023",
    website: "https://pollyfortrodas.com.br",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  };
  async getCompanySettings() {
    return { ...this.companySettingsData };
  }
  async updateCompanySettings(settings) {
    this.companySettingsData = {
      ...this.companySettingsData,
      ...settings,
      updatedAt: /* @__PURE__ */ new Date()
    };
    console.log(`[Storage] Company settings updated:`, this.companySettingsData);
    return { ...this.companySettingsData };
  }
};
var HybridStorage = class {
  dbStorage = new DatabaseStorage();
  memStorage = new MemoryStorage();
  // Products - Use database for persistence with fallback
  async getProducts() {
    try {
      return await this.dbStorage.getProducts();
    } catch (error) {
      console.warn("Database unavailable, using memory storage for products");
      return this.memStorage.getProducts();
    }
  }
  async getProduct(id) {
    try {
      return await this.dbStorage.getProduct(id);
    } catch (error) {
      return this.memStorage.getProduct(id);
    }
  }
  async getProductsByCategory(category) {
    try {
      return await this.dbStorage.getProductsByCategory(category);
    } catch (error) {
      return this.memStorage.getProductsByCategory(category);
    }
  }
  async searchProducts(query) {
    try {
      return await this.dbStorage.searchProducts(query);
    } catch (error) {
      return this.memStorage.searchProducts(query);
    }
  }
  async createProduct(product) {
    try {
      return await this.dbStorage.createProduct(product);
    } catch (error) {
      return this.memStorage.createProduct(product);
    }
  }
  async updateProduct(id, product) {
    try {
      return await this.dbStorage.updateProduct(id, product);
    } catch (error) {
      return this.memStorage.updateProduct(id, product);
    }
  }
  async deleteProduct(id) {
    try {
      return await this.dbStorage.deleteProduct(id);
    } catch (error) {
      return this.memStorage.deleteProduct(id);
    }
  }
  // Quotations - Use database for persistence with fallback
  async getQuotations() {
    try {
      return await this.dbStorage.getQuotations();
    } catch (error) {
      return this.memStorage.getQuotations();
    }
  }
  async getQuotation(id) {
    try {
      return await this.dbStorage.getQuotation(id);
    } catch (error) {
      return this.memStorage.getQuotation(id);
    }
  }
  async createQuotation(quotation, items) {
    try {
      return await this.dbStorage.createQuotation(quotation, items);
    } catch (error) {
      return this.memStorage.createQuotation(quotation, items);
    }
  }
  async updateQuotationStatus(id, status) {
    try {
      return await this.dbStorage.updateQuotationStatus(id, status);
    } catch (error) {
      return this.memStorage.updateQuotationStatus(id, status);
    }
  }
  async getQuotationsByCustomer(customerId) {
    try {
      return await this.dbStorage.getQuotationsByCustomer(customerId);
    } catch (error) {
      return this.memStorage.getQuotationsByCustomer(customerId);
    }
  }
  async getQuotationWithItems(quotationId) {
    try {
      return await this.dbStorage.getQuotationWithItems(quotationId);
    } catch (error) {
      return this.memStorage.getQuotationWithItems(quotationId);
    }
  }
  async getCustomerQuotationsWithItems(customerId) {
    try {
      return await this.dbStorage.getCustomerQuotationsWithItems(customerId);
    } catch (error) {
      return this.memStorage.getCustomerQuotationsWithItems(customerId);
    }
  }
  async updateQuotationResponse(id, responseMessage, totalValue, validUntil) {
    try {
      return await this.dbStorage.updateQuotationResponse(id, responseMessage, totalValue, validUntil);
    } catch (error) {
      return this.memStorage.updateQuotationResponse(id, responseMessage, totalValue, validUntil);
    }
  }
  // Customers - Use database for persistence with fallback
  async getCustomer(id) {
    try {
      return await this.dbStorage.getCustomer(id);
    } catch (error) {
      return this.memStorage.getCustomer(id);
    }
  }
  async getCustomerByEmail(email) {
    try {
      return await this.dbStorage.getCustomerByEmail(email);
    } catch (error) {
      return this.memStorage.getCustomerByEmail(email);
    }
  }
  async createCustomer(customer) {
    try {
      return await this.dbStorage.createCustomer(customer);
    } catch (error) {
      return this.memStorage.createCustomer(customer);
    }
  }
  async updateCustomer(id, customer) {
    try {
      return await this.dbStorage.updateCustomer(id, customer);
    } catch (error) {
      return this.memStorage.updateCustomer(id, customer);
    }
  }
  async verifyCustomerPassword(email, password) {
    try {
      return await this.dbStorage.verifyCustomerPassword(email, password);
    } catch (error) {
      return this.memStorage.verifyCustomerPassword(email, password);
    }
  }
  // CMS features - Use memory storage for now
  async getCmsUsers() {
    return this.memStorage.getCmsUsers();
  }
  async getCmsUser(id) {
    return this.memStorage.getCmsUser(id);
  }
  async getCmsUserByEmail(email) {
    return this.memStorage.getCmsUserByEmail(email);
  }
  async getCmsUserByUsername(username) {
    return this.memStorage.getCmsUserByUsername(username);
  }
  async createCmsUser(user) {
    return this.memStorage.createCmsUser(user);
  }
  async updateCmsUser(id, user) {
    return this.memStorage.updateCmsUser(id, user);
  }
  async deleteCmsUser(id) {
    return this.memStorage.deleteCmsUser(id);
  }
  async verifyCmsUserPassword(username, password) {
    return this.memStorage.verifyCmsUserPassword(username, password);
  }
  async getCmsPosts(filters) {
    return this.memStorage.getCmsPosts(filters);
  }
  async getCmsPost(id) {
    return this.memStorage.getCmsPost(id);
  }
  async getCmsPostBySlug(slug) {
    return this.memStorage.getCmsPostBySlug(slug);
  }
  async createCmsPost(post) {
    return this.memStorage.createCmsPost(post);
  }
  async updateCmsPost(id, post) {
    return this.memStorage.updateCmsPost(id, post);
  }
  async deleteCmsPost(id) {
    return this.memStorage.deleteCmsPost(id);
  }
  async publishCmsPost(id) {
    return this.memStorage.publishCmsPost(id);
  }
  async getCmsCategories() {
    return this.memStorage.getCmsCategories();
  }
  async getCmsCategory(id) {
    return this.memStorage.getCmsCategory(id);
  }
  async getCmsCategoryBySlug(slug) {
    return this.memStorage.getCmsCategoryBySlug(slug);
  }
  async createCmsCategory(category) {
    return this.memStorage.createCmsCategory(category);
  }
  async updateCmsCategory(id, category) {
    return this.memStorage.updateCmsCategory(id, category);
  }
  async deleteCmsCategory(id) {
    return this.memStorage.deleteCmsCategory(id);
  }
  async getCmsTags() {
    return this.memStorage.getCmsTags();
  }
  async getCmsTag(id) {
    return this.memStorage.getCmsTag(id);
  }
  async getCmsTagBySlug(slug) {
    return this.memStorage.getCmsTagBySlug(slug);
  }
  async createCmsTag(tag) {
    return this.memStorage.createCmsTag(tag);
  }
  async updateCmsTag(id, tag) {
    return this.memStorage.updateCmsTag(id, tag);
  }
  async deleteCmsTag(id) {
    return this.memStorage.deleteCmsTag(id);
  }
  async getCmsMedia() {
    return this.memStorage.getCmsMedia();
  }
  async getCmsMediaItem(id) {
    return this.memStorage.getCmsMediaItem(id);
  }
  async createCmsMedia(media) {
    return this.memStorage.createCmsMedia(media);
  }
  async updateCmsMedia(id, media) {
    return this.memStorage.updateCmsMedia(id, media);
  }
  async deleteCmsMedia(id) {
    return this.memStorage.deleteCmsMedia(id);
  }
  async getCmsComments(postId) {
    return this.memStorage.getCmsComments(postId);
  }
  async getCmsComment(id) {
    return this.memStorage.getCmsComment(id);
  }
  async createCmsComment(comment) {
    return this.memStorage.createCmsComment(comment);
  }
  async updateCmsComment(id, comment) {
    return this.memStorage.updateCmsComment(id, comment);
  }
  async deleteCmsComment(id) {
    return this.memStorage.deleteCmsComment(id);
  }
  async moderateCmsComment(id, status) {
    return this.memStorage.moderateCmsComment(id, status);
  }
  async getCmsOption(name) {
    return this.memStorage.getCmsOption(name);
  }
  async setCmsOption(name, value) {
    return this.memStorage.setCmsOption(name, value);
  }
  async getCmsOptions() {
    return this.memStorage.getCmsOptions();
  }
  async getCmsMenus() {
    return this.memStorage.getCmsMenus();
  }
  async getCmsMenu(id) {
    return this.memStorage.getCmsMenu(id);
  }
  async getCmsMenuBySlug(slug) {
    return this.memStorage.getCmsMenuBySlug(slug);
  }
  async createCmsMenu(menu) {
    return this.memStorage.createCmsMenu(menu);
  }
  async updateCmsMenu(id, menu) {
    return this.memStorage.updateCmsMenu(id, menu);
  }
  async deleteCmsMenu(id) {
    return this.memStorage.deleteCmsMenu(id);
  }
  async getCmsMenuItems(menuId) {
    return this.memStorage.getCmsMenuItems(menuId);
  }
  async createCmsMenuItem(item) {
    return this.memStorage.createCmsMenuItem(item);
  }
  async updateCmsMenuItem(id, item) {
    return this.memStorage.updateCmsMenuItem(id, item);
  }
  async deleteCmsMenuItem(id) {
    return this.memStorage.deleteCmsMenuItem(id);
  }
  async getCmsSettings() {
    return this.memStorage.getCmsSettings();
  }
  async updateCmsSettings(settings) {
    return this.memStorage.updateCmsSettings(settings);
  }
  // Maintenance Mode - Use memory storage for immediate consistency
  async getMaintenanceMode() {
    return this.memStorage.getMaintenanceMode();
  }
  async setMaintenanceMode(config) {
    console.log(`[HybridStorage] Setting maintenance mode:`, config);
    return this.memStorage.setMaintenanceMode(config);
  }
  // Company Settings - Use memory storage for immediate consistency
  async getCompanySettings() {
    return this.memStorage.getCompanySettings();
  }
  async updateCompanySettings(settings) {
    return this.memStorage.updateCompanySettings(settings);
  }
};
var storage2 = new HybridStorage();

// server/routes.ts
init_schema();

// server/auth.ts
import session from "express-session";
function setupSession(app2) {
  app2.use(session({
    secret: process.env.SESSION_SECRET || "pollyfort-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1e3
      // 24 hours
    }
  }));
}
async function authenticateCustomer(req, res, next) {
  if (req.session.customerId) {
    try {
      const customer = await storage2.getCustomer(req.session.customerId);
      if (customer) {
        req.session.customer = customer;
        return next();
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }
  return res.status(401).json({ message: "Authentication required" });
}
function optionalAuth(req, res, next) {
  if (req.session.customerId) {
    storage2.getCustomer(req.session.customerId).then((customer) => {
      if (customer) {
        req.session.customer = customer;
      }
      next();
    }).catch(() => next());
  } else {
    next();
  }
}

// server/upload.ts
import multer2 from "multer";
import path2 from "path";
import fs2 from "fs-extra";
var storage3 = multer2.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir2 = path2.join(process.cwd(), "uploads", "products");
    await fs2.ensureDir(uploadDir2);
    cb(null, uploadDir2);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path2.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});
var fileFilter2 = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Apenas arquivos de imagem s\xE3o permitidos!"), false);
  }
};
var uploadProductImages = multer2({
  storage: storage3,
  fileFilter: fileFilter2,
  limits: {
    fileSize: 5 * 1024 * 1024,
    // 5MB por arquivo
    files: 10
    // Máximo 10 arquivos por upload
  }
});
var getImageUrl = (filename) => {
  return `/uploads/products/${filename}`;
};

// server/routes.ts
import { z as z2 } from "zod";

// server/imported-products.ts
import fs3 from "fs";
import path3 from "path";
var cache = null;
function loadImportedCatalog() {
  if (cache) return cache;
  const filePath = path3.join(process.cwd(), "data", "imported-products.json");
  const raw = fs3.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  cache = JSON.parse(raw);
  return cache;
}
function getImportedProducts(filters = {}) {
  const { products: products2 } = loadImportedCatalog();
  const search = filters.search?.trim().toLowerCase();
  const category = filters.category?.trim().toLowerCase();
  return products2.filter((product) => {
    if (filters.brandId && product.brandId !== filters.brandId) return false;
    if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
    if (category && category !== "all" && !product.categoryName?.toLowerCase().includes(category)) return false;
    if (search) {
      const haystack = [product.name, product.description, product.code, product.brandName, product.categoryName].filter(Boolean).join(" ").toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}
function getImportedBrands() {
  return loadImportedCatalog().brands;
}
function getImportedCategories() {
  return loadImportedCatalog().categories;
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/uploads/products/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path4.join(process.cwd(), "uploads", "products", filename);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Last-Modified", (/* @__PURE__ */ new Date()).toUTCString());
    res.setHeader("ETag", `"${Date.now()}"`);
    if (fs4.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  });
  app2.use("/uploads", express.static(path4.join(process.cwd(), "uploads")));
  setupSession(app2);
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      const existingCustomer = await storage2.getCustomerByEmail(userData.email);
      if (existingCustomer) {
        return res.status(400).json({ message: "E-mail j\xE1 est\xE1 em uso" });
      }
      const customer = await storage2.createCustomer(userData);
      req.session.customerId = customer.id;
      req.session.customer = customer;
      const { password, ...customerData } = customer;
      res.json(customerData);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message || "Erro ao criar conta" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const customer = await storage2.verifyCustomerPassword(email, password);
      if (!customer) {
        return res.status(401).json({ message: "E-mail ou senha inv\xE1lidos" });
      }
      req.session.customerId = customer.id;
      req.session.customer = customer;
      const { password: _, ...customerData } = customer;
      res.json(customerData);
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "Erro ao fazer login" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });
  app2.get("/api/auth/me", authenticateCustomer, (req, res) => {
    const { password, ...customerData } = req.session.customer;
    res.json(customerData);
  });
  app2.get("/api/products", async (req, res) => {
    const { search, category, brand_id, category_id } = req.query;
    const importedFallback = () => getImportedProducts({
      search: typeof search === "string" ? search : void 0,
      category: typeof category === "string" ? category : void 0,
      brandId: typeof brand_id === "string" ? parseInt(brand_id) || void 0 : void 0,
      categoryId: typeof category_id === "string" ? parseInt(category_id) || void 0 : void 0
    });
    try {
      console.log("Products query params:", { search, category, brand_id, category_id });
      if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
        const fallbackProducts = importedFallback();
        console.log(`[products] Retornados ${fallbackProducts.length} produtos importados do CSV`);
        return res.json(fallbackProducts);
      }
      const { db: db3 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { products: products2, categories: categories3, brands: brands3 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eq4, and: and3, ilike: ilike2 } = await import("drizzle-orm");
      let query = db3.select({
        id: products2.id,
        name: products2.name,
        code: products2.code,
        description: products2.description,
        brandId: products2.brandId,
        categoryId: products2.categoryId,
        diameter: products2.diameter,
        width: products2.width,
        material: products2.material,
        imageUrl: products2.imageUrl,
        rating: products2.rating,
        reviewCount: products2.reviewCount,
        status: products2.status,
        featured: products2.featured,
        categoryName: categories3.name,
        brandName: brands3.name
      }).from(products2).leftJoin(categories3, eq4(products2.categoryId, categories3.id)).leftJoin(brands3, eq4(products2.brandId, brands3.id));
      const conditions = [];
      if (brand_id && typeof brand_id === "string" && brand_id !== "") {
        const brandIdNum = parseInt(brand_id);
        if (!isNaN(brandIdNum)) {
          conditions.push(eq4(products2.brandId, brandIdNum));
        }
      }
      if (category_id && typeof category_id === "string" && category_id !== "") {
        const categoryIdNum = parseInt(category_id);
        if (!isNaN(categoryIdNum)) {
          conditions.push(eq4(products2.categoryId, categoryIdNum));
        }
      }
      if (search && typeof search === "string" && search.trim() !== "") {
        conditions.push(ilike2(products2.name, `%${search.trim()}%`));
      }
      if (category && typeof category === "string" && category !== "" && category !== "all") {
        conditions.push(ilike2(categories3.name, `%${category}%`));
      }
      if (conditions.length > 0) {
        query = query.where(and3(...conditions));
      }
      const filteredProducts = await query;
      console.log(`[products] Retornados ${filteredProducts.length} produtos (PostgreSQL)`);
      res.json(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      const fallbackProducts = importedFallback();
      console.log(`[products] Retornados ${fallbackProducts.length} produtos importados do CSV`);
      res.json(fallbackProducts);
    }
  });
  app2.get("/api/products/search-suggestions", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.json([]);
      }
      const products2 = await storage2.searchProducts(q);
      const suggestions = products2.slice(0, 5).map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category
      }));
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  });
  app2.post("/api/products", uploadProductImages.single("image"), async (req, res) => {
    try {
      let productData;
      if (req.body.name && typeof req.body.name === "string") {
        productData = {
          name: req.body.name,
          code: req.body.code,
          description: req.body.description,
          categoryId: req.body.categoryId && req.body.categoryId !== "" && req.body.categoryId !== "undefined" && !isNaN(parseInt(req.body.categoryId)) ? parseInt(req.body.categoryId) : null,
          brandId: req.body.brandId && req.body.brandId !== "" && req.body.brandId !== "undefined" && !isNaN(parseInt(req.body.brandId)) ? parseInt(req.body.brandId) : null,
          diameter: req.body.diameter,
          width: req.body.width,
          material: req.body.material,
          hardness: req.body.hardness || null,
          maxLoad: req.body.maxLoad || null,
          application: req.body.application || null,
          price: req.body.price || null,
          featured: req.body.featured === "true" || req.body.featured === true,
          status: req.body.status || "active"
        };
        if (req.file) {
          const timestamp2 = Date.now();
          productData.imageUrl = getImageUrl(req.file.filename) + `?v=${timestamp2}&force=1`;
        }
      } else {
        productData = req.body;
      }
      const validatedData = insertProductSchema.parse(productData);
      const product = await storage2.createProduct(validatedData);
      console.log("Produto criado:", product);
      res.status(201).json(product);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  app2.put("/api/products/:id", uploadProductImages.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let updateData;
      if (req.body.name && typeof req.body.name === "string") {
        updateData = {
          name: req.body.name,
          code: req.body.code,
          description: req.body.description,
          categoryId: req.body.categoryId && req.body.categoryId !== "" && req.body.categoryId !== "undefined" && !isNaN(parseInt(req.body.categoryId)) ? parseInt(req.body.categoryId) : null,
          brandId: req.body.brandId && req.body.brandId !== "" && req.body.brandId !== "undefined" && !isNaN(parseInt(req.body.brandId)) ? parseInt(req.body.brandId) : null,
          diameter: req.body.diameter,
          width: req.body.width,
          material: req.body.material,
          hardness: req.body.hardness || null,
          maxLoad: req.body.maxLoad || null,
          application: req.body.application || null,
          price: req.body.price || null,
          featured: req.body.featured === "true" || req.body.featured === true,
          status: req.body.status || "active"
        };
        if (req.file) {
          const timestamp2 = Date.now();
          updateData.imageUrl = getImageUrl(req.file.filename) + `?v=${timestamp2}&force=1`;
        }
      } else {
        updateData = req.body;
      }
      const updates = insertProductSchema.partial().parse(updateData);
      const product = await storage2.updateProduct(id, updates);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      console.log(`Produto ${id} atualizado:`, updates);
      res.json(product);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  app2.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log(`Tentando deletar produto ID: ${id}`);
      const success = await storage2.deleteProduct(id);
      console.log(`Resultado da exclus\xE3o do produto ${id}:`, success);
      if (!success) {
        console.log(`Produto ${id} n\xE3o encontrado para exclus\xE3o`);
        return res.status(404).json({ message: "Product not found" });
      }
      console.log(`Produto ${id} deletado com sucesso`);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.post("/api/products/upload-images", uploadProductImages.array("images", 10), async (req, res) => {
    try {
      const productId = parseInt(req.body.productId);
      const files = req.files;
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No images uploaded" });
      }
      const uploadedImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageData = {
          id: Date.now() + i,
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: file.path,
          url: getImageUrl(file.filename),
          productId,
          isPrimary: i === 0
          // First image is primary
        };
        uploadedImages.push(imageData);
        if (i === 0) {
          const product = await storage2.getProduct(productId);
          if (product) {
            await storage2.updateProduct(productId, {
              ...product,
              imageUrl: imageData.url
            });
          }
        }
      }
      console.log(`Uploaded ${uploadedImages.length} images for product ${productId}`);
      res.json(uploadedImages);
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Failed to upload images" });
    }
  });
  app2.delete("/api/products/images/:imageId", async (req, res) => {
    try {
      const imageId = parseInt(req.params.imageId);
      console.log(`Deleted image ${imageId}`);
      res.json({ success: true });
    } catch (error) {
      console.error("Image deletion error:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  });
  app2.patch("/api/products/images/:imageId/primary", async (req, res) => {
    try {
      const imageId = parseInt(req.params.imageId);
      console.log(`Set image ${imageId} as primary`);
      res.json({ success: true });
    } catch (error) {
      console.error("Set primary image error:", error);
      res.status(500).json({ error: "Failed to set primary image" });
    }
  });
  app2.get("/api/product-categories", async (req, res) => {
    try {
      const categories3 = await storage2.getCategories();
      res.json(categories3);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.post("/api/product-categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage2.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  app2.put("/api/product-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage2.updateCategory(id, categoryData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });
  app2.delete("/api/product-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage2.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });
  app2.get("/api/product-brands", async (req, res) => {
    try {
      const brands3 = await storage2.getBrands();
      res.json(brands3);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });
  app2.post("/api/product-brands", async (req, res) => {
    try {
      const brandData = insertBrandSchema.parse(req.body);
      const brand = await storage2.createBrand(brandData);
      res.status(201).json(brand);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid brand data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create brand" });
    }
  });
  app2.put("/api/product-brands/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const brandData = insertBrandSchema.partial().parse(req.body);
      const brand = await storage2.updateBrand(id, brandData);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid brand data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update brand" });
    }
  });
  app2.delete("/api/product-brands/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage2.deleteBrand(id);
      if (!success) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json({ message: "Brand deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });
  app2.get("/api/quotations", optionalAuth, async (req, res) => {
    try {
      if (req.session.customerId) {
        const quotations2 = await storage2.getQuotationsByCustomer(req.session.customerId);
        res.json(quotations2);
      } else {
        const quotations2 = await storage2.getQuotations();
        res.json(quotations2);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotations" });
    }
  });
  app2.post("/api/quotations", optionalAuth, async (req, res) => {
    try {
      const quotationData = insertQuotationSchema.parse(req.body);
      const items = req.body.items || [];
      if (req.session.customerId) {
        quotationData.customerId = req.session.customerId;
      }
      const quotation = await storage2.createQuotation(quotationData, items);
      res.status(201).json(quotation);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid quotation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quotation" });
    }
  });
  app2.post("/api/quotations/bulk", async (req, res) => {
    try {
      const { customerName, customerEmail, customerPhone, companyName, message, items } = req.body;
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Items are required for bulk quotation" });
      }
      const quotationData = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        company: companyName || "",
        products: message || `Cota\xE7\xE3o em lote para ${items.length} produtos`,
        status: "pending"
      };
      const quotation = await storage2.createQuotation(quotationData, items);
      res.status(201).json(quotation);
    } catch (error) {
      console.error("Bulk quotation error:", error);
      res.status(500).json({ message: "Failed to create bulk quotation" });
    }
  });
  app2.get("/api/quotations/my", authenticateCustomer, async (req, res) => {
    try {
      const quotations2 = await storage2.getCustomerQuotationsWithItems(req.session.customerId);
      res.json(quotations2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer quotations" });
    }
  });
  app2.get("/api/quotations/:id/details", authenticateCustomer, async (req, res) => {
    try {
      const quotationId = parseInt(req.params.id);
      const quotation = await storage2.getQuotationWithItems(quotationId);
      if (!quotation) {
        return res.status(404).json({ message: "Cota\xE7\xE3o n\xE3o encontrada" });
      }
      if (quotation.customerId !== req.session.customerId) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      res.json(quotation);
    } catch (error) {
      console.error("Error fetching quotation details:", error);
      res.status(500).json({ message: "Erro ao buscar detalhes da cota\xE7\xE3o" });
    }
  });
  app2.put("/api/quotations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status is required" });
      }
      const quotation = await storage2.updateQuotationStatus(id, status);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      res.json(quotation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update quotation status" });
    }
  });
  app2.get("/api/cms/posts", async (req, res) => {
    try {
      const { status, type } = req.query;
      const posts = await storage2.getCmsPosts();
      let filteredPosts = posts;
      if (status && status !== "all") {
        filteredPosts = filteredPosts.filter((post) => post.status === status);
      }
      if (type && type !== "all") {
        filteredPosts = filteredPosts.filter((post) => post.type === type);
      }
      res.json(filteredPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });
  app2.post("/api/cms/posts", async (req, res) => {
    try {
      const postData = req.body;
      const post = await storage2.createCmsPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to create post" });
    }
  });
  app2.put("/api/cms/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const postData = req.body;
      const post = await storage2.updateCmsPost(id, postData);
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to update post" });
    }
  });
  app2.delete("/api/cms/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage2.deleteCmsPost(id);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });
  app2.post("/api/cms/posts/:id/publish", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage2.updateCmsPost(id, {
        status: "published",
        publishedAt: /* @__PURE__ */ new Date()
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to publish post" });
    }
  });
  app2.get("/api/cms/pages", async (req, res) => {
    try {
      const pages = await storage2.getCmsPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });
  app2.get("/api/cms/pages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const page = await storage2.getCmsPage(id);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });
  app2.post("/api/cms/pages", async (req, res) => {
    try {
      const pageData = {
        ...req.body,
        id: Date.now(),
        // Temporary ID for memory storage
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      res.status(201).json(pageData);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });
  app2.put("/api/cms/pages", async (req, res) => {
    try {
      const pageData = {
        ...req.body,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (!pageData.id) {
        pageData.id = Date.now();
        pageData.createdAt = (/* @__PURE__ */ new Date()).toISOString();
        return res.status(201).json(pageData);
      }
      res.json(pageData);
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });
  app2.delete("/api/cms/pages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      res.json({ message: "Page deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete page" });
    }
  });
  app2.get("/api/maintenance", async (req, res) => {
    try {
      const maintenanceConfig = await storage2.getMaintenanceMode();
      res.json(maintenanceConfig || { enabled: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to get maintenance status" });
    }
  });
  app2.post("/api/maintenance", async (req, res) => {
    try {
      const config = req.body;
      await storage2.setMaintenanceMode(config);
      res.json({ message: "Maintenance mode updated successfully", config });
    } catch (error) {
      res.status(500).json({ message: "Failed to update maintenance mode" });
    }
  });
  app2.get("/api/company-settings", async (req, res) => {
    try {
      const settings = await storage2.getCompanySettings();
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to get company settings" });
    }
  });
  app2.post("/api/company-settings", async (req, res) => {
    try {
      const settings = req.body;
      const updatedSettings = await storage2.updateCompanySettings(settings);
      res.json({ message: "Company settings updated successfully", settings: updatedSettings });
    } catch (error) {
      res.status(500).json({ message: "Failed to update company settings" });
    }
  });
  app2.get("/api/cms/categories", async (req, res) => {
    try {
      const categories3 = await storage2.getCmsCategories();
      res.json(categories3);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.post("/api/cms/categories", async (req, res) => {
    try {
      const categoryData = req.body;
      const category = await storage2.createCmsCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  app2.get("/api/cms/tags", async (req, res) => {
    try {
      const tags = await storage2.getCmsTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });
  app2.post("/api/cms/tags", async (req, res) => {
    try {
      const tagData = req.body;
      const tag = await storage2.createCmsTag(tagData);
      res.status(201).json(tag);
    } catch (error) {
      res.status(500).json({ message: "Failed to create tag" });
    }
  });
  app2.get("/api/cms/media", async (req, res) => {
    try {
      const media = await storage2.getCmsMedia();
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });
  app2.post("/api/cms/media", async (req, res) => {
    try {
      const mediaData = req.body;
      const media = await storage2.createCmsMedia(mediaData);
      res.status(201).json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload media" });
    }
  });
  app2.get("/api/cms/users", async (req, res) => {
    try {
      const users = await storage2.getCmsUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.post("/api/cms/users", async (req, res) => {
    try {
      const userData = req.body;
      const user = await storage2.createCmsUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.get("/api/cms/comments", async (req, res) => {
    try {
      const comments = await storage2.getCmsComments();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  app2.post("/api/cms/comments", async (req, res) => {
    try {
      const commentData = req.body;
      const comment = await storage2.createCmsComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create comment" });
    }
  });
  app2.get("/api/cms/menus", async (req, res) => {
    try {
      const menus = await storage2.getCmsMenus();
      res.json(menus);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menus" });
    }
  });
  app2.post("/api/cms/menus", async (req, res) => {
    try {
      const menuData = req.body;
      const menu = await storage2.createCmsMenu(menuData);
      res.status(201).json(menu);
    } catch (error) {
      res.status(500).json({ message: "Failed to create menu" });
    }
  });
  app2.get("/api/cms/settings", async (req, res) => {
    try {
      const settings = await storage2.getCmsSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  app2.post("/api/cms/settings", async (req, res) => {
    try {
      const settingsData = req.body;
      const settings = await storage2.updateCmsSettings(settingsData);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Nome de usu\xE1rio e senha s\xE3o obrigat\xF3rios" });
      }
      const { AdminAuthService: AdminAuthService2 } = await Promise.resolve().then(() => (init_admin_auth(), admin_auth_exports));
      const user = await AdminAuthService2.verifyCredentials(username, password);
      if (!user) {
        return res.status(401).json({ message: "Credenciais inv\xE1lidas" });
      }
      if (!user.isActive) {
        return res.status(401).json({ message: "Usu\xE1rio desativado" });
      }
      req.session.adminUserId = user.id;
      req.session.adminUser = user;
      await AdminAuthService2.updateLastLogin(user.id);
      res.json({
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout realizado com sucesso" });
    });
  });
  app2.get("/api/admin/me", async (req, res) => {
    try {
      const adminUserId = req.session.adminUserId;
      if (!adminUserId) {
        return res.status(401).json({ message: "N\xE3o autenticado" });
      }
      const { AdminAuthService: AdminAuthService2 } = await Promise.resolve().then(() => (init_admin_auth(), admin_auth_exports));
      const user = await AdminAuthService2.getUser(adminUserId);
      if (!user || !user.isActive) {
        req.session.destroy(() => {
        });
        return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado ou desativado" });
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
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  async function requireAdminAuth(req, res, next) {
    try {
      const adminUserId = req.session.adminUserId;
      if (!adminUserId) {
        return res.status(401).json({ message: "Autentica\xE7\xE3o necess\xE1ria" });
      }
      const { AdminAuthService: AdminAuthService2 } = await Promise.resolve().then(() => (init_admin_auth(), admin_auth_exports));
      const user = await AdminAuthService2.getUser(adminUserId);
      if (!user || !user.isActive) {
        req.session.destroy(() => {
        });
        return res.status(401).json({ message: "Usu\xE1rio n\xE3o autorizado" });
      }
      req.adminUser = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "Erro de autentica\xE7\xE3o" });
    }
  }
  app2.get("/api/admin/users", requireAdminAuth, async (req, res) => {
    try {
      const { AdminAuthService: AdminAuthService2 } = await Promise.resolve().then(() => (init_admin_auth(), admin_auth_exports));
      const users = await AdminAuthService2.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usu\xE1rios" });
    }
  });
  app2.post("/api/admin/users", requireAdminAuth, async (req, res) => {
    try {
      const { username, email, password, displayName, role, isActive } = req.body;
      if (!username || !email || !password || !displayName) {
        return res.status(400).json({ message: "Campos obrigat\xF3rios: username, email, password, displayName" });
      }
      const { AdminAuthService: AdminAuthService2 } = await Promise.resolve().then(() => (init_admin_auth(), admin_auth_exports));
      const existingUser = await AdminAuthService2.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Nome de usu\xE1rio j\xE1 existe" });
      }
      const newUser = await AdminAuthService2.createUser({
        username,
        email,
        password,
        displayName,
        role: role || "admin",
        isActive: isActive !== void 0 ? isActive : true
      });
      res.status(201).json({
        message: "Usu\xE1rio criado com sucesso",
        user: {
          id: newUser.id,
          username: newUser.username,
          displayName: newUser.displayName,
          email: newUser.email,
          role: newUser.role,
          isActive: newUser.isActive
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar usu\xE1rio" });
    }
  });
  app2.put("/api/admin/users/:id", requireAdminAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { username, email, displayName, role, isActive, password } = req.body;
      const { AdminAuthService: AdminAuthService2 } = await Promise.resolve().then(() => (init_admin_auth(), admin_auth_exports));
      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (displayName) updateData.displayName = displayName;
      if (role) updateData.role = role;
      if (isActive !== void 0) updateData.isActive = isActive;
      if (password) updateData.password = password;
      const updatedUser = await AdminAuthService2.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      res.json({
        message: "Usu\xE1rio atualizado com sucesso",
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          displayName: updatedUser.displayName,
          email: updatedUser.email,
          role: updatedUser.role,
          isActive: updatedUser.isActive
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usu\xE1rio" });
    }
  });
  app2.delete("/api/admin/users/:id", requireAdminAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (userId === req.adminUser.id) {
        return res.status(400).json({ message: "N\xE3o \xE9 poss\xEDvel excluir seu pr\xF3prio usu\xE1rio" });
      }
      const { AdminAuthService: AdminAuthService2 } = await Promise.resolve().then(() => (init_admin_auth(), admin_auth_exports));
      const deleted = await AdminAuthService2.deleteUser(userId);
      if (!deleted) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      res.json({ message: "Usu\xE1rio exclu\xEDdo com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir usu\xE1rio" });
    }
  });
  app2.get("/health", (req, res) => {
    const status = {
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      domain: process.env.DOMAIN || "not configured",
      host: req.get("Host"),
      protocol: req.protocol,
      url: `${req.protocol}://${req.get("Host")}`,
      headers: {
        origin: req.get("Origin"),
        referer: req.get("Referer"),
        userAgent: req.get("User-Agent")
      }
    };
    res.json(status);
  });
  app2.get("/domain-check", (req, res) => {
    const domainInfo = {
      configuredDomain: process.env.DOMAIN || null,
      currentHost: req.get("Host"),
      isCustomDomain: req.get("Host") !== "localhost:5000" && !req.get("Host")?.includes(".replit."),
      protocol: req.protocol,
      secure: req.secure || req.get("x-forwarded-proto") === "https",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    res.json(domainInfo);
  });
  app2.get("/api/status", (req, res) => {
    res.json({
      api: "operational",
      database: "checking",
      cms: "operational",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/routes-simple.ts
import express2 from "express";

// server/storage-clean.ts
var SimpleMemoryStorage = class {
  categories = [
    { id: 1, name: "Pneum\xE1ticas", description: "Rodas pneum\xE1ticas para empilhadeiras", createdAt: /* @__PURE__ */ new Date() },
    { id: 2, name: "S\xF3lidas", description: "Rodas s\xF3lidas sem ar", createdAt: /* @__PURE__ */ new Date() },
    { id: 3, name: "Poliuretano", description: "Rodas de poliuretano", createdAt: /* @__PURE__ */ new Date() },
    { id: 4, name: "Borracha", description: "Rodas de borracha", createdAt: /* @__PURE__ */ new Date() }
  ];
  brands = [
    { id: 1, name: "Pollyfort", description: "Marca principal da empresa", createdAt: /* @__PURE__ */ new Date() },
    { id: 2, name: "Industrial Plus", description: "Linha industrial avan\xE7ada", createdAt: /* @__PURE__ */ new Date() },
    { id: 3, name: "Premium Wheels", description: "Rodas premium para aplica\xE7\xF5es especiais", createdAt: /* @__PURE__ */ new Date() },
    { id: 4, name: "Durability Pro", description: "Linha profissional de alta durabilidade", createdAt: /* @__PURE__ */ new Date() }
  ];
  products = [
    {
      id: 1,
      name: "Roda Pneum\xE1tica 8.5 x 3.0",
      code: "PN-8530",
      description: "Roda pneum\xE1tica robusta para empilhadeiras el\xE9tricas.",
      category: "Pneum\xE1ticas",
      brand: "Pollyfort",
      diameter: "8.5",
      width: "3.0",
      material: "Borracha Premium",
      hardness: "80 Shore A",
      maxLoad: "1500kg",
      application: "Empilhadeiras el\xE9tricas internas",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
      rating: 5,
      reviewCount: 12,
      status: "active",
      featured: true
    },
    {
      id: 2,
      name: "Roda S\xF3lida 10 x 3.5",
      code: "SO-1035",
      description: "Roda s\xF3lida sem ar, ideal para ambientes industriais.",
      category: "S\xF3lidas",
      brand: "Industrial Plus",
      diameter: "10",
      width: "3.5",
      material: "Poliuretano",
      hardness: "95 Shore A",
      maxLoad: "2000kg",
      application: "Ambientes industriais severos",
      imageUrl: "https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=500",
      rating: 4,
      reviewCount: 8,
      status: "active",
      featured: false
    }
  ];
  quotations = [];
  // Products
  async getProducts() {
    return this.products;
  }
  async getProduct(id) {
    return this.products.find((p) => p.id === id);
  }
  async createProduct(product) {
    const id = Math.max(...this.products.map((p) => p.id), 0) + 1;
    const newProduct = {
      id,
      ...product,
      brand: product.brand || null,
      hardness: product.hardness || null,
      maxLoad: product.maxLoad || null,
      application: product.application || null,
      imageUrl: product.imageUrl || null,
      price: product.price || null,
      rating: 0,
      reviewCount: 0,
      status: product.status || "active",
      featured: product.featured || false
    };
    this.products.push(newProduct);
    return newProduct;
  }
  async updateProduct(id, updates) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return void 0;
    const normalizedUpdates = {
      ...updates,
      brand: updates.brand === void 0 ? this.products[index].brand : updates.brand || null,
      hardness: updates.hardness === void 0 ? this.products[index].hardness : updates.hardness || null,
      maxLoad: updates.maxLoad === void 0 ? this.products[index].maxLoad : updates.maxLoad || null,
      application: updates.application === void 0 ? this.products[index].application : updates.application || null,
      imageUrl: updates.imageUrl === void 0 ? this.products[index].imageUrl : updates.imageUrl || null,
      price: updates.price === void 0 ? this.products[index].price : updates.price || null,
      featured: updates.featured === void 0 ? this.products[index].featured : updates.featured || false
    };
    this.products[index] = { ...this.products[index], ...normalizedUpdates };
    return this.products[index];
  }
  async deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }
  // Categories
  async getCategories() {
    return this.categories;
  }
  async createCategory(category) {
    const id = Math.max(...this.categories.map((c) => c.id), 0) + 1;
    const newCategory = {
      id,
      name: category.name,
      description: category.description || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.categories.push(newCategory);
    return newCategory;
  }
  async updateCategory(id, updates) {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return void 0;
    const normalizedUpdates = {
      ...updates,
      description: updates.description === void 0 ? this.categories[index].description : updates.description || null
    };
    this.categories[index] = { ...this.categories[index], ...normalizedUpdates };
    return this.categories[index];
  }
  async deleteCategory(id) {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    const categoryName = this.categories[index].name;
    const productsUsingCategory = this.products.filter((p) => p.category === categoryName);
    if (productsUsingCategory.length > 0) {
      console.log(`[storage] N\xE3o \xE9 poss\xEDvel deletar categoria ${categoryName}: ${productsUsingCategory.length} produtos em uso`);
      return false;
    }
    this.categories.splice(index, 1);
    console.log(`[storage] Categoria ${categoryName} deletada com sucesso`);
    return true;
  }
  // Brands
  async getBrands() {
    return this.brands;
  }
  async createBrand(brand) {
    const id = Math.max(...this.brands.map((b) => b.id), 0) + 1;
    const newBrand = {
      id,
      name: brand.name,
      description: brand.description || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.brands.push(newBrand);
    return newBrand;
  }
  async updateBrand(id, updates) {
    const index = this.brands.findIndex((b) => b.id === id);
    if (index === -1) return void 0;
    const normalizedUpdates = {
      ...updates,
      description: updates.description === void 0 ? this.brands[index].description : updates.description || null
    };
    this.brands[index] = { ...this.brands[index], ...normalizedUpdates };
    return this.brands[index];
  }
  async deleteBrand(id) {
    const index = this.brands.findIndex((b) => b.id === id);
    if (index === -1) return false;
    const brandName = this.brands[index].name;
    const productsUsingBrand = this.products.filter((p) => p.brand === brandName);
    if (productsUsingBrand.length > 0) {
      console.log(`[storage] N\xE3o \xE9 poss\xEDvel deletar marca ${brandName}: ${productsUsingBrand.length} produtos em uso`);
      return false;
    }
    this.brands.splice(index, 1);
    console.log(`[storage] Marca ${brandName} deletada com sucesso`);
    return true;
  }
  // Utility methods
  async getProductsByCategory(category) {
    return this.products.filter((p) => p.category === category);
  }
  async getQuotations() {
    return this.quotations;
  }
  async createQuotation(quotation) {
    const id = Math.max(...this.quotations.map((q) => q.id), 0) + 1;
    const newQuotation = {
      id,
      name: quotation.name,
      email: quotation.email,
      phone: quotation.phone,
      products: quotation.products,
      company: quotation.company || null,
      customerId: quotation.customerId || null,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      responseMessage: null,
      totalValue: null,
      validUntil: null
    };
    this.quotations.push(newQuotation);
    return newQuotation;
  }
};
var simpleStorage = new SimpleMemoryStorage();

// server/routes-simple.ts
init_schema();
var router = express2.Router();
router.get("/api/admin/categories", async (req, res) => {
  try {
    const categories3 = await simpleStorage.getCategories();
    res.json(categories3);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});
router.post("/api/admin/categories", async (req, res) => {
  try {
    const categoryData = insertCategorySchema.parse(req.body);
    const newCategory = await simpleStorage.createCategory(categoryData);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Failed to create category" });
  }
});
router.put("/api/admin/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = insertCategorySchema.partial().parse(req.body);
    const updated = await simpleStorage.updateCategory(id, updates);
    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
});
router.delete("/api/admin/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await simpleStorage.deleteCategory(id);
    if (!success) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
});
router.get("/api/admin/brands", async (req, res) => {
  try {
    const brands3 = await simpleStorage.getBrands();
    res.json(brands3);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Failed to fetch brands" });
  }
});
router.post("/api/admin/brands", async (req, res) => {
  try {
    const brandData = insertBrandSchema.parse(req.body);
    const newBrand = await simpleStorage.createBrand(brandData);
    res.status(201).json(newBrand);
  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(500).json({ message: "Failed to create brand" });
  }
});
router.put("/api/admin/brands/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = insertBrandSchema.partial().parse(req.body);
    const updated = await simpleStorage.updateBrand(id, updates);
    if (!updated) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ message: "Failed to update brand" });
  }
});
router.delete("/api/admin/brands/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await simpleStorage.deleteBrand(id);
    if (!success) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ message: "Failed to delete brand" });
  }
});
router.post("/api/admin/products", async (req, res) => {
  try {
    const productData = insertProductSchema.parse(req.body);
    const newProduct = await simpleStorage.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
});
router.put("/api/admin/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = insertProductSchema.partial().parse(req.body);
    const updated = await simpleStorage.updateProduct(id, updates);
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});
router.delete("/api/admin/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await simpleStorage.deleteProduct(id);
    if (!success) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});
router.get("/api/quotations", async (req, res) => {
  try {
    const quotations2 = await simpleStorage.getQuotations();
    res.json(quotations2);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ message: "Failed to fetch quotations" });
  }
});
var routes_simple_default = router;

// server/routes-products.ts
import { Router } from "express";
import { z as z3 } from "zod";

// server/product-service.ts
var ProductService = class _ProductService {
  static instance;
  static getInstance() {
    if (!_ProductService.instance) {
      _ProductService.instance = new _ProductService();
    }
    return _ProductService.instance;
  }
  /**
   * Valida dados do produto antes de salvar
   */
  validateProduct(data) {
    const errors = [];
    const warnings = [];
    if (!data.name?.trim()) errors.push("Nome do produto \xE9 obrigat\xF3rio");
    if (!data.code?.trim()) errors.push("C\xF3digo do produto \xE9 obrigat\xF3rio");
    if (!data.description?.trim()) errors.push("Descri\xE7\xE3o do produto \xE9 obrigat\xF3ria");
    if (!data.category?.trim()) errors.push("Categoria \xE9 obrigat\xF3ria");
    if (!data.brand?.trim()) errors.push("Marca \xE9 obrigat\xF3ria");
    if (!data.diameter?.trim()) errors.push("Di\xE2metro \xE9 obrigat\xF3rio");
    if (!data.width?.trim()) errors.push("Largura \xE9 obrigat\xF3ria");
    if (!data.material?.trim()) errors.push("Material \xE9 obrigat\xF3rio");
    if (data.code && data.code.length < 3) {
      errors.push("C\xF3digo deve ter pelo menos 3 caracteres");
    }
    if (data.name && data.name.length < 5) {
      errors.push("Nome deve ter pelo menos 5 caracteres");
    }
    if (data.price && isNaN(parseFloat(data.price))) {
      errors.push("Pre\xE7o deve ser um n\xFAmero v\xE1lido");
    }
    if (!data.price?.trim()) warnings.push("Pre\xE7o n\xE3o informado");
    if (!data.hardness?.trim()) warnings.push("Dureza n\xE3o informada");
    if (!data.maxLoad?.trim()) warnings.push("Carga m\xE1xima n\xE3o informada");
    if (!data.application?.trim()) warnings.push("Aplica\xE7\xE3o n\xE3o informada");
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  /**
   * Normaliza dados do produto para inserção
   */
  normalizeProductData(data) {
    return {
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      description: data.description.trim(),
      category: data.category.trim(),
      brand: data.brand.trim(),
      diameter: data.diameter.trim(),
      width: data.width.trim(),
      material: data.material.trim(),
      hardness: data.hardness?.trim() || null,
      maxLoad: data.maxLoad?.trim() || null,
      application: data.application?.trim() || null,
      imageUrl: data.imageUrl?.trim() || null,
      price: data.price?.trim() || null,
      featured: data.featured || false,
      status: data.status || "active"
    };
  }
  /**
   * Cria um novo produto
   */
  async createProduct(data) {
    try {
      console.log("\u{1F195} Criando novo produto:", data.name);
      const validation = this.validateProduct(data);
      if (!validation.isValid) {
        console.log("\u274C Valida\xE7\xE3o falhou:", validation.errors);
        return { success: false, errors: validation.errors };
      }
      const existingProducts = await simpleStorage.getProducts();
      const codeExists = existingProducts.some((p) => p.code === data.code.toUpperCase());
      if (codeExists) {
        return { success: false, errors: ["C\xF3digo do produto j\xE1 existe"] };
      }
      const normalizedData = this.normalizeProductData(data);
      const product = await simpleStorage.createProduct(normalizedData);
      console.log("\u2705 Produto criado com sucesso:", product.id);
      return { success: true, product };
    } catch (error) {
      console.error("\u274C Erro ao criar produto:", error);
      return { success: false, errors: ["Erro interno do servidor"] };
    }
  }
  /**
   * Atualiza um produto existente
   */
  async updateProduct(id, data) {
    try {
      console.log(`\u{1F504} Atualizando produto ${id}:`, data.name);
      const validation = this.validateProduct(data);
      if (!validation.isValid) {
        console.log("\u274C Valida\xE7\xE3o falhou:", validation.errors);
        return { success: false, errors: validation.errors };
      }
      const existingProduct = await simpleStorage.getProduct(id);
      if (!existingProduct) {
        return { success: false, errors: ["Produto n\xE3o encontrado"] };
      }
      const existingProducts = await simpleStorage.getProducts();
      const codeExists = existingProducts.some((p) => p.code === data.code.toUpperCase() && p.id !== id);
      if (codeExists) {
        return { success: false, errors: ["C\xF3digo do produto j\xE1 existe"] };
      }
      const normalizedData = this.normalizeProductData(data);
      const product = await simpleStorage.updateProduct(id, normalizedData);
      if (!product) {
        return { success: false, errors: ["Erro ao atualizar produto"] };
      }
      console.log("\u2705 Produto atualizado com sucesso:", product.id);
      return { success: true, product };
    } catch (error) {
      console.error("\u274C Erro ao atualizar produto:", error);
      return { success: false, errors: ["Erro interno do servidor"] };
    }
  }
  /**
   * Remove um produto
   */
  async deleteProduct(id) {
    try {
      console.log(`\u{1F5D1}\uFE0F Removendo produto ${id}`);
      const success = await simpleStorage.deleteProduct(id);
      if (!success) {
        return { success: false, errors: ["Produto n\xE3o encontrado"] };
      }
      console.log("\u2705 Produto removido com sucesso:", id);
      return { success: true };
    } catch (error) {
      console.error("\u274C Erro ao remover produto:", error);
      return { success: false, errors: ["Erro interno do servidor"] };
    }
  }
  /**
   * Busca produtos com filtros
   */
  async searchProducts(filters = {}) {
    try {
      const products2 = await simpleStorage.getProducts();
      return products2.filter((product) => {
        if (filters.category && product.category !== filters.category) return false;
        if (filters.brand && product.brand !== filters.brand) return false;
        if (filters.status && product.status !== filters.status) return false;
        if (filters.search) {
          const search = filters.search.toLowerCase();
          return product.name.toLowerCase().includes(search) || product.code.toLowerCase().includes(search) || product.description.toLowerCase().includes(search);
        }
        return true;
      });
    } catch (error) {
      console.error("\u274C Erro ao buscar produtos:", error);
      return [];
    }
  }
  /**
   * Gera estatísticas de produtos
   */
  async getProductStats() {
    try {
      const products2 = await simpleStorage.getProducts();
      const stats = {
        total: products2.length,
        byCategory: {},
        byBrand: {},
        byStatus: {}
      };
      products2.forEach((product) => {
        stats.byCategory[product.category] = (stats.byCategory[product.category] || 0) + 1;
        if (product.brand) {
          stats.byBrand[product.brand] = (stats.byBrand[product.brand] || 0) + 1;
        }
        stats.byStatus[product.status] = (stats.byStatus[product.status] || 0) + 1;
      });
      return stats;
    } catch (error) {
      console.error("\u274C Erro ao gerar estat\xEDsticas:", error);
      return { total: 0, byCategory: {}, byBrand: {}, byStatus: {} };
    }
  }
};
var productService = ProductService.getInstance();

// server/routes-products.ts
var router2 = Router();
var ProductSchema = z3.object({
  name: z3.string().min(5, "Nome deve ter pelo menos 5 caracteres"),
  code: z3.string().min(3, "C\xF3digo deve ter pelo menos 3 caracteres"),
  description: z3.string().min(10, "Descri\xE7\xE3o deve ter pelo menos 10 caracteres"),
  category: z3.string().min(1, "Categoria \xE9 obrigat\xF3ria"),
  brand: z3.string().min(1, "Marca \xE9 obrigat\xF3ria"),
  diameter: z3.string().min(1, "Di\xE2metro \xE9 obrigat\xF3rio"),
  width: z3.string().min(1, "Largura \xE9 obrigat\xF3ria"),
  material: z3.string().min(1, "Material \xE9 obrigat\xF3rio"),
  hardness: z3.string().optional(),
  maxLoad: z3.string().optional(),
  application: z3.string().optional(),
  imageUrl: z3.string().optional(),
  price: z3.string().optional(),
  featured: z3.boolean().optional(),
  status: z3.enum(["active", "inactive", "draft"]).optional()
});
router2.get("/products", async (req, res) => {
  try {
    const { category, brand, search, status, page = "1", limit = "50" } = req.query;
    const filters = {
      category,
      brand,
      search,
      status
    };
    const products2 = await productService.searchProducts(filters);
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProducts = products2.slice(startIndex, endIndex);
    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: products2.length,
        totalPages: Math.ceil(products2.length / limitNum)
      }
    });
  } catch (error) {
    console.error("\u274C Erro ao listar produtos:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
});
router2.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inv\xE1lido"
      });
    }
    const product = await simpleStorage.getProduct(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Produto n\xE3o encontrado"
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("\u274C Erro ao obter produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
});
router2.post("/products", async (req, res) => {
  try {
    console.log("\u{1F4DD} Nova requisi\xE7\xE3o de cria\xE7\xE3o de produto:", req.body);
    const validation = ProductSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
      console.log("\u274C Valida\xE7\xE3o Zod falhou:", errors);
      return res.status(400).json({
        success: false,
        error: "Dados inv\xE1lidos",
        details: errors
      });
    }
    const result = await productService.createProduct(validation.data);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: "Erro ao criar produto",
        details: result.errors
      });
    }
    res.status(201).json({
      success: true,
      data: result.product,
      message: "Produto criado com sucesso"
    });
  } catch (error) {
    console.error("\u274C Erro ao criar produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
});
router2.put("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inv\xE1lido"
      });
    }
    console.log(`\u{1F4DD} Atualizando produto ${id}:`, req.body);
    const validation = ProductSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
      console.log("\u274C Valida\xE7\xE3o Zod falhou:", errors);
      return res.status(400).json({
        success: false,
        error: "Dados inv\xE1lidos",
        details: errors
      });
    }
    const result = await productService.updateProduct(id, validation.data);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: "Erro ao atualizar produto",
        details: result.errors
      });
    }
    res.json({
      success: true,
      data: result.product,
      message: "Produto atualizado com sucesso"
    });
  } catch (error) {
    console.error("\u274C Erro ao atualizar produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
});
router2.delete("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inv\xE1lido"
      });
    }
    const result = await productService.deleteProduct(id);
    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: "Produto n\xE3o encontrado",
        details: result.errors
      });
    }
    res.json({
      success: true,
      message: "Produto removido com sucesso"
    });
  } catch (error) {
    console.error("\u274C Erro ao deletar produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
});
router2.get("/products/stats", async (req, res) => {
  try {
    const stats = await productService.getProductStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("\u274C Erro ao obter estat\xEDsticas:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
});
router2.get("/categories", async (req, res) => {
  try {
    const categories3 = await simpleStorage.getCategories();
    res.json({
      success: true,
      data: categories3
    });
  } catch (error) {
    console.error("\u274C Erro ao listar categorias:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
});
router2.get("/brands", async (req, res) => {
  try {
    const brands3 = await simpleStorage.getBrands();
    res.json({
      success: true,
      data: brands3
    });
  } catch (error) {
    console.error("\u274C Erro ao listar marcas:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
});
var routes_products_default = router2;

// server/routes-products-v2.ts
import { Router as Router2 } from "express";

// server/product-service-v2.ts
import { z as z4 } from "zod";
var ProductInputSchema = z4.object({
  name: z4.string().min(5, "Nome deve ter pelo menos 5 caracteres").max(255, "Nome deve ter no m\xE1ximo 255 caracteres").trim(),
  code: z4.string().min(3, "C\xF3digo deve ter pelo menos 3 caracteres").max(50, "C\xF3digo deve ter no m\xE1ximo 50 caracteres").regex(/^[A-Z0-9\-_]+$/, "C\xF3digo deve conter apenas letras mai\xFAsculas, n\xFAmeros, h\xEDfens e underscores").trim(),
  description: z4.string().min(10, "Descri\xE7\xE3o deve ter pelo menos 10 caracteres").max(2e3, "Descri\xE7\xE3o deve ter no m\xE1ximo 2000 caracteres").trim(),
  category: z4.string().min(1, "Categoria \xE9 obrigat\xF3ria").max(100, "Categoria deve ter no m\xE1ximo 100 caracteres").trim(),
  brand: z4.string().min(1, "Marca \xE9 obrigat\xF3ria").max(100, "Marca deve ter no m\xE1ximo 100 caracteres").trim(),
  diameter: z4.string().min(1, "Di\xE2metro \xE9 obrigat\xF3rio").regex(/^\d+(\.\d+)?$/, "Di\xE2metro deve ser um n\xFAmero v\xE1lido").trim(),
  width: z4.string().min(1, "Largura \xE9 obrigat\xF3ria").regex(/^\d+(\.\d+)?$/, "Largura deve ser um n\xFAmero v\xE1lido").trim(),
  material: z4.string().min(2, "Material deve ter pelo menos 2 caracteres").max(100, "Material deve ter no m\xE1ximo 100 caracteres").trim(),
  hardness: z4.string().max(100, "Dureza deve ter no m\xE1ximo 100 caracteres").optional().nullable(),
  maxLoad: z4.string().max(100, "Carga m\xE1xima deve ter no m\xE1ximo 100 caracteres").optional().nullable(),
  application: z4.string().max(1e3, "Aplica\xE7\xE3o deve ter no m\xE1ximo 1000 caracteres").optional().nullable(),
  imageUrl: z4.string().url("URL da imagem deve ser v\xE1lida").optional().nullable().or(z4.literal("")),
  price: z4.string().regex(/^\d+(\.\d{1,2})?$/, "Pre\xE7o deve ser um n\xFAmero v\xE1lido com at\xE9 2 casas decimais").optional().nullable().or(z4.literal("")),
  featured: z4.boolean().default(false),
  status: z4.enum(["active", "inactive", "draft"]).default("active")
});
var ProductServiceV2 = class _ProductServiceV2 {
  static instance;
  static getInstance() {
    if (!_ProductServiceV2.instance) {
      _ProductServiceV2.instance = new _ProductServiceV2();
    }
    return _ProductServiceV2.instance;
  }
  /**
   * Valida entrada de produto com Zod
   */
  validateProductInput(input) {
    const result = ProductInputSchema.safeParse(input);
    if (!result.success) {
      const errors = result.error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      return {
        isValid: false,
        errors,
        warnings: this.generateWarnings(input)
      };
    }
    return {
      isValid: true,
      errors: [],
      warnings: this.generateWarnings(result.data),
      data: result.data
    };
  }
  /**
   * Gera avisos para campos opcionais não preenchidos
   */
  generateWarnings(data) {
    const warnings = [];
    if (!data.price || data.price === "") {
      warnings.push("Pre\xE7o n\xE3o informado - produto pode n\xE3o aparecer em cota\xE7\xF5es");
    }
    if (!data.hardness || data.hardness === "") {
      warnings.push("Dureza n\xE3o informada - especifica\xE7\xE3o t\xE9cnica incompleta");
    }
    if (!data.maxLoad || data.maxLoad === "") {
      warnings.push("Carga m\xE1xima n\xE3o informada - especifica\xE7\xE3o t\xE9cnica incompleta");
    }
    if (!data.application || data.application === "") {
      warnings.push("Aplica\xE7\xE3o n\xE3o informada - pode dificultar busca por produtos");
    }
    if (!data.imageUrl || data.imageUrl === "") {
      warnings.push("Imagem n\xE3o informada - produto pode ter menor convers\xE3o");
    }
    return warnings;
  }
  /**
   * Verifica se código do produto já existe
   */
  async checkCodeUniqueness(code, excludeId) {
    const products2 = await simpleStorage.getProducts();
    return !products2.some(
      (p) => p.code.toUpperCase() === code.toUpperCase() && (excludeId === void 0 || p.id !== excludeId)
    );
  }
  /**
   * Verifica se categoria existe
   */
  async validateCategory(categoryName) {
    const categories3 = await simpleStorage.getCategories();
    return categories3.some((c) => c.name === categoryName);
  }
  /**
   * Verifica se marca existe
   */
  async validateBrand(brandName) {
    const brands3 = await simpleStorage.getBrands();
    return brands3.some((b) => b.name === brandName);
  }
  /**
   * Normaliza dados para inserção
   */
  normalizeProductData(data) {
    return {
      name: data.name.trim(),
      code: data.code.toUpperCase().trim(),
      description: data.description.trim(),
      category: data.category.trim(),
      brand: data.brand.trim(),
      diameter: data.diameter.trim(),
      width: data.width.trim(),
      material: data.material.trim(),
      hardness: data.hardness?.trim() || null,
      maxLoad: data.maxLoad?.trim() || null,
      application: data.application?.trim() || null,
      imageUrl: data.imageUrl?.trim() || null,
      price: data.price?.trim() || null,
      featured: data.featured,
      status: data.status
    };
  }
  /**
   * Cria novo produto com validação completa
   */
  async createProduct(input) {
    try {
      console.log("\u{1F195} [ProductServiceV2] Iniciando cria\xE7\xE3o de produto:", input.name);
      const validation = this.validateProductInput(input);
      if (!validation.isValid) {
        console.log("\u274C [ProductServiceV2] Valida\xE7\xE3o falhou:", validation.errors);
        return {
          success: false,
          errors: validation.errors
        };
      }
      const data = validation.data;
      const isCodeUnique = await this.checkCodeUniqueness(data.code);
      if (!isCodeUnique) {
        return {
          success: false,
          errors: [`C\xF3digo '${data.code}' j\xE1 existe. Escolha um c\xF3digo \xFAnico.`]
        };
      }
      const categoryExists = await this.validateCategory(data.category);
      if (!categoryExists) {
        console.log(`\u26A0\uFE0F [ProductServiceV2] Categoria '${data.category}' n\xE3o existe, mas prosseguindo`);
      }
      const brandExists = await this.validateBrand(data.brand);
      if (!brandExists) {
        console.log(`\u26A0\uFE0F [ProductServiceV2] Marca '${data.brand}' n\xE3o existe, mas prosseguindo`);
      }
      const normalizedData = this.normalizeProductData(data);
      const product = await simpleStorage.createProduct(normalizedData);
      console.log("\u2705 [ProductServiceV2] Produto criado com sucesso:", {
        id: product.id,
        name: product.name,
        code: product.code
      });
      return {
        success: true,
        product,
        message: `Produto '${product.name}' criado com sucesso!`
      };
    } catch (error) {
      console.error("\u274C [ProductServiceV2] Erro ao criar produto:", error);
      return {
        success: false,
        errors: ["Erro interno do servidor. Tente novamente."]
      };
    }
  }
  /**
   * Atualiza produto existente
   */
  async updateProduct(id, input) {
    try {
      console.log(`\u{1F504} [ProductServiceV2] Iniciando atualiza\xE7\xE3o do produto ${id}:`, input.name);
      const existingProduct = await simpleStorage.getProduct(id);
      if (!existingProduct) {
        return {
          success: false,
          errors: ["Produto n\xE3o encontrado."]
        };
      }
      const validation = this.validateProductInput(input);
      if (!validation.isValid) {
        console.log("\u274C [ProductServiceV2] Valida\xE7\xE3o falhou:", validation.errors);
        return {
          success: false,
          errors: validation.errors
        };
      }
      const data = validation.data;
      const isCodeUnique = await this.checkCodeUniqueness(data.code, id);
      if (!isCodeUnique) {
        return {
          success: false,
          errors: [`C\xF3digo '${data.code}' j\xE1 existe em outro produto.`]
        };
      }
      const normalizedData = this.normalizeProductData(data);
      const product = await simpleStorage.updateProduct(id, normalizedData);
      if (!product) {
        return {
          success: false,
          errors: ["Erro ao atualizar produto. Tente novamente."]
        };
      }
      console.log("\u2705 [ProductServiceV2] Produto atualizado com sucesso:", {
        id: product.id,
        name: product.name,
        code: product.code
      });
      return {
        success: true,
        product,
        message: `Produto '${product.name}' atualizado com sucesso!`
      };
    } catch (error) {
      console.error("\u274C [ProductServiceV2] Erro ao atualizar produto:", error);
      return {
        success: false,
        errors: ["Erro interno do servidor. Tente novamente."]
      };
    }
  }
  /**
   * Remove produto
   */
  async deleteProduct(id) {
    try {
      console.log(`\u{1F5D1}\uFE0F [ProductServiceV2] Iniciando remo\xE7\xE3o do produto ${id}`);
      const existingProduct = await simpleStorage.getProduct(id);
      if (!existingProduct) {
        return {
          success: false,
          errors: ["Produto n\xE3o encontrado."]
        };
      }
      const success = await simpleStorage.deleteProduct(id);
      if (!success) {
        return {
          success: false,
          errors: ["Erro ao remover produto. Tente novamente."]
        };
      }
      console.log("\u2705 [ProductServiceV2] Produto removido com sucesso:", {
        id,
        name: existingProduct.name
      });
      return {
        success: true,
        message: `Produto '${existingProduct.name}' removido com sucesso!`
      };
    } catch (error) {
      console.error("\u274C [ProductServiceV2] Erro ao remover produto:", error);
      return {
        success: false,
        errors: ["Erro interno do servidor. Tente novamente."]
      };
    }
  }
  /**
   * Busca produto por ID
   */
  async getProduct(id) {
    try {
      return await simpleStorage.getProduct(id);
    } catch (error) {
      console.error("\u274C [ProductServiceV2] Erro ao buscar produto:", error);
      return null;
    }
  }
  /**
   * Lista produtos com filtros avançados
   */
  async searchProducts(filters = {}) {
    try {
      const products2 = await simpleStorage.getProducts();
      return products2.filter((product) => {
        if (filters.category && product.category !== filters.category) {
          return false;
        }
        if (filters.brand && product.brand !== filters.brand) {
          return false;
        }
        if (filters.status && product.status !== filters.status) {
          return false;
        }
        if (filters.featured !== void 0 && product.featured !== filters.featured) {
          return false;
        }
        if (filters.priceMin !== void 0 || filters.priceMax !== void 0) {
          const price = product.price ? parseFloat(product.price) : 0;
          if (filters.priceMin !== void 0 && price < filters.priceMin) {
            return false;
          }
          if (filters.priceMax !== void 0 && price > filters.priceMax) {
            return false;
          }
        }
        if (filters.search) {
          const search = filters.search.toLowerCase();
          return product.name.toLowerCase().includes(search) || product.code.toLowerCase().includes(search) || product.description.toLowerCase().includes(search) || product.material.toLowerCase().includes(search) || product.application && product.application.toLowerCase().includes(search);
        }
        return true;
      });
    } catch (error) {
      console.error("\u274C [ProductServiceV2] Erro ao buscar produtos:", error);
      return [];
    }
  }
  /**
   * Gera estatísticas detalhadas
   */
  async getDetailedStats() {
    try {
      const products2 = await simpleStorage.getProducts();
      const stats = {
        total: products2.length,
        active: 0,
        inactive: 0,
        draft: 0,
        featured: 0,
        withPrice: 0,
        withImage: 0,
        byCategory: {},
        byBrand: {},
        avgPrice: 0
      };
      let totalPrice = 0;
      let priceCount = 0;
      products2.forEach((product) => {
        if (product.status === "active") stats.active++;
        else if (product.status === "inactive") stats.inactive++;
        else if (product.status === "draft") stats.draft++;
        if (product.featured) stats.featured++;
        if (product.price) {
          stats.withPrice++;
          totalPrice += parseFloat(product.price);
          priceCount++;
        }
        if (product.imageUrl) stats.withImage++;
        stats.byCategory[product.category] = (stats.byCategory[product.category] || 0) + 1;
        if (product.brand) {
          stats.byBrand[product.brand] = (stats.byBrand[product.brand] || 0) + 1;
        }
      });
      stats.avgPrice = priceCount > 0 ? totalPrice / priceCount : 0;
      return stats;
    } catch (error) {
      console.error("\u274C [ProductServiceV2] Erro ao gerar estat\xEDsticas:", error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        draft: 0,
        featured: 0,
        withPrice: 0,
        withImage: 0,
        byCategory: {},
        byBrand: {},
        avgPrice: 0
      };
    }
  }
};
var productServiceV2 = ProductServiceV2.getInstance();

// server/routes-products-v2.ts
var router3 = Router2();
router3.use((req, res, next) => {
  console.log(
    `\u{1F4E1} [ProductsV2] ${req.method} ${req.path}`,
    req.method === "POST" || req.method === "PUT" ? req.body : req.query
  );
  next();
});
router3.get("/products", async (req, res) => {
  try {
    const {
      category,
      brand,
      search,
      status,
      featured,
      priceMin,
      priceMax,
      page = "1",
      limit = "50",
      sortBy = "name",
      sortOrder = "asc"
    } = req.query;
    const filters = {
      category,
      brand,
      search,
      status,
      featured: featured === "true" ? true : featured === "false" ? false : void 0,
      priceMin: priceMin ? parseFloat(priceMin) : void 0,
      priceMax: priceMax ? parseFloat(priceMax) : void 0
    };
    let products2 = await productServiceV2.searchProducts(filters);
    products2.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      if (sortBy === "price") {
        aValue = aValue ? parseFloat(aValue) : 0;
        bValue = bValue ? parseFloat(bValue) : 0;
      }
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (sortOrder === "desc") {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProducts = products2.slice(startIndex, endIndex);
    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: products2.length,
        totalPages: Math.ceil(products2.length / limitNum),
        hasNext: endIndex < products2.length,
        hasPrev: pageNum > 1
      },
      filters,
      sort: { sortBy, sortOrder }
    });
  } catch (error) {
    console.error("\u274C [ProductsV2] Erro ao listar produtos:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "N\xE3o foi poss\xEDvel carregar os produtos"
    });
  }
});
router3.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        error: "ID inv\xE1lido",
        message: "O ID do produto deve ser um n\xFAmero positivo"
      });
    }
    const product = await productServiceV2.getProduct(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Produto n\xE3o encontrado",
        message: `Produto com ID ${id} n\xE3o existe`
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("\u274C [ProductsV2] Erro ao obter produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "N\xE3o foi poss\xEDvel carregar o produto"
    });
  }
});
router3.post("/products", async (req, res) => {
  try {
    console.log("\u{1F4DD} [ProductsV2] Nova requisi\xE7\xE3o de cria\xE7\xE3o:", req.body);
    const result = await productServiceV2.createProduct(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: "Erro de valida\xE7\xE3o",
        message: "Dados do produto s\xE3o inv\xE1lidos",
        details: result.errors
      });
    }
    res.status(201).json({
      success: true,
      data: result.product,
      message: result.message
    });
  } catch (error) {
    console.error("\u274C [ProductsV2] Erro ao criar produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "N\xE3o foi poss\xEDvel criar o produto"
    });
  }
});
router3.put("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        error: "ID inv\xE1lido",
        message: "O ID do produto deve ser um n\xFAmero positivo"
      });
    }
    console.log(`\u{1F4DD} [ProductsV2] Atualizando produto ${id}:`, req.body);
    const result = await productServiceV2.updateProduct(id, req.body);
    if (!result.success) {
      const status = result.errors?.includes("Produto n\xE3o encontrado") ? 404 : 400;
      return res.status(status).json({
        success: false,
        error: status === 404 ? "Produto n\xE3o encontrado" : "Erro de valida\xE7\xE3o",
        message: result.errors?.[0] || "Erro ao atualizar produto",
        details: result.errors
      });
    }
    res.json({
      success: true,
      data: result.product,
      message: result.message
    });
  } catch (error) {
    console.error("\u274C [ProductsV2] Erro ao atualizar produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "N\xE3o foi poss\xEDvel atualizar o produto"
    });
  }
});
router3.delete("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        error: "ID inv\xE1lido",
        message: "O ID do produto deve ser um n\xFAmero positivo"
      });
    }
    const result = await productServiceV2.deleteProduct(id);
    if (!result.success) {
      const status = result.errors?.includes("Produto n\xE3o encontrado") ? 404 : 400;
      return res.status(status).json({
        success: false,
        error: status === 404 ? "Produto n\xE3o encontrado" : "Erro ao deletar",
        message: result.errors?.[0] || "Erro ao deletar produto",
        details: result.errors
      });
    }
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error("\u274C [ProductsV2] Erro ao deletar produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "N\xE3o foi poss\xEDvel deletar o produto"
    });
  }
});
router3.get("/products-stats", async (req, res) => {
  try {
    const stats = await productServiceV2.getDetailedStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("\u274C [ProductsV2] Erro ao obter estat\xEDsticas:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "N\xE3o foi poss\xEDvel carregar estat\xEDsticas"
    });
  }
});
router3.post("/products/validate", async (req, res) => {
  try {
    const validation = productServiceV2.validateProductInput(req.body);
    res.json({
      success: true,
      data: {
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings
      }
    });
  } catch (error) {
    console.error("\u274C [ProductsV2] Erro ao validar produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "N\xE3o foi poss\xEDvel validar o produto"
    });
  }
});
router3.get("/categories", async (req, res) => {
  try {
    const categories3 = await simpleStorage.getCategories();
    res.json({
      success: true,
      data: categories3
    });
  } catch (error) {
    console.error("\u274C [ProductsV2] Erro ao listar categorias:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "N\xE3o foi poss\xEDvel carregar categorias"
    });
  }
});
router3.get("/brands", async (req, res) => {
  try {
    const brands3 = await simpleStorage.getBrands();
    res.json({
      success: true,
      data: brands3
    });
  } catch (error) {
    console.error("\u274C [ProductsV2] Erro ao listar marcas:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "N\xE3o foi poss\xEDvel carregar marcas"
    });
  }
});
var routes_products_v2_default = router3;

// server/routes-products-upload.ts
init_upload_config_persistent();
import { Router as Router3 } from "express";
init_schema();
import { z as z5 } from "zod";
var router4 = Router3();
var productWithImageSchema = insertProductSchema.extend({
  imageUrl: z5.string().optional(),
  brandId: z5.union([z5.string(), z5.number()]).transform((val) => val === "" || val === null ? null : Number(val)).nullable(),
  categoryId: z5.union([z5.string(), z5.number()]).transform((val) => val === "" || val === null ? null : Number(val)).nullable(),
  rating: z5.union([z5.string(), z5.number()]).transform((val) => val === "" || val === null ? 0 : Number(val)),
  reviewCount: z5.union([z5.string(), z5.number()]).transform((val) => val === "" || val === null ? 0 : Number(val)),
  featured: z5.union([z5.string(), z5.boolean()]).transform((val) => val === "true" || val === true)
});
router4.post("/upload", upload.single("productImage"), async (req, res) => {
  try {
    console.log("[Product Upload] Starting product creation with image upload");
    console.log("[Product Upload] Request body:", req.body);
    console.log("[Product Upload] File info:", req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : "No file provided");
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Product image is required"
      });
    }
    const validationResult = productWithImageSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.log("[Product Upload] Validation error:", validationResult.error);
      return res.status(400).json({
        success: false,
        error: "Invalid product data",
        details: validationResult.error.errors
      });
    }
    console.log("[Product Upload] Processing uploaded image...");
    const imageUrl = await processUploadedFile(req.file);
    console.log("[Product Upload] Image processed successfully:", imageUrl);
    const productData = {
      ...validationResult.data,
      imageUrl,
      status: validationResult.data.status || "active"
    };
    console.log("[Product Upload] Creating product in database...");
    const newProduct = await storage2.createProduct(productData);
    console.log("[Product Upload] Product created successfully:", newProduct.id);
    res.status(201).json({
      success: true,
      message: "Product created successfully with image upload",
      product: newProduct
    });
  } catch (error) {
    console.error("[Product Upload] Error:", error);
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 5MB."
      });
    }
    if (error.message === "Only image files are allowed!") {
      return res.status(400).json({
        success: false,
        error: "Only image files (PNG, JPEG, JPG) are allowed."
      });
    }
    if (error.message === "Failed to upload file to storage") {
      return res.status(500).json({
        success: false,
        error: "Failed to upload image. Please try again."
      });
    }
    res.status(500).json({
      success: false,
      error: "Internal server error while creating product"
    });
  }
});
router4.put("/:id/upload", upload.single("productImage"), async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    console.log(`[Product Upload] Updating product ${productId} with new image`);
    const existingProduct = await storage2.getProduct(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }
    let imageUrl = existingProduct.imageUrl;
    if (req.file) {
      console.log("[Product Upload] New image provided, processing...");
      imageUrl = await processUploadedFile(req.file);
      console.log("[Product Upload] New image processed successfully:", imageUrl);
    }
    const validationResult = productWithImageSchema.partial().safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid product data",
        details: validationResult.error.errors
      });
    }
    const updateData = {
      ...validationResult.data,
      imageUrl
    };
    const updatedProduct = await storage2.updateProduct(productId, updateData);
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }
    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("[Product Upload] Update error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while updating product"
    });
  }
});
var routes_products_upload_default = router4;

// server/routes-storage-repair.ts
init_persistent_storage();
import { Router as Router4 } from "express";
var router5 = Router4();
router5.post("/repair", async (req, res) => {
  try {
    console.log("[Storage Repair] Starting repair process...");
    await persistentStorage.repairMissingFiles();
    res.json({
      success: true,
      message: "Storage repair completed successfully"
    });
  } catch (error) {
    console.error("[Storage Repair] Error:", error);
    res.status(500).json({
      success: false,
      error: "Storage repair failed"
    });
  }
});
router5.get("/files", async (req, res) => {
  try {
    const files = await persistentStorage.listFiles();
    res.json({
      success: true,
      files,
      count: files.length
    });
  } catch (error) {
    console.error("[Storage List] Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to list files"
    });
  }
});
router5.get("/status/:filename", async (req, res) => {
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
    console.error("[Storage Status] Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check file status"
    });
  }
});
var routes_storage_repair_default = router5;

// server/test-upload.ts
import { Router as Router5 } from "express";

// server/upload-config.ts
import multer3 from "multer";
import path5 from "path";
import fs5 from "fs";
var uploadDir = path5.join(process.cwd(), "uploads", "products");
if (!fs5.existsSync(uploadDir)) {
  fs5.mkdirSync(uploadDir, { recursive: true });
}
var storage4 = multer3.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp2 = Date.now();
    const extension = path5.extname(file.originalname);
    const filename = `${timestamp2}-${file.originalname}`;
    cb(null, filename);
  }
});
var fileFilter3 = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};
var upload2 = multer3({
  storage: storage4,
  fileFilter: fileFilter3,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  }
});
function processUploadedFile2(file) {
  const publicUrl = `/uploads/products/${file.filename}`;
  console.log(`[Upload] File uploaded successfully: ${publicUrl}`);
  return publicUrl;
}

// server/test-upload.ts
var router6 = Router5();
router6.post("/test-upload", upload2.single("testImage"), async (req, res) => {
  try {
    console.log("[Test Upload] Starting image upload test");
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file provided"
      });
    }
    const imageUrl = processUploadedFile2(req.file);
    console.log("[Test Upload] File uploaded successfully:", imageUrl);
    res.json({
      success: true,
      message: "File uploaded successfully",
      imageUrl,
      fileInfo: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error("[Test Upload] Error:", error);
    res.status(500).json({
      success: false,
      error: "Upload failed"
    });
  }
});
var test_upload_default = router6;

// server/routes-brands-categories.ts
init_db();
init_schema();
import { Router as Router6 } from "express";
import { eq as eq2, sql, desc as desc2 } from "drizzle-orm";
import { z as z6 } from "zod";
var router7 = Router6();
var brandSchema = z6.object({
  name: z6.string().min(1, "Nome da marca \xE9 obrigat\xF3rio").max(255, "Nome muito longo"),
  description: z6.string().optional()
});
var categorySchema = z6.object({
  name: z6.string().min(1, "Nome da categoria \xE9 obrigat\xF3rio").max(255, "Nome muito longo"),
  description: z6.string().optional()
});
async function isDatabaseAvailable() {
  try {
    const db3 = await getDB();
    return db3 !== null;
  } catch (error) {
    return false;
  }
}
router7.get("/brands", async (req, res) => {
  try {
    const isDbAvailable = await isDatabaseAvailable();
    if (isDbAvailable) {
      const db3 = await getDB();
      const allBrands = await db3.select({
        id: brands.id,
        name: brands.name,
        description: brands.description,
        createdAt: brands.createdAt,
        productCount: sql`count(${products.id})::int`.as("productCount")
      }).from(brands).leftJoin(products, eq2(brands.id, products.brandId)).groupBy(brands.id, brands.name, brands.description, brands.createdAt).orderBy(desc2(brands.createdAt));
      console.log(`[brands] Listadas ${allBrands.length} marcas (PostgreSQL)`);
      res.json(allBrands);
    } else {
      const brandsWithCount = getImportedBrands();
      console.log(`[brands] Listadas ${brandsWithCount.length} marcas (Memory)`);
      res.json(brandsWithCount);
    }
  } catch (error) {
    console.error("[brands] Erro ao listar marcas:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao listar marcas"
    });
  }
});
router7.post("/brands", async (req, res) => {
  try {
    const validation = brandSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Dados inv\xE1lidos",
        errors: validation.error.errors.map((err) => err.message)
      });
    }
    const { name, description } = validation.data;
    const isDbAvailable = await isDatabaseAvailable();
    if (isDbAvailable) {
      const db3 = await getDB();
      const existingBrand = await db3.select().from(brands).where(eq2(brands.name, name)).limit(1);
      if (existingBrand.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Marca com este nome j\xE1 existe"
        });
      }
      const [newBrand] = await db3.insert(brands).values({
        name,
        description: description || null
      }).returning();
      console.log(`[brands] Nova marca criada: ${newBrand.name} (PostgreSQL)`);
      res.status(201).json({
        success: true,
        message: "Marca criada com sucesso",
        brand: newBrand
      });
    } else {
      const existingBrands = await simpleStorage.getBrands();
      const existingBrand = existingBrands.find((b) => b.name.toLowerCase() === name.toLowerCase());
      if (existingBrand) {
        return res.status(409).json({
          success: false,
          message: "Marca com este nome j\xE1 existe"
        });
      }
      const newBrand = await simpleStorage.createBrand({
        name,
        description: description || null
      });
      console.log(`[brands] Nova marca criada: ${newBrand.name} (Memory)`);
      res.status(201).json({
        success: true,
        message: "Marca criada com sucesso",
        brand: newBrand
      });
    }
  } catch (error) {
    console.error("[brands] Erro ao criar marca:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao criar marca"
    });
  }
});
router7.put("/brands/:id", async (req, res) => {
  try {
    const brandId = parseInt(req.params.id);
    if (isNaN(brandId)) {
      return res.status(400).json({
        success: false,
        message: "ID da marca inv\xE1lido"
      });
    }
    const validation = brandSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Dados inv\xE1lidos",
        errors: validation.error.errors.map((err) => err.message)
      });
    }
    const { name, description } = validation.data;
    const isDbAvailable = await isDatabaseAvailable();
    if (isDbAvailable) {
      const db3 = await getDB();
      const existingBrand = await db3.select().from(brands).where(eq2(brands.id, brandId)).limit(1);
      if (existingBrand.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Marca n\xE3o encontrada"
        });
      }
      const duplicateBrand = await db3.select().from(brands).where(eq2(brands.name, name)).limit(1);
      if (duplicateBrand.length > 0 && duplicateBrand[0].id !== brandId) {
        return res.status(409).json({
          success: false,
          message: "J\xE1 existe uma marca com este nome"
        });
      }
      const [updatedBrand] = await db3.update(brands).set({
        name,
        description: description || null
      }).where(eq2(brands.id, brandId)).returning();
      console.log(`[brands] Marca atualizada: ${updatedBrand.name} (PostgreSQL)`);
      res.json({
        success: true,
        message: "Marca atualizada com sucesso",
        brand: updatedBrand
      });
    } else {
      const updatedBrand = await simpleStorage.updateBrand(brandId, {
        name,
        description: description || null
      });
      if (!updatedBrand) {
        return res.status(404).json({
          success: false,
          message: "Marca n\xE3o encontrada"
        });
      }
      console.log(`[brands] Marca atualizada: ${updatedBrand.name} (Memory)`);
      res.json({
        success: true,
        message: "Marca atualizada com sucesso",
        brand: updatedBrand
      });
    }
  } catch (error) {
    console.error("[brands] Erro ao atualizar marca:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao atualizar marca"
    });
  }
});
router7.delete("/brands/:id", async (req, res) => {
  try {
    const brandId = parseInt(req.params.id);
    if (isNaN(brandId)) {
      return res.status(400).json({
        success: false,
        message: "ID da marca inv\xE1lido"
      });
    }
    const isDbAvailable = await isDatabaseAvailable();
    if (isDbAvailable) {
      const db3 = await getDB();
      const existingBrand = await db3.select().from(brands).where(eq2(brands.id, brandId)).limit(1);
      if (existingBrand.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Marca n\xE3o encontrada"
        });
      }
      const allProducts = await db3.select().from(products);
      const productsUsingBrand = allProducts.filter((p) => p.brand === existingBrand[0].name);
      if (productsUsingBrand.length > 0) {
        return res.status(409).json({
          success: false,
          message: `N\xE3o \xE9 poss\xEDvel excluir marca que est\xE1 sendo usada por ${productsUsingBrand.length} produto(s)`
        });
      }
      await db3.delete(brands).where(eq2(brands.id, brandId));
      console.log(`[brands] Marca removida: ${existingBrand[0].name} (PostgreSQL)`);
      res.json({
        success: true,
        message: "Marca removida com sucesso"
      });
    } else {
      const deleted = await simpleStorage.deleteBrand(brandId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Marca n\xE3o encontrada"
        });
      }
      console.log(`[brands] Marca removida (Memory)`);
      res.json({
        success: true,
        message: "Marca removida com sucesso"
      });
    }
  } catch (error) {
    console.error("[brands] Erro ao remover marca:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao remover marca"
    });
  }
});
router7.get("/categories", async (req, res) => {
  try {
    const isDbAvailable = await isDatabaseAvailable();
    if (isDbAvailable) {
      const db3 = await getDB();
      const allCategories = await db3.select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        createdAt: categories.createdAt,
        productCount: sql`count(${products.id})::int`.as("productCount")
      }).from(categories).leftJoin(products, eq2(categories.id, products.categoryId)).groupBy(categories.id, categories.name, categories.description, categories.createdAt).orderBy(desc2(categories.createdAt));
      console.log(`[categories] Listadas ${allCategories.length} categorias (PostgreSQL)`);
      res.json(allCategories);
    } else {
      const categoriesWithCount = getImportedCategories();
      console.log(`[categories] Listadas ${categoriesWithCount.length} categorias (Memory)`);
      res.json(categoriesWithCount);
    }
  } catch (error) {
    console.error("[categories] Erro ao listar categorias:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao listar categorias"
    });
  }
});
router7.post("/categories", async (req, res) => {
  try {
    const validation = categorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Dados inv\xE1lidos",
        errors: validation.error.errors.map((err) => err.message)
      });
    }
    const { name, description } = validation.data;
    const isDbAvailable = await isDatabaseAvailable();
    if (isDbAvailable) {
      const db3 = await getDB();
      const existingCategory = await db3.select().from(categories).where(eq2(categories.name, name)).limit(1);
      if (existingCategory.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Categoria com este nome j\xE1 existe"
        });
      }
      const [newCategory] = await db3.insert(categories).values({
        name,
        description: description || null
      }).returning();
      console.log(`[categories] Nova categoria criada: ${newCategory.name} (PostgreSQL)`);
      res.status(201).json({
        success: true,
        message: "Categoria criada com sucesso",
        category: newCategory
      });
    } else {
      const existingCategories = await simpleStorage.getCategories();
      const existingCategory = existingCategories.find((c) => c.name.toLowerCase() === name.toLowerCase());
      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "Categoria com este nome j\xE1 existe"
        });
      }
      const newCategory = await simpleStorage.createCategory({
        name,
        description: description || null
      });
      console.log(`[categories] Nova categoria criada: ${newCategory.name} (Memory)`);
      res.status(201).json({
        success: true,
        message: "Categoria criada com sucesso",
        category: newCategory
      });
    }
  } catch (error) {
    console.error("[categories] Erro ao criar categoria:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao criar categoria"
    });
  }
});
router7.put("/categories/:id", async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "ID da categoria inv\xE1lido"
      });
    }
    const validation = categorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Dados inv\xE1lidos",
        errors: validation.error.errors.map((err) => err.message)
      });
    }
    const { name, description } = validation.data;
    const isDbAvailable = await isDatabaseAvailable();
    if (isDbAvailable) {
      const db3 = await getDB();
      const existingCategory = await db3.select().from(categories).where(eq2(categories.id, categoryId)).limit(1);
      if (existingCategory.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Categoria n\xE3o encontrada"
        });
      }
      const duplicateCategory = await db3.select().from(categories).where(eq2(categories.name, name)).limit(1);
      if (duplicateCategory.length > 0 && duplicateCategory[0].id !== categoryId) {
        return res.status(409).json({
          success: false,
          message: "J\xE1 existe uma categoria com este nome"
        });
      }
      const [updatedCategory] = await db3.update(categories).set({
        name,
        description: description || null
      }).where(eq2(categories.id, categoryId)).returning();
      console.log(`[categories] Categoria atualizada: ${updatedCategory.name} (PostgreSQL)`);
      res.json({
        success: true,
        message: "Categoria atualizada com sucesso",
        category: updatedCategory
      });
    } else {
      const updatedCategory = await simpleStorage.updateCategory(categoryId, {
        name,
        description: description || null
      });
      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: "Categoria n\xE3o encontrada"
        });
      }
      console.log(`[categories] Categoria atualizada: ${updatedCategory.name} (Memory)`);
      res.json({
        success: true,
        message: "Categoria atualizada com sucesso",
        category: updatedCategory
      });
    }
  } catch (error) {
    console.error("[categories] Erro ao atualizar categoria:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao atualizar categoria"
    });
  }
});
router7.delete("/categories/:id", async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "ID da categoria inv\xE1lido"
      });
    }
    const isDbAvailable = await isDatabaseAvailable();
    if (isDbAvailable) {
      const db3 = await getDB();
      const existingCategory = await db3.select().from(categories).where(eq2(categories.id, categoryId)).limit(1);
      if (existingCategory.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Categoria n\xE3o encontrada"
        });
      }
      const allProducts = await db3.select().from(products);
      const productsUsingCategory = allProducts.filter((p) => p.category === existingCategory[0].name);
      if (productsUsingCategory.length > 0) {
        return res.status(409).json({
          success: false,
          message: `N\xE3o \xE9 poss\xEDvel excluir categoria que est\xE1 sendo usada por ${productsUsingCategory.length} produto(s)`
        });
      }
      await db3.delete(categories).where(eq2(categories.id, categoryId));
      console.log(`[categories] Categoria removida: ${existingCategory[0].name} (PostgreSQL)`);
      res.json({
        success: true,
        message: "Categoria removida com sucesso"
      });
    } else {
      const deleted = await simpleStorage.deleteCategory(categoryId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Categoria n\xE3o encontrada"
        });
      }
      console.log(`[categories] Categoria removida (Memory)`);
      res.json({
        success: true,
        message: "Categoria removida com sucesso"
      });
    }
  } catch (error) {
    console.error("[categories] Erro ao remover categoria:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao remover categoria"
    });
  }
});
router7.delete("/brands/bulk", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Lista de IDs \xE9 obrigat\xF3ria"
      });
    }
    const isDbAvailable = await isDatabaseAvailable();
    const results = [];
    for (const id of ids) {
      try {
        const brandId = parseInt(id);
        if (isNaN(brandId)) continue;
        if (isDbAvailable) {
          const db3 = await getDB();
          const existingBrand = await db3.select().from(brands).where(eq2(brands.id, brandId)).limit(1);
          if (existingBrand.length === 0) {
            results.push({ id: brandId, success: false, message: "Marca n\xE3o encontrada" });
            continue;
          }
          const allProducts = await db3.select().from(products);
          const productsUsingBrand = allProducts.filter((p) => p.brand === existingBrand[0].name);
          if (productsUsingBrand.length > 0) {
            results.push({
              id: brandId,
              success: false,
              message: `Marca em uso por ${productsUsingBrand.length} produto(s)`
            });
            continue;
          }
          await db3.delete(brands).where(eq2(brands.id, brandId));
          results.push({ id: brandId, success: true, message: "Marca removida" });
        } else {
          const deleted = await simpleStorage.deleteBrand(brandId);
          results.push({
            id: brandId,
            success: deleted,
            message: deleted ? "Marca removida" : "Marca n\xE3o encontrada"
          });
        }
      } catch (error) {
        results.push({ id, success: false, message: "Erro ao remover marca" });
      }
    }
    res.json({
      success: true,
      message: "Opera\xE7\xE3o de remo\xE7\xE3o conclu\xEDda",
      results
    });
  } catch (error) {
    console.error("[brands] Erro na remo\xE7\xE3o em lote:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});
router7.delete("/categories/bulk", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Lista de IDs \xE9 obrigat\xF3ria"
      });
    }
    const isDbAvailable = await isDatabaseAvailable();
    const results = [];
    for (const id of ids) {
      try {
        const categoryId = parseInt(id);
        if (isNaN(categoryId)) continue;
        if (isDbAvailable) {
          const db3 = await getDB();
          const existingCategory = await db3.select().from(categories).where(eq2(categories.id, categoryId)).limit(1);
          if (existingCategory.length === 0) {
            results.push({ id: categoryId, success: false, message: "Categoria n\xE3o encontrada" });
            continue;
          }
          const allProducts = await db3.select().from(products);
          const productsUsingCategory = allProducts.filter((p) => p.category === existingCategory[0].name);
          if (productsUsingCategory.length > 0) {
            results.push({
              id: categoryId,
              success: false,
              message: `Categoria em uso por ${productsUsingCategory.length} produto(s)`
            });
            continue;
          }
          await db3.delete(categories).where(eq2(categories.id, categoryId));
          results.push({ id: categoryId, success: true, message: "Categoria removida" });
        } else {
          const deleted = await simpleStorage.deleteCategory(categoryId);
          results.push({
            id: categoryId,
            success: deleted,
            message: deleted ? "Categoria removida" : "Categoria n\xE3o encontrada"
          });
        }
      } catch (error) {
        results.push({ id, success: false, message: "Erro ao remover categoria" });
      }
    }
    res.json({
      success: true,
      message: "Opera\xE7\xE3o de remo\xE7\xE3o conclu\xEDda",
      results
    });
  } catch (error) {
    console.error("[categories] Erro na remo\xE7\xE3o em lote:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// server/routes-products-enhanced.ts
init_db();
init_schema();
import { Router as Router7 } from "express";
import { eq as eq3, sql as sql2, desc as desc3, and as and2, or, ilike } from "drizzle-orm";
import { z as z7 } from "zod";
var router8 = Router7();
var productSchema = z7.object({
  name: z7.string().min(1, "Nome \xE9 obrigat\xF3rio").max(255, "Nome muito longo"),
  code: z7.string().min(1, "C\xF3digo \xE9 obrigat\xF3rio").max(100, "C\xF3digo muito longo"),
  description: z7.string().min(1, "Descri\xE7\xE3o \xE9 obrigat\xF3ria"),
  brandId: z7.number().int().positive("ID da marca deve ser um n\xFAmero positivo").nullable(),
  categoryId: z7.number().int().positive("ID da categoria deve ser um n\xFAmero positivo").nullable(),
  diameter: z7.string().min(1, "Di\xE2metro \xE9 obrigat\xF3rio"),
  width: z7.string().min(1, "Largura \xE9 obrigat\xF3ria"),
  material: z7.string().min(1, "Material \xE9 obrigat\xF3rio"),
  imageUrl: z7.string().url().optional().nullable(),
  rating: z7.number().int().min(0).max(5).optional(),
  reviewCount: z7.number().int().min(0).optional(),
  status: z7.enum(["active", "inactive", "draft"]).default("active"),
  featured: z7.boolean().default(false)
});
router8.get("/products", async (req, res) => {
  try {
    const db3 = await getDB();
    if (!db3) {
      return res.status(500).json({ success: false, message: "Database not available" });
    }
    const { search, category: categoryFilter, brand: brandFilter, status: statusFilter } = req.query;
    let whereConditions = [];
    if (search && typeof search === "string") {
      whereConditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`),
          ilike(products.code, `%${search}%`)
        )
      );
    }
    if (categoryFilter && typeof categoryFilter === "string") {
      whereConditions.push(ilike(categories.name, `%${categoryFilter}%`));
    }
    if (brandFilter && typeof brandFilter === "string") {
      whereConditions.push(ilike(brands.name, `%${brandFilter}%`));
    }
    if (statusFilter && typeof statusFilter === "string") {
      whereConditions.push(eq3(products.status, statusFilter));
    }
    const productsWithDetails = await db3.select({
      id: products.id,
      name: products.name,
      code: products.code,
      description: products.description,
      brandId: products.brandId,
      brandName: brands.name,
      categoryId: products.categoryId,
      categoryName: categories.name,
      diameter: products.diameter,
      width: products.width,
      material: products.material,
      imageUrl: products.imageUrl,
      rating: products.rating,
      reviewCount: products.reviewCount,
      status: products.status,
      featured: products.featured
    }).from(products).leftJoin(brands, eq3(products.brandId, brands.id)).leftJoin(categories, eq3(products.categoryId, categories.id)).where(whereConditions.length > 0 ? and2(...whereConditions) : void 0).orderBy(desc3(products.featured), desc3(products.id)).catch((error) => {
      console.error("Database query error in products route:", error);
      throw error;
    });
    console.log(`[products] Listados ${productsWithDetails.length} produtos com detalhes de marca e categoria`);
    res.json(productsWithDetails);
  } catch (error) {
    console.error("[products] Erro ao listar produtos:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao listar produtos"
    });
  }
});
router8.get("/products/:id", async (req, res) => {
  try {
    const db3 = await getDB();
    if (!db3) {
      return res.status(500).json({ success: false, message: "Database not available" });
    }
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "ID do produto inv\xE1lido"
      });
    }
    const [productWithDetails] = await db3.select({
      id: products.id,
      name: products.name,
      code: products.code,
      description: products.description,
      brandId: products.brandId,
      brandName: brands.name,
      categoryId: products.categoryId,
      categoryName: categories.name,
      diameter: products.diameter,
      width: products.width,
      material: products.material,
      imageUrl: products.imageUrl,
      rating: products.rating,
      reviewCount: products.reviewCount,
      status: products.status,
      featured: products.featured
    }).from(products).leftJoin(brands, eq3(products.brandId, brands.id)).leftJoin(categories, eq3(products.categoryId, categories.id)).where(eq3(products.id, productId)).limit(1);
    if (!productWithDetails) {
      return res.status(404).json({
        success: false,
        message: "Produto n\xE3o encontrado"
      });
    }
    const images = await db3.select().from(productImages).where(eq3(productImages.productId, productId)).orderBy(desc3(productImages.isPrimary), productImages.id);
    const result = {
      ...productWithDetails,
      images
    };
    console.log(`[products] Produto ${productId} encontrado com detalhes completos`);
    res.json(result);
  } catch (error) {
    console.error("[products] Erro ao buscar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao buscar produto"
    });
  }
});
router8.post("/products", async (req, res) => {
  try {
    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Dados inv\xE1lidos",
        errors: validation.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
      });
    }
    const productData = validation.data;
    const existingProduct = await db.select().from(products).where(eq3(products.code, productData.code)).limit(1);
    if (existingProduct.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Produto com este c\xF3digo j\xE1 existe"
      });
    }
    if (productData.brandId) {
      const brand = await db.select().from(brands).where(eq3(brands.id, productData.brandId)).limit(1);
      if (brand.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Marca especificada n\xE3o existe"
        });
      }
    }
    if (productData.categoryId) {
      const category = await db.select().from(categories).where(eq3(categories.id, productData.categoryId)).limit(1);
      if (category.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Categoria especificada n\xE3o existe"
        });
      }
    }
    const [newProduct] = await db.insert(products).values({
      name: productData.name,
      code: productData.code,
      description: productData.description,
      brandId: productData.brandId,
      categoryId: productData.categoryId,
      diameter: productData.diameter,
      width: productData.width,
      material: productData.material,
      imageUrl: productData.imageUrl,
      rating: productData.rating || 0,
      reviewCount: productData.reviewCount || 0,
      status: productData.status,
      featured: productData.featured
    }).returning();
    console.log(`[products] Novo produto criado: ${newProduct.name} (ID: ${newProduct.id})`);
    res.status(201).json({
      success: true,
      message: "Produto criado com sucesso",
      product: newProduct
    });
  } catch (error) {
    console.error("[products] Erro ao criar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao criar produto"
    });
  }
});
router8.put("/products/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "ID do produto inv\xE1lido"
      });
    }
    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Dados inv\xE1lidos",
        errors: validation.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
      });
    }
    const productData = validation.data;
    const existingProduct = await db.select().from(products).where(eq3(products.id, productId)).limit(1);
    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produto n\xE3o encontrado"
      });
    }
    const duplicateProduct = await db.select().from(products).where(eq3(products.code, productData.code)).limit(1);
    if (duplicateProduct.length > 0 && duplicateProduct[0].id !== productId) {
      return res.status(409).json({
        success: false,
        message: "J\xE1 existe um produto com este c\xF3digo"
      });
    }
    if (productData.brandId) {
      const brand = await db.select().from(brands).where(eq3(brands.id, productData.brandId)).limit(1);
      if (brand.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Marca especificada n\xE3o existe"
        });
      }
    }
    if (productData.categoryId) {
      const category = await db.select().from(categories).where(eq3(categories.id, productData.categoryId)).limit(1);
      if (category.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Categoria especificada n\xE3o existe"
        });
      }
    }
    const [updatedProduct] = await db.update(products).set({
      name: productData.name,
      code: productData.code,
      description: productData.description,
      brandId: productData.brandId,
      categoryId: productData.categoryId,
      diameter: productData.diameter,
      width: productData.width,
      material: productData.material,
      imageUrl: productData.imageUrl,
      rating: productData.rating,
      reviewCount: productData.reviewCount,
      status: productData.status,
      featured: productData.featured
    }).where(eq3(products.id, productId)).returning();
    console.log(`[products] Produto atualizado: ${updatedProduct.name} (ID: ${updatedProduct.id})`);
    res.json({
      success: true,
      message: "Produto atualizado com sucesso",
      product: updatedProduct
    });
  } catch (error) {
    console.error("[products] Erro ao atualizar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao atualizar produto"
    });
  }
});
router8.delete("/products/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "ID do produto inv\xE1lido"
      });
    }
    const existingProduct = await db.select().from(products).where(eq3(products.id, productId)).limit(1);
    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produto n\xE3o encontrado"
      });
    }
    await db.delete(products).where(eq3(products.id, productId));
    console.log(`[products] Produto removido: ${existingProduct[0].name} (ID: ${productId})`);
    res.json({
      success: true,
      message: "Produto removido com sucesso"
    });
  } catch (error) {
    console.error("[products] Erro ao remover produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao remover produto"
    });
  }
});
router8.get("/products/stats", async (req, res) => {
  try {
    const [totalProducts] = await db.select({ count: sql2`count(*)::int` }).from(products);
    const productsByCategory = await db.select({
      categoryId: categories.id,
      categoryName: categories.name,
      count: sql2`count(${products.id})::int`
    }).from(categories).leftJoin(products, eq3(categories.id, products.categoryId)).groupBy(categories.id, categories.name).orderBy(desc3(sql2`count(${products.id})`));
    const productsByBrand = await db.select({
      brandId: brands.id,
      brandName: brands.name,
      count: sql2`count(${products.id})::int`
    }).from(brands).leftJoin(products, eq3(brands.id, products.brandId)).groupBy(brands.id, brands.name).orderBy(desc3(sql2`count(${products.id})`));
    const [featuredCount] = await db.select({ count: sql2`count(*)::int` }).from(products).where(eq3(products.featured, true));
    const stats = {
      totalProducts: totalProducts.count,
      featuredProducts: featuredCount.count,
      productsByCategory,
      productsByBrand
    };
    console.log("[products] Estat\xEDsticas geradas com sucesso");
    res.json(stats);
  } catch (error) {
    console.error("[products] Erro ao gerar estat\xEDsticas:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao gerar estat\xEDsticas"
    });
  }
});
var routes_products_enhanced_default = router8;

// server/index.ts
init_log();

// server/seed.ts
init_db();
init_schema();
async function seedDatabase() {
  const db3 = await getDB();
  if (!db3) {
    console.log("Database not available, skipping seed");
    return;
  }
  const existingProducts = await db3.select().from(products).limit(1);
  if (existingProducts.length > 0) {
    console.log("Database already seeded with products");
    return;
  }
  const sampleProducts = [
    {
      name: "Roda Poliuretano 200x50mm - Yale",
      code: "POL-200-50-YA",
      description: "Roda de poliuretano para empilhadeira el\xE9trica Yale. Alta durabilidade e resist\xEAncia.",
      category: "Rodas El\xE9tricas",
      diameter: "200mm",
      width: "50mm",
      material: "Poliuretano",
      hardness: "95 Shore A",
      maxLoad: "2500kg",
      application: "Yale ERP",
      imageUrl: "/attached_assets/servico-de-revestimento-de-roda-de-tracao-da-transpaleteira-eletrica-mpe-060-com-poliuretano-o-245mm-reweflon_1221_1749244270513.jpg",
      rating: 48,
      reviewCount: 23,
      featured: true,
      status: "active"
    },
    {
      name: "Roda de Tra\xE7\xE3o 230x70mm - Linde",
      code: "TRA-230-70-LI",
      description: "Roda de tra\xE7\xE3o em borracha maci\xE7a para empilhadeira Linde. M\xE1xima ader\xEAncia.",
      category: "Rodas de Tra\xE7\xE3o",
      diameter: "230mm",
      width: "70mm",
      material: "Borracha",
      hardness: "85 Shore A",
      maxLoad: "3000kg",
      application: "Linde E20",
      imageUrl: "/attached_assets/servico-de-revestimento-de-roda-de-tracao-da-empilhadeira-fmx-ng-com-poliuretano-o-360mm-reweflon_1215_1749244270513.jpg",
      rating: 46,
      reviewCount: 18,
      featured: false,
      status: "active"
    },
    {
      name: "Roda de Apoio 180x60mm - Toyota",
      code: "APO-180-60-TO",
      description: "Roda de apoio em nylon para empilhadeira Toyota. Baixo ru\xEDdo e alta resist\xEAncia.",
      category: "Rodas de Apoio",
      diameter: "180mm",
      width: "60mm",
      material: "Nylon",
      hardness: "90 Shore D",
      maxLoad: "1800kg",
      application: "Toyota 8FB",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      rating: 49,
      reviewCount: 31,
      featured: false,
      status: "active"
    },
    {
      name: "Roda Dupla 250x80mm - Hyster",
      code: "DUP-250-80-HY",
      description: "Conjunto de rodas duplas em poliuretano para empilhadeira Hyster. Carga pesada.",
      category: "Rodas El\xE9tricas",
      diameter: "250mm",
      width: "80mm",
      material: "Poliuretano",
      hardness: "98 Shore A",
      maxLoad: "4000kg",
      application: "Hyster J2.5XN",
      imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      rating: 47,
      reviewCount: 15,
      featured: false,
      status: "active"
    },
    {
      name: "Roda Pneum\xE1tica 200x50mm - Crown",
      code: "PNE-200-50-CR",
      description: "Roda pneum\xE1tica para empilhadeira Crown. Absor\xE7\xE3o de impactos e conforto.",
      category: "Rodas El\xE9tricas",
      diameter: "200mm",
      width: "50mm",
      material: "Borracha Pneum\xE1tica",
      hardness: "75 Shore A",
      maxLoad: "2200kg",
      application: "Crown RC5500",
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      rating: 45,
      reviewCount: 27,
      featured: false,
      status: "active"
    },
    {
      name: "Roda Borracha 220x65mm - Caterpillar",
      code: "BOR-220-65-CA",
      description: "Roda em borracha maci\xE7a para empilhadeira Caterpillar. Extrema durabilidade.",
      category: "Rodas de Tra\xE7\xE3o",
      diameter: "220mm",
      width: "65mm",
      material: "Borracha",
      hardness: "88 Shore A",
      maxLoad: "3500kg",
      application: "Caterpillar EP20K",
      imageUrl: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      rating: 48,
      reviewCount: 42,
      featured: true,
      status: "active"
    }
  ];
  console.log("Seeding database with products...");
  for (const product of sampleProducts) {
    await db3.insert(products).values(product);
  }
  console.log(`Successfully seeded ${sampleProducts.length} products`);
}

// server/index.ts
import session2 from "express-session";

// server/contact.ts
import nodemailer from "nodemailer";
var createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};
async function sendContactEmail(req, res) {
  try {
    const { name, email, phone, company, subject, message, formType = "contato" } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Nome, email e mensagem s\xE3o obrigat\xF3rios"
      });
    }
    const emailSubject = subject || `Nova mensagem de ${formType} - ${name}`;
    const emailContent = `
      <h2>Nova Mensagem de ${formType.charAt(0).toUpperCase() + formType.slice(1)}</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ""}
      ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ""}
      ${subject ? `<p><strong>Assunto:</strong> ${subject}</p>` : ""}
      <p><strong>Mensagem:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
      <hr>
      <p><em>Data: ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}</em></p>
    `;
    if (!process.env.SMTP_USER) {
      console.log("Email would be sent to vendas@pollyfortrodas.com.br:");
      console.log("Subject:", emailSubject);
      console.log("Content:", emailContent);
      return res.json({
        success: true,
        message: "Mensagem enviada com sucesso!"
      });
    }
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Site Pollyfort" <${process.env.SMTP_USER}>`,
      to: "vendas@pollyfortrodas.com.br, comercial@pollyfortrodas.com.br",
      subject: emailSubject,
      html: emailContent,
      replyTo: email
    });
    res.json({
      success: true,
      message: "Mensagem enviada com sucesso!"
    });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor. Tente novamente mais tarde."
    });
  }
}

// server/index.ts
init_persistent_storage();
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
var app = express4();
var appReady = null;
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "https://pollyfortrodas.com.br",
    "http://pollyfortrodas.com.br",
    "http://localhost:5000",
    "http://localhost:3000"
  ];
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(session2({
  secret: process.env.SESSION_SECRET || "pollyfort-admin-secret-key-2025",
  resave: false,
  saveUninitialized: false,
  name: "pollyfort.sid",
  cookie: {
    secure: false,
    // Set to false for now to work on both HTTP and HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3,
    // 24 hours
    sameSite: "lax"
  }
}));
app.use(express4.json({ limit: "50mb" }));
app.use(express4.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express4.static(path8.join(process.cwd(), "uploads")));
app.get("/uploads/products/:filename", async (req, res) => {
  const filename = req.params.filename;
  try {
    console.log(`[File Serve] Requesting: ${filename}`);
    if (filename.match(/^product-\d+-\d+\./)) {
      const objectStorageUrl = `https://storage.replit.com/${filename}`;
      console.log(`[File Serve] Redirecting to Object Storage: ${objectStorageUrl}`);
      return res.redirect(objectStorageUrl);
    }
    const localPath = path8.join(process.cwd(), "uploads/products", filename);
    const fs7 = __require("fs");
    if (fs7.existsSync(localPath)) {
      console.log(`[File Serve] Serving from local storage: ${filename}`);
      return res.sendFile(localPath);
    }
    console.log(`[File Serve] File not found locally, trying persistent storage: ${filename}`);
    const fileUrl = `/uploads/products/${filename}`;
    const buffer = await persistentStorage.retrieveFile(fileUrl);
    if (buffer) {
      console.log(`[File Serve] Retrieved from persistent storage: ${filename}`);
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000");
      return res.send(buffer);
    }
    console.log(`[File Serve] File not found in any storage: ${filename}`);
    res.status(404).json({ error: "Image not found" });
  } catch (error) {
    console.error(`[File Serve] Error serving file ${filename}:`, error);
    res.status(500).json({ error: "Error serving image" });
  }
});
app.use((req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    log(
      `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`,
      typeof data === "string" && data.length > 100 ? `${data.substring(0, 100)}\u2026` : data
    );
    return originalSend.call(this, data);
  };
  next();
});
async function createApp(options = {}) {
  if (appReady) return appReady;
  const { serveClient = true } = options;
  appReady = (async () => {
    try {
      let requireAdminAuth2 = function(req, res, next) {
        if (!req.session.adminUserId) {
          return res.status(401).json({ message: "Admin authentication required" });
        }
        next();
      };
      var requireAdminAuth = requireAdminAuth2;
      app.post("/api/admin/login", async (req, res) => {
        try {
          const { username, password } = req.body;
          console.log("Admin login attempt for username:", username);
          if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
          }
          const { AdminAuthService: AdminAuthService2 } = await Promise.resolve().then(() => (init_admin_auth(), admin_auth_exports));
          const user = await AdminAuthService2.verifyCredentials(username, password);
          if (!user) {
            console.log("Invalid credentials for username:", username);
            return res.status(401).json({ message: "Invalid credentials" });
          }
          req.session.adminUserId = user.id;
          await AdminAuthService2.updateLastLogin(user.id);
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
      app.post("/api/admin/logout", (req, res) => {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ message: "Could not log out" });
          }
          res.clearCookie("pollyfort.sid");
          res.json({ message: "Logout successful" });
        });
      });
      app.get("/api/admin/session-debug", (req, res) => {
        res.json({
          sessionID: req.sessionID,
          session: req.session,
          adminUserId: req.session.adminUserId,
          cookies: req.headers.cookie,
          userAgent: req.headers["user-agent"]
        });
      });
      app.get("/api/admin/me", async (req, res) => {
        try {
          console.log("Admin /me check - Session ID:", req.sessionID);
          console.log("Admin /me check - adminUserId:", req.session.adminUserId);
          console.log("Admin /me check - Full session:", req.session);
          if (!req.session.adminUserId) {
            return res.status(401).json({ message: "Not authenticated" });
          }
          const { AdminAuthService: AdminAuthService2 } = await Promise.resolve().then(() => (init_admin_auth(), admin_auth_exports));
          const user = await AdminAuthService2.getUser(req.session.adminUserId);
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
      app.use("/api/admin", (req, res, next) => {
        if (req.path === "/login" || req.path === "/logout" || req.path === "/me") {
          return next();
        }
        return requireAdminAuth2(req, res, next);
      });
      await registerRoutes(app);
      app.use("/api", routes_simple_default);
      app.use("/api", router7);
      app.use("/api/v2", routes_products_default);
      app.use("/api/v2", routes_products_v2_default);
      app.use("/api/products", routes_products_upload_default);
      app.use("/api/storage", routes_storage_repair_default);
      app.use("/api", routes_products_enhanced_default);
      app.use("/api/test", test_upload_default);
      app.post("/api/contact", sendContactEmail);
      app.use("/api/maintenance", (req, res) => {
        res.json({
          enabled: false,
          title: "Site em Manuten\xE7\xE3o",
          message: "Estamos realizando melhorias. Voltaremos em breve!"
        });
      });
      if (serveClient && app.get("env") === "development") {
        const server = createServer2(app);
        const { setupVite: setupVite2 } = await init_vite().then(() => vite_exports);
        await setupVite2(app, server);
      } else if (serveClient) {
        const { serveStatic: serveStatic2 } = await init_vite().then(() => vite_exports);
        serveStatic2(app);
      } else {
        app.use((req, res) => {
          res.status(404).json({ error: "API route not found" });
        });
      }
      if (serveClient && app.get("env") === "development") {
      } else {
      }
      app.use((err, req, res, next) => {
        log(`Error: ${err.message}`, err.stack);
        res.status(500).json({ error: "Internal server error" });
      });
      try {
        await seedDatabase();
      } catch (error) {
        log("Database seeding failed:", error);
        log("Application will continue without seeding - database may need manual setup");
      }
      return app;
    } catch (error) {
      console.error("Failed to start server:", error);
      appReady = null;
      throw error;
    }
  })();
  return appReady;
}
async function startServer() {
  const configuredApp = await createApp({ serveClient: true });
  const PORT = parseInt(process.env.PORT || "5000", 10);
  configuredApp.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
}
var isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  startServer().catch((error) => {
    console.error("Unhandled error during server startup:", error);
    process.exit(1);
  });
}
export {
  createApp,
  startServer
};
