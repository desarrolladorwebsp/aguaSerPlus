/**
 * Tipos compartidos de la aplicación.
 * Se irán ampliando a medida que se definan los modelos de dominio.
 */

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  success: boolean;
};

export type { ProductOffer } from "./product";
export { formatClp, getDiscountPercent } from "./product";

