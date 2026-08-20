import { NextResponse } from "next/server";
import { listProductsFromDb, seedProductsIfEmpty } from "@/lib/admin/db";
import type { AdminProduct } from "@/lib/admin/types";

function toPublicProduct(product: AdminProduct) {
  const effectivePrice =
    product.priceSale > 0 && product.priceSale < product.priceNormal
      ? product.priceSale
      : product.priceNormal;

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    priceNormal: product.priceNormal,
    priceSale: product.priceSale,
    priceNow: effectivePrice,
    stock: product.stock,
    categoryId: product.categoryId,
    images: product.images,
    status: product.status,
  };
}

export async function GET() {
  try {
    await seedProductsIfEmpty();
    const products = await listProductsFromDb();
    return NextResponse.json({
      success: true,
      data: products
        .filter((product) => product.status !== "inactive")
        .map(toPublicProduct),
    });
  } catch (error) {
    console.error("list public products error", error);
    return NextResponse.json(
      { success: false, error: "No se pudieron cargar los productos." },
      { status: 500 },
    );
  }
}
