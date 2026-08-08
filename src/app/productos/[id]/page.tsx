import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ContactHelp from "@/components/sections/ContactHelp";
import ProductDetailView from "@/components/products/ProductDetailView";
import {
  catalogProducts,
  getProductById,
} from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return catalogProducts.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    return { title: "Producto no encontrado | Agua Ser Plus" };
  }
  return {
    title: `${product.name} | Agua Ser Plus`,
    description:
      product.description ??
      `${product.name} — compra online en Agua Ser Plus.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <>
      <Header />
      <main className="w-full flex-1">
        <ProductDetailView product={product} />
        <ContactHelp />
      </main>
      <Footer />
    </>
  );
}
