import { pages, type Page, type InsertPage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getPage(id: number): Promise<Page | undefined>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  getAllPages(): Promise<Page[]>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: number, page: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getPage(id: number): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page || undefined;
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page || undefined;
  }

  async getAllPages(): Promise<Page[]> {
    return await db.select().from(pages).orderBy(pages.createdAt);
  }

  async createPage(insertPage: InsertPage): Promise<Page> {
    const [page] = await db
      .insert(pages)
      .values(insertPage)
      .returning();
    return page;
  }

  async updatePage(id: number, updateData: Partial<InsertPage>): Promise<Page | undefined> {
    const [page] = await db
      .update(pages)
      .set(updateData)
      .where(eq(pages.id, id))
      .returning();
    return page || undefined;
  }

  async deletePage(id: number): Promise<boolean> {
    const result = await db.delete(pages).where(eq(pages.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
