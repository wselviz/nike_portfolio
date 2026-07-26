import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const portfolioConfigs = sqliteTable("portfolio_configs", {
  id: integer("id").primaryKey(),
  manifestJson: text("manifest_json").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: text("updated_by").notNull(),
});

export const portfolioAdmins = sqliteTable("portfolio_admins", {
  email: text("email").primaryKey(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
