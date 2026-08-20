import { NextResponse } from "next/server";
import {
  deleteCategoryInDb,
  updateCategoryInDb,
} from "@/lib/admin/db";
import { isAdminAuthenticated, unauthorized } from "@/lib/admin/session";
import type { AdminCategory } from "@/lib/admin/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const { id } = await context.params;

  let body: Partial<AdminCategory>;
  try {
    body = (await request.json()) as Partial<AdminCategory>;
  } catch {
    return NextResponse.json(
      { success: false, error: "JSON inválido." },
      { status: 400 },
    );
  }

  try {
    const updated = await updateCategoryInDb(id, {
      name: body.name?.trim(),
      slug: body.slug?.trim(),
      description: body.description?.trim(),
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("update category error", error);
    return NextResponse.json(
      { success: false, error: "No se pudo actualizar la categoría." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const { id } = await context.params;

  try {
    await deleteCategoryInDb(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("delete category error", error);
    return NextResponse.json(
      { success: false, error: "No se pudo eliminar la categoría." },
      { status: 500 },
    );
  }
}
