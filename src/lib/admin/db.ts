import { getSql } from "@/lib/neon";
import type {
  AdminCategory,
  AdminProduct,
  AdminProductStatus,
} from "@/lib/admin/types";
import { seedCategories } from "@/lib/admin/mock-data";
import type { ProductColorOption, ProductSpec } from "@/types/product";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  updated_at: string;
};

type ProductRow = {
  id: string;
  title: string;
  sku: string;
  price_normal: number;
  price_sale: number;
  stock: number;
  category_id: string;
  images: string[] | string;
  status: string;
  description: string | null;
  characteristics: unknown;
  colors: unknown;
  updated_at: string;
};

function parseImages(value: ProductRow["images"]): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      if (value.trim()) return [value.trim()];
    }
  }
  return [];
}

function parseJsonArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed as T[];
    } catch {
      return [];
    }
  }
  return [];
}

function mapCategoryRow(row: CategoryRow): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
  };
}

function mapRow(row: ProductRow): AdminProduct {
  return {
    id: row.id,
    title: row.title,
    sku: row.sku,
    priceNormal: Number(row.price_normal) || 0,
    priceSale: Number(row.price_sale) || 0,
    stock: Number(row.stock) || 0,
    categoryId: row.category_id,
    images: parseImages(row.images),
    status: (row.status === "inactive" ? "inactive" : "active") as AdminProductStatus,
    description: row.description ?? undefined,
    characteristics: parseJsonArray<ProductSpec>(row.characteristics),
    colors: parseJsonArray<ProductColorOption>(row.colors),
    updatedAt: row.updated_at,
  };
}

let schemaReady: Promise<void> | null = null;
let categorySchemaReady: Promise<void> | null = null;

export async function ensureProductSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          sku TEXT NOT NULL UNIQUE,
          price_normal INTEGER NOT NULL DEFAULT 0,
          price_sale INTEGER NOT NULL DEFAULT 0,
          stock INTEGER NOT NULL DEFAULT 0,
          category_id TEXT NOT NULL,
          images JSONB NOT NULL DEFAULT '[]'::jsonb,
          status TEXT NOT NULL DEFAULT 'active',
          description TEXT,
          characteristics JSONB NOT NULL DEFAULT '[]'::jsonb,
          colors JSONB NOT NULL DEFAULT '[]'::jsonb,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS characteristics JSONB NOT NULL DEFAULT '[]'::jsonb`;
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS colors JSONB NOT NULL DEFAULT '[]'::jsonb`;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

export async function ensureCategorySchema() {
  if (!categorySchemaReady) {
    categorySchemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_idx ON categories (slug)`;
    })().catch((error) => {
      categorySchemaReady = null;
      throw error;
    });
  }
  await categorySchemaReady;
}

export async function listCategoriesFromDb(): Promise<AdminCategory[]> {
  await ensureCategorySchema();
  await seedDefaultCategoriesIfEmpty();
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, slug, description, updated_at
    FROM categories
    ORDER BY name ASC, updated_at DESC
  `) as CategoryRow[];
  return rows.map(mapCategoryRow);
}

