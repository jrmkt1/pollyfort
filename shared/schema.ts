import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  address: text("address"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
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
  featured: boolean("featured").default(false),
});

export const quotations = pgTable("quotations", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quotationItems = pgTable("quotation_items", {
  id: serial("id").primaryKey(),
  quotationId: integer("quotation_id").notNull().references(() => quotations.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// CMS Tables
export const cmsUsers = pgTable("cms_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("editor"), // admin, editor, author, contributor
  bio: text("bio"),
  avatar: text("avatar"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cmsCategories = pgTable("cms_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  parentId: integer("parent_id"),
  count: integer("count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cmsTags = pgTable("cms_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  count: integer("count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cmsPosts = pgTable("cms_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  type: varchar("type", { length: 50 }).notNull().default("post"), // post, page, product, etc
  status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, published, private, trash
  authorId: integer("author_id").notNull().references(() => cmsUsers.id),
  parentId: integer("parent_id"),
  featuredImage: text("featured_image"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cmsMedia = pgTable("cms_media", {
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const cmsPostCategories = pgTable("cms_post_categories", {
  postId: integer("post_id").notNull().references(() => cmsPosts.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull().references(() => cmsCategories.id, { onDelete: "cascade" }),
});

export const cmsPostTags = pgTable("cms_post_tags", {
  postId: integer("post_id").notNull().references(() => cmsPosts.id, { onDelete: "cascade" }),
  tagId: integer("tag_id").notNull().references(() => cmsTags.id, { onDelete: "cascade" }),
});

export const cmsComments = pgTable("cms_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => cmsPosts.id, { onDelete: "cascade" }),
  parentId: integer("parent_id"),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }).notNull(),
  authorUrl: varchar("author_url", { length: 255 }),
  content: text("content").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // approved, pending, spam, trash
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cmsOptions = pgTable("cms_options", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  value: text("value"),
  autoload: boolean("autoload").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cmsMenus = pgTable("cms_menus", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cmsMenuItems = pgTable("cms_menu_items", {
  id: serial("id").primaryKey(),
  menuId: integer("menu_id").notNull().references(() => cmsMenus.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  url: text("url").notNull(),
  target: varchar("target", { length: 50 }).default("_self"),
  classes: varchar("classes", { length: 255 }),
  parentId: integer("parent_id"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Table to store uploaded images with metadata
export const productImages = pgTable("product_images", {
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

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertProductImageSchema = createInsertSchema(productImages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertQuotationSchema = createInsertSchema(quotations).omit({
  id: true,
  createdAt: true,
});

export const insertQuotationItemSchema = createInsertSchema(quotationItems).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
});

// CMS Insert Schemas
export const insertCmsUserSchema = createInsertSchema(cmsUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export const insertCmsPostSchema = createInsertSchema(cmsPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCmsCategorySchema = createInsertSchema(cmsCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  count: true,
});

export const insertCmsTagSchema = createInsertSchema(cmsTags).omit({
  id: true,
  createdAt: true,
  count: true,
});

export const insertCmsMediaSchema = createInsertSchema(cmsMedia).omit({
  id: true,
  createdAt: true,
});

export const insertCmsCommentSchema = createInsertSchema(cmsComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCmsOptionSchema = createInsertSchema(cmsOptions).omit({
  id: true,
  updatedAt: true,
});

export const insertCmsMenuSchema = createInsertSchema(cmsMenus).omit({
  id: true,
  createdAt: true,
});

export const insertCmsMenuItemSchema = createInsertSchema(cmsMenuItems).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  quotations: many(quotations),
}));

export const quotationsRelations = relations(quotations, ({ one, many }) => ({
  customer: one(customers, {
    fields: [quotations.customerId],
    references: [customers.id],
  }),
  quotationItems: many(quotationItems),
}));

export const quotationItemsRelations = relations(quotationItems, ({ one }) => ({
  quotation: one(quotations, {
    fields: [quotationItems.quotationId],
    references: [quotations.id],
  }),
  product: one(products, {
    fields: [quotationItems.productId],
    references: [products.id],
  }),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  quotationItems: many(quotationItems),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

// CMS Relations
export const cmsUsersRelations = relations(cmsUsers, ({ many }) => ({
  posts: many(cmsPosts),
  media: many(cmsMedia),
}));

export const cmsCategoriesRelations = relations(cmsCategories, ({ one, many }) => ({
  parent: one(cmsCategories, {
    fields: [cmsCategories.parentId],
    references: [cmsCategories.id],
  }),
  children: many(cmsCategories),
  posts: many(cmsPostCategories),
}));

export const cmsTagsRelations = relations(cmsTags, ({ many }) => ({
  posts: many(cmsPostTags),
}));

export const cmsPostsRelations = relations(cmsPosts, ({ one, many }) => ({
  author: one(cmsUsers, {
    fields: [cmsPosts.authorId],
    references: [cmsUsers.id],
  }),
  parent: one(cmsPosts, {
    fields: [cmsPosts.parentId],
    references: [cmsPosts.id],
  }),
  children: many(cmsPosts),
  categories: many(cmsPostCategories),
  tags: many(cmsPostTags),
  comments: many(cmsComments),
}));

export const cmsMediaRelations = relations(cmsMedia, ({ one }) => ({
  uploadedByUser: one(cmsUsers, {
    fields: [cmsMedia.uploadedBy],
    references: [cmsUsers.id],
  }),
}));

export const cmsCommentsRelations = relations(cmsComments, ({ one, many }) => ({
  post: one(cmsPosts, {
    fields: [cmsComments.postId],
    references: [cmsPosts.id],
  }),
  parent: one(cmsComments, {
    fields: [cmsComments.parentId],
    references: [cmsComments.id],
  }),
  replies: many(cmsComments),
}));

export const cmsMenusRelations = relations(cmsMenus, ({ many }) => ({
  items: many(cmsMenuItems),
}));

export const cmsMenuItemsRelations = relations(cmsMenuItems, ({ one, many }) => ({
  menu: one(cmsMenus, {
    fields: [cmsMenuItems.menuId],
    references: [cmsMenus.id],
  }),
  parent: one(cmsMenuItems, {
    fields: [cmsMenuItems.parentId],
    references: [cmsMenuItems.id],
  }),
  children: many(cmsMenuItems),
}));

// Product Category and Brand Types
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// CMS Types
export type CmsUser = typeof cmsUsers.$inferSelect;
export type InsertCmsUser = z.infer<typeof insertCmsUserSchema>;
export type CmsPost = typeof cmsPosts.$inferSelect;
export type InsertCmsPost = z.infer<typeof insertCmsPostSchema>;
export type CmsCategory = typeof cmsCategories.$inferSelect;
export type InsertCmsCategory = z.infer<typeof insertCmsCategorySchema>;
export type CmsTag = typeof cmsTags.$inferSelect;
export type InsertCmsTag = z.infer<typeof insertCmsTagSchema>;
export type CmsMedia = typeof cmsMedia.$inferSelect;
export type InsertCmsMedia = z.infer<typeof insertCmsMediaSchema>;
export type CmsComment = typeof cmsComments.$inferSelect;
export type InsertCmsComment = z.infer<typeof insertCmsCommentSchema>;
export type CmsOption = typeof cmsOptions.$inferSelect;
export type InsertCmsOption = z.infer<typeof insertCmsOptionSchema>;
export type CmsMenu = typeof cmsMenus.$inferSelect;
export type InsertCmsMenu = z.infer<typeof insertCmsMenuSchema>;
export type CmsMenuItem = typeof cmsMenuItems.$inferSelect;
export type InsertCmsMenuItem = z.infer<typeof insertCmsMenuItemSchema>;

export const productsRelations2 = relations(products, ({ many }) => ({
  quotationItems: many(quotationItems),
}));

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type ProductImage = typeof productImages.$inferSelect;
export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type Quotation = typeof quotations.$inferSelect;
export type InsertQuotationItem = z.infer<typeof insertQuotationItemSchema>;
export type QuotationItem = typeof quotationItems.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
