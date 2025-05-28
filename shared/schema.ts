import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  targetLink: text("target_link"),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull().default("STANDARD"),
  graphData: text("graph_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
}).extend({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(2000, "Description must be less than 2000 characters"),
  imageUrl: z.string().url("Please enter a valid image URL"),
  targetLink: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Please enter a valid target URL"
  }),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  type: z.enum(["STANDARD", "GRAPH"]).default("STANDARD"),
  graphData: z.string().optional().refine((val) => {
    if (!val || val.trim() === "") return true;
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, {
    message: "Graph data must be valid JSON"
  }),
});

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;
