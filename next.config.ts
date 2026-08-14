import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cursor Simple Browser y otras ventanas a veces pegan a 127.0.0.1
  // con un Origin distinto; sin esto Next 16 puede aceptar el TCP y no responder.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    unoptimized: true,
  },
  // Evita que el browser/preview abra una ruta vieja de otro proyecto en localhost
  async redirects() {
    return [
      {
        source: "/cotizador",
        destination: "/",
        permanent: false,
      },
      {
        source: "/cotizador/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
