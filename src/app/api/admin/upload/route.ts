import { NextResponse } from "next/server";
import { uploadBlob } from "@/lib/blob";
import { isAdminAuthenticated, unauthorized } from "@/lib/admin/session";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 4.5 * 1024 * 1024; // ~4.5MB

function extensionFor(type: string, filename: string) {
  const fromName = filename.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: "Formulario inválido." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "Debes seleccionar una imagen." },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { success: false, error: "Formato no permitido. Usa JPG, PNG, WEBP o GIF." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { success: false, error: "La imagen supera 4.5 MB." },
      { status: 400 },
    );
  }

  const ext = extensionFor(file.type, file.name);
  const pathname = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const blob = await uploadBlob(pathname, file, {
      contentType: file.type,
      addRandomSuffix: false,
    });

    // Proxy local para servir blobs privados en la tienda/admin
    const mediaUrl = `/api/media/${blob.pathname}`;

    return NextResponse.json({
      success: true,
      data: {
        pathname: blob.pathname,
        url: blob.url,
        mediaUrl,
        contentType: file.type,
        size: file.size,
      },
    });
  } catch (error) {
    console.error("upload blob error", error);
    return NextResponse.json(
      {
        success: false,
        error: "No se pudo subir la imagen a Blob. Revisa el token.",
      },
      { status: 500 },
    );
  }
}
