import { getSql } from "@/lib/neon";
import type { AdminProduct, AdminProductStatus } from "@/lib/admin/types";
import { seedProducts } from "@/lib/admin/mock-data";

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
    updatedAt: row.updated_at,
  };
}

let schemaReady: Promise<void> | null = null;

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
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

export async function listProductsFromDb(): Promise<AdminProduct[]> {
  await ensureProductSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT
      id, title, sku, price_normal, price_sale, stock,
      category_id, images, status, description, updated_at
    FROM products
    ORDER BY updated_at DESC
  `) as ProductRow[];
  return rows.map(mapRow);
}

export async function seedProductsIfEmpty() {
  await ensureProductSchema();
  const sql = getSql();
  const countRows = (await sql`SELECT COUNT(*)::int AS count FROM products`) as Array<{
    count: number;
  }>;
  if ((countRows[0]?.count ?? 0) > 0) return;

  for (const product of seedProducts) {
    await sql`
      INSERT INTO products (
        id, title, sku, price_normal, price_sale, stock,
        category_id, images, status, description, updated_at
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
        ${product.updatedAt}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

export async function syncCatalogProductsToDb() {
  await ensureProductSchema();
  const sql = getSql();

  await sql`DELETE FROM products`;

  for (const product of seedProducts) {
    await sql`
      INSERT INTO products (
        id, title, sku, price_normal, price_sale, stock,
        category_id, images, status, description, updated_at
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
        ${product.updatedAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        sku = EXCLUDED.sku,
        price_normal = EXCLUDED.price_normal,
        price_sale = EXCLUDED.price_sale,
        stock = EXCLUDED.stock,
        category_id = EXCLUDED.category_id,
        images = EXCLUDED.images,
        status = EXCLUDED.status,
        description = EXCLUDED.description,
        updated_at = EXCLUDED.updated_at
    `;
  }

  return listProductsFromDb();
}

export async function createProductInDb(
  product: AdminProduct,
): Promise<AdminProduct> {
  await ensureProductSchema();
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO products (
      id, title, sku, price_normal, price_sale, stock,
      category_id, images, status, description, updated_at
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
      ${product.updatedAt}
    )
    RETURNING
      id, title, sku, price_normal, price_sale, stock,
      category_id, images, status, description, updated_at
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
      category_id, images, status, description, updated_at
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
      updated_at = ${next.updatedAt}
    WHERE id = ${id}
    RETURNING
      id, title, sku, price_normal, price_sale, stock,
      category_id, images, status, description, updated_at
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
