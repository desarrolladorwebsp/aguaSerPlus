import type { Metadata } from "next";
import Providers from "@/components/shared/Providers";
import { company } from "@/lib/company";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(company.websiteUrl),
  title: {
    default: "Agua Ser Plus | Agua pura a domicilio",
    template: "%s | Agua Ser Plus",
  },
  description:
    "Agua purificada, dispensadores y Club AguaSer con despacho a domicilio en Santiago. La Farfana 1562, Maipú.",
  applicationName: company.tradeName,
  keywords: [
    "agua purificada a domicilio",
    "bidones de agua",
    "dispensadores de agua",
    "agua alcalina",
    "Maipú",
    "Santiago",
  ],
  authors: [{ name: company.tradeName, url: company.websiteUrl }],
  creator: company.tradeName,
  publisher: company.tradeName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/",
    siteName: company.tradeName,
    title: "Agua Ser Plus | Agua pura a domicilio",
    description:
      "Agua purificada, dispensadores y despacho a domicilio en Santiago.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agua Ser Plus | Agua pura a domicilio",
    description:
      "Agua purificada, dispensadores y despacho a domicilio en Santiago.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `tailwind.config = { theme: { extend: {
              colors: {
                brand: { DEFAULT: '#0056a3', secondary: '#0077c8', accent: '#0099dd' },
                green: { DEFAULT: '#1fa97a', soft: '#e6f7f0' },
                yellow: { DEFAULT: '#f0b429', soft: '#fff6db' },
                neutral: '#7a8794',
                surface: '#f4f8fb',
                background: '#ffffff',
                foreground: '#0c2d4a'
              },
              fontFamily: { sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
              boxShadow: {
                soft: '0 18px 50px -24px rgb(0 86 163 / 0.28)',
                lift: '0 22px 40px -20px rgb(12 45 74 / 0.18)'
              }
            } } };`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex w-full min-h-full flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
