import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agua Ser Plus | Agua pura a domicilio",
  description:
    "Agua purificada, dispensadores y Club AguaSer con despacho a domicilio en Santiago. La Farfana 1562, Maipú.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex w-full min-h-full flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
