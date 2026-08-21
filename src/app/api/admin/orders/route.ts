import { NextResponse } from "next/server";
import { listOrdersFromDb } from "@/lib/admin/orders-db";
import { isAdminAuthenticated, unauthorized } from "@/lib/admin/session";

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();

  try {
    const orders = await listOrdersFromDb();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("list orders error", error);
    return NextResponse.json(
      { success: false, error: "No se pudieron cargar los pedidos." },
      { status: 500 },
    );
  }
}
