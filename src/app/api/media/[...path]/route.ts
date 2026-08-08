import { NextResponse } from "next/server";
import { getBlob } from "@/lib/blob";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { path } = await context.params;
  const pathname = path.map(decodeURIComponent).join("/");

  if (!pathname || pathname.includes("..")) {
    return NextResponse.json({ error: "Ruta inválida." }, { status: 400 });
  }

  try {
    const result = await getBlob(pathname);
    if (!result || result.statusCode !== 200 || !result.stream) {
      return NextResponse.json({ error: "Imagen no encontrada." }, { status: 404 });
    }

    const headers = new Headers();
    headers.set(
      "Content-Type",
      result.blob.contentType || "application/octet-stream",
    );
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    if (result.blob.size) {
      headers.set("Content-Length", String(result.blob.size));
    }

    return new NextResponse(result.stream, { status: 200, headers });
  } catch (error) {
    console.error("media proxy error", error);
    return NextResponse.json(
      { error: "No se pudo leer la imagen." },
      { status: 404 },
    );
  }
}
