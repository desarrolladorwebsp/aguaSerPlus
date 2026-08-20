import { NextResponse } from "next/server";
import { createCategoryInDb, listCategoriesFromDb } from "@/lib/admin/db";
import { isAdminAuthenticated, unauthorized } from "@/lib/admin/session";
import type { AdminCategory } from "@/lib/admin/types";

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();

  try {
    const categories = await listCategoriesFromDb();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("list categories error", error);
    return NextResponse.json(
      { success: false, error: "No se pudieron cargar las categorías." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  let body: Partial<AdminCategory>;
  try {
    body = (await request.json()) as Partial<AdminCategory>;
  } catch {
    return NextResponse.json(
      { success: false, error: "JSON inválido." },
      { status: 400 },
    );
  }

  const name = body.name?.trim() ?? "";
  const slug = (body.slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")).trim();

  if (!name || !slug) {
    return NextResponse.json(
      { success: false, error: "Nombre y slug son obligatorios." },
      { status: 400 },
    );
  }

  try {
    const created = await createCategoryInDb({
      name,
      slug,
      description: body.description?.trim() ?? "",
    });
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("create category error", error);
    return NextResponse.json(
      { success: false, error: "No se pudo crear la categoría." },
      { status: 500 },
    );
  }
}
