import type { Metadata } from "next";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ProductsCatalog from "@/components/products/ProductsCatalog";

export const metadata: Metadata = {
  title: "Productos | Agua Ser Plus",
  description:
    "Catálogo de recargas, dispensadores y accesorios Agua Ser Plus. Filtra y busca productos con entrega en Santiago.",
};

export default function ProductosPage() {
  return (
    <>
      <Header />
      <main className="w-full flex-1">
        <ProductsCatalog />
      </main>
      <Footer />
    </>
  );
}
