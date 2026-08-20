import { NextResponse } from "next/server";
import { isAdminAuthenticated, unauthorized } from "@/lib/admin/session";

export async function POST() {
  if (!(await isAdminAuthenticated())) return unauthorized();

  return NextResponse.json(
    {
      success: false,
      error: "La sincronización de catálogo ha sido deshabilitada.",
    },
    { status: 410 },
  );
}
