import { neon } from "@neondatabase/serverless";

/**
 * Cliente SQL de Neon (Postgres serverless).
 * Requiere `DATABASE_URL` en las variables de entorno.
 */
export function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not defined. Add it to your environment variables.",
    );
  }

  return neon(databaseUrl);
}

export type SqlClient = ReturnType<typeof getSql>;
