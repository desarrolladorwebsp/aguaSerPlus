import { cookies } from "next/headers";

export const ADMIN_COOKIE = "aguaser-admin";

export async function isAdminAuthenticated() {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === "1";
}

export function unauthorized() {
  return Response.json(
    { success: false, error: "No autorizado." },
    { status: 401 },
  );
}
