import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
