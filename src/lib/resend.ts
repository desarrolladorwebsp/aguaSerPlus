import { Resend } from "resend";

/**
 * Cliente de Resend para envío de correos.
 * Requiere `RESEND_API_KEY` en las variables de entorno.
 */
export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not defined. Add it to your environment variables.",
    );
  }

  return new Resend(apiKey);
}

export type ResendClient = ReturnType<typeof getResend>;
