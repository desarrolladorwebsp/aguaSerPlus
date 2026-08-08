import { NextResponse } from "next/server";
import {
  createProductInDb,
  listProductsFromDb,
  seedProductsIfEmpty,
} from "@/lib/admin/db";
import { isAdminAuthenticated, unauthorized } from "@/lib/admin/session";
import type { AdminProduct } from "@/lib/admin/types";

function newId() {
  return `prd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();

  try {
    await seedProductsIfEmpty();
    const products = await listProductsFromDb();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("list products error", error);
    return NextResponse.json(
      { success: false, error: "No se pudieron cargar los productos." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  let body: Partial<AdminProduct>;
  try {
    body = (await request.json()) as Partial<AdminProduct>;
  } catch {
    return NextResponse.json(
      { success: false, error: "JSON inválido." },
      { status: 400 },
    );
  }

  const title = body.title?.trim() ?? "";
  const sku = body.sku?.trim() ?? "";
  if (!title || !sku) {
    return NextResponse.json(
      { success: false, error: "Título y SKU son obligatorios." },
      { status: 400 },
    );
  }

  const product: AdminProduct = {
    id: newId(),
    title,
    sku,
    priceNormal: Math.max(0, Number(body.priceNormal) || 0),
    priceSale: Math.max(0, Number(body.priceSale) || 0),
    stock: Math.max(0, Number(body.stock) || 0),
    categoryId: body.categoryId?.trim() || "recargas",
    images: Array.isArray(body.images)
      ? body.images.filter((src): src is string => Boolean(src?.trim()))
      : [],
    status: body.status === "inactive" ? "inactive" : "active",
    description: body.description?.trim() || undefined,
    updatedAt: new Date().toISOString(),
  };

  if (product.images.length === 0) {
    product.images = ["/products/hero-jug-splash.png"];
  }

  try {
    const created = await createProductInDb(product);
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("create product error", error);
    return NextResponse.json(
      { success: false, error: "No se pudo crear el producto." },
      { status: 500 },
    );
  }
}