export async function createCategoryInDb(
  input: Omit<AdminCategory, "id">,
): Promise<AdminCategory> {
  await ensureCategorySchema();
  const sql = getSql();
  const id = `cat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const rows = (await sql`
    INSERT INTO categories (id, name, slug, description, updated_at)
    VALUES (${id}, ${input.name.trim()}, ${input.slug.trim()}, ${input.description.trim()}, NOW())
    RETURNING id, name, slug, description, updated_at
  `) as CategoryRow[];
  return mapCategoryRow(rows[0]);
}

export async function seedDefaultCategoriesIfEmpty() {
  await ensureCategorySchema();
  const sql = getSql();
  const countRows = (await sql`SELECT COUNT(*)::int AS count FROM categories`) as Array<{
    count: number;
  }>;
  if ((countRows[0]?.count ?? 0) > 0) return;

  for (const category of seedCategories) {
    await sql`
      INSERT INTO categories (id, name, slug, description, updated_at)
      VALUES (
        ${category.id},
        ${category.name},
        ${category.slug},
        ${category.description},
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

export async function updateCategoryInDb(
  id: string,
  patch: Partial<AdminCategory>,
): Promise<AdminCategory> {
  await ensureCategorySchema();
  const sql = getSql();
  const rows = (await sql`
    UPDATE categories
    SET
      name = ${patch.name?.trim() ?? ""},
      slug = ${patch.slug?.trim() ?? ""},
      description = ${patch.description?.trim() ?? ""},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, name, slug, description, updated_at
  `) as CategoryRow[];
  if (!rows[0]) {
    throw new Error("Categoría no encontrada.");
  }
  return mapCategoryRow(rows[0]);
}

export async function deleteCategoryInDb(id: string): Promise<void> {
  await ensureCategorySchema();
  const sql = getSql();
  const linkedProducts = (await sql`
    SELECT COUNT(*)::int AS count
    FROM products
    WHERE category_id = ${id}
  `) as Array<{ count: number }>;
  if ((linkedProducts[0]?.count ?? 0) > 0) {
    throw new Error("No se puede eliminar una categoría con productos asociados.");
  }
  await sql`DELETE FROM categories WHERE id = ${id}`;
}

export async function listProductsFromDb(): Promise<AdminProduct[]> {
  await ensureProductSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT
      id, title, sku, price_normal, price_sale, stock,
      category_id, images, status, description, characteristics, colors, updated_at
    FROM products
    ORDER BY updated_at DESC
  `) as ProductRow[];
  return rows.map(mapRow);
}

export async function createProductInDb(
  product: AdminProduct,
): Promise<AdminProduct> {
  await ensureProductSchema();
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO products (
      id, title, sku, price_normal, price_sale, stock,
      category_id, images, status, description, characteristics, colors, updated_at
    ) VALUES (
      ${product.id},
      ${product.title},
      ${product.sku},
      ${product.priceNormal},
      ${product.priceSale},
      ${product.stock},
      ${product.categoryId},
      ${JSON.stringify(product.images)},
      ${product.status},
      ${product.description ?? null},
      ${JSON.stringify(product.characteristics ?? [])},
      ${JSON.stringify(product.colors ?? [])},
      ${product.updatedAt}
    )
    RETURNING
      id, title, sku, price_normal, price_sale, stock,
      category_id, images, status, description, characteristics, colors, updated_at
  `) as ProductRow[];
  return mapRow(rows[0]);
}

export async function updateProductInDb(
  id: string,
  patch: Partial<Omit<AdminProduct, "id">>,
): Promise<AdminProduct | null> {
  await ensureProductSchema();
  const sql = getSql();
  const existingRows = (await sql`
    SELECT
      id, title, sku, price_normal, price_sale, stock,
      category_id, images, status, description, characteristics, colors, updated_at
    FROM products
    WHERE id = ${id}
    LIMIT 1
  `) as ProductRow[];
  const existing = existingRows[0];
  if (!existing) return null;

  const current = mapRow(existing);
  const next: AdminProduct = {
    ...current,
    ...patch,
    id: current.id,
    updatedAt: new Date().toISOString(),
  };

  const rows = (await sql`
    UPDATE products SET
      title = ${next.title},
      sku = ${next.sku},
      price_normal = ${next.priceNormal},
      price_sale = ${next.priceSale},
      stock = ${next.stock},
      category_id = ${next.categoryId},
      images = ${JSON.stringify(next.images)},
      status = ${next.status},
      description = ${next.description ?? null},
      characteristics = ${JSON.stringify(next.characteristics ?? [])},
      colors = ${JSON.stringify(next.colors ?? [])},
      updated_at = ${next.updatedAt}
    WHERE id = ${id}
    RETURNING
      id, title, sku, price_normal, price_sale, stock,
      category_id, images, status, description, characteristics, colors, updated_at
  `) as ProductRow[];

  return mapRow(rows[0]);
}

export async function deleteProductFromDb(id: string): Promise<boolean> {
  await ensureProductSchema();
  const sql = getSql();
  const rows = (await sql`
    DELETE FROM products WHERE id = ${id} RETURNING id
  `) as Array<{ id: string }>;
  return rows.length > 0;
}
