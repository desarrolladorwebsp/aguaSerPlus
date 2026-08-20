import { NextResponse } from "next/server";
import { deleteProductFromDb, updateProductInDb } from "@/lib/admin/db";
import { isAdminAuthenticated, unauthorized } from "@/lib/admin/session";
import type { AdminProduct } from "@/lib/admin/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const { id } = await context.params;

  let body: Partial<AdminProduct>;
  try {
    body = (await request.json()) as Partial<AdminProduct>;
  } catch {
    return NextResponse.json(
      { success: false, error: "JSON inválido." },
      { status: 400 },
    );
  }

  try {
    const updated = await updateProductInDb(id, {
      title: body.title?.trim(),
      sku: body.sku?.trim(),
      priceNormal:
        body.priceNormal !== undefined
          ? Math.max(0, Number(body.priceNormal) || 0)
          : undefined,
      priceSale:
        body.priceSale !== undefined
          ? Math.max(0, Number(body.priceSale) || 0)
          : undefined,
      stock:
        body.stock !== undefined
          ? Math.max(0, Number(body.stock) || 0)
          : undefined,
      categoryId: body.categoryId?.trim(),
      images: Array.isArray(body.images)
        ? body.images.filter((src): src is string => Boolean(src?.trim()))
        : undefined,
      status: body.status,
      description: body.description,
      characteristics: Array.isArray(body.characteristics)
        ? body.characteristics
            .filter((item) => Boolean(item?.label && item?.value))
            .map((item) => ({
              label: String(item?.label ?? ""),
              value: String(item?.value ?? ""),
            }))
            .filter((item) => Boolean(item.label && item.value))
        : undefined,
      colors: Array.isArray(body.colors)
        ? body.colors
            .filter((item) => Boolean(item?.name))
            .map((item) => ({
              name: String(item?.name ?? ""),
              codes: String(item?.codes ?? ""),
              swatch: String(item?.swatch ?? item?.codes ?? "#4f46e5"),
            }))
            .filter((item) => Boolean(item.name))
        : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("update product error", error);
    return NextResponse.json(
      { success: false, error: "No se pudo actualizar el producto." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const { id } = await context.params;

  try {
    const ok = await deleteProductFromDb(id);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("delete product error", error);
    return NextResponse.json(
      { success: false, error: "No se pudo eliminar el producto." },
      { status: 500 },
    );
  }
}
