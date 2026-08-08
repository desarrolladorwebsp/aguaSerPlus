import {
  put,
  get,
  del,
  list,
  head,
  type PutBlobResult,
} from "@vercel/blob";

/**
 * Cliente de Vercel Blob.
 * Requiere `BLOB_READ_WRITE_TOKEN` en las variables de entorno.
 *
 * El store actual es privado: los archivos no son públicos por URL;
 * hay que leerlos con `getBlob()` / `get()` autenticado.
 */
export function getBlobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not defined. Add it to your environment variables.",
    );
  }

  return token;
}

export function getBlobStoreId() {
  return process.env.BLOB_STORE_ID ?? null;
}

type UploadOptions = {
  contentType?: string;
  addRandomSuffix?: boolean;
  allowOverwrite?: boolean;
};

/**
 * Sube un archivo al Blob store (acceso privado).
 * Uso: `await uploadBlob("productos/foto.jpg", file)`
 */
export async function uploadBlob(
  pathname: string,
  body: Parameters<typeof put>[1],
  options: UploadOptions = {},
): Promise<PutBlobResult> {
  return put(pathname, body, {
    access: "private",
    token: getBlobToken(),
    contentType: options.contentType,
    addRandomSuffix: options.addRandomSuffix,
    allowOverwrite: options.allowOverwrite,
  });
}

/**
 * Lee un blob privado por pathname o URL.
 */
export async function getBlob(
  pathnameOrUrl: string,
  options?: { ifNoneMatch?: string; useCache?: boolean },
) {
  return get(pathnameOrUrl, {
    access: "private",
    token: getBlobToken(),
    ifNoneMatch: options?.ifNoneMatch,
    useCache: options?.useCache,
  });
}

export { del as deleteBlob, list as listBlobs, head as headBlob };
