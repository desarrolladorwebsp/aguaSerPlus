/**
 * Utilidades frontend para Klap Checkout Flex.
 */

const DEFAULT_SCRIPT =
  process.env.NODE_ENV === "production"
    ? "https://mcdesaqa.cl/pagos/checkout-flex/v1/main.min.js"
    : "https://sandbox.mcdesaqa.cl/pagos/checkout-flex/v1/main.min.js";

declare global {
  interface Window {
    KLAP_FLEX?: {
      init: (options: {
        orderId: string;
        useModal?: boolean;
        debug?: boolean;
      }) => void;
    };
  }
}

export function getKlapFlexScriptUrl() {
  return (
    process.env.NEXT_PUBLIC_KLAP_FLEX_SCRIPT_URL?.trim() || DEFAULT_SCRIPT
  );
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-klap-flex="1"]`,
    );
    if (existing) {
      if (window.KLAP_FLEX) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("No se pudo cargar el script de Klap.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.klapFlex = "1";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("No se pudo cargar el script de Klap Checkout Flex."));
    document.body.appendChild(script);
  });
}

/**
 * Carga el script sandbox/prod e inicializa el modal de pago.
 */
export async function openKlapCheckoutFlex(orderId: string) {
  if (!orderId) {
    throw new Error("Falta order_id de Klap.");
  }

  await loadScript(getKlapFlexScriptUrl());

  if (!window.KLAP_FLEX?.init) {
    throw new Error("KLAP_FLEX no está disponible en el navegador.");
  }

  window.KLAP_FLEX.init({
    orderId,
    useModal: true,
  });
}
