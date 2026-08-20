import { NextResponse } from "next/server";
import { syncCatalogProductsToDb } from "@/lib/admin/db";
import { isAdminAuthenticated, unauthorized } from "@/lib/admin/session";

export async function POST() {
  if (!(await isAdminAuthenticated())) return unauthorized();

  try {
    const products = await syncCatalogProductsToDb();

    return NextResponse.json({
      success: true,
      message: "Catálogo sincronizado con la base de datos.",
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("sync catalog products error", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo sincronizar el catálogo.",
      },
      { status: 500 },
    );
  }
}
