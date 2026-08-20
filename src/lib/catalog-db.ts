import { getSql } from "@/lib/neon";
import type { ProductCategory, ProductColorOption, ProductOffer, ProductSpec } from "@/types/product";

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

const FALLBACK_IMAGE = "/products/hero-jug-splash.png";

const CATEGORY_MAP: Record<string, ProductCategory> = {
  recargas: "recargas",
  combos: "combos",
  dispensadores: "dispensadores",
  bombas: "bombas",
  filtracion: "filtracion",
  accesorios: "accesorios",
  consumibles: "consumibles",
  servicios: "servicios",
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

function toCategory(categoryId: string): ProductCategory {
  return CATEGORY_MAP[categoryId] ?? "recargas";
}

function toBadge(product: ProductRow): {
  label: string;
  tone: "green" | "blue" | "yellow";
} {
  if (product.stock <= 0 || product.status === "inactive") {
    return { label: "Sin stock", tone: "yellow" };
  }

  if (product.price_sale > 0 && product.price_sale < product.price_normal) {
    return { label: "Oferta", tone: "green" };
  }

  return { label: "Disponible", tone: "blue" };
}

function mapRow(row: ProductRow): ProductOffer {
  const images = parseImages(row.images);
  const effectivePrice =
    row.price_sale > 0 && row.price_sale < row.price_normal
      ? row.price_sale
      : row.price_normal;
  const priceBefore = row.price_normal > 0 ? row.price_normal : effectivePrice;
  const badge = toBadge(row);
  const isActive = row.status !== "inactive" && row.stock > 0;

  return {
    id: row.id,
    name: row.title,
    description: row.description ?? undefined,
    priceBefore,
    priceNow: effectivePrice,
    badge: badge.label,
    badgeTone: badge.tone,
    image: images[0] ?? FALLBACK_IMAGE,
    images,
    tint: "blue",
    category: toCategory(row.category_id),
    inStock: isActive,
    featured: false,
    tags: [],
    characteristics: parseJsonArray<ProductSpec>(row.characteristics),
    colors: parseJsonArray<ProductColorOption>(row.colors),
  };
}

async function ensureProductSchema() {
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
}

export async function getProductsFromDb(): Promise<ProductOffer[]> {
  try {
    await ensureProductSchema();
    const sql = getSql();
    const rows = (await sql`
      SELECT
        id, title, sku, price_normal, price_sale, stock,
        category_id, images, status, description, characteristics, colors, updated_at
      FROM products
      WHERE status != 'inactive'
      ORDER BY updated_at DESC
    `) as ProductRow[];

    return rows.map(mapRow);
  } catch (error) {
    console.error("Unable to load products from database", error);
    return [];
  }
}
