import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/sections/Hero";
import SpecialOffers from "@/components/sections/SpecialOffers";
import ProductsStrip from "@/components/sections/ProductsStrip";
import RecargaBidones from "@/components/sections/RecargaBidones";
import AguaAlcalina from "@/components/sections/AguaAlcalina";
import ContactHelp from "@/components/sections/ContactHelp";
import GoogleReviews from "@/components/sections/GoogleReviews";
import { getCatalogProducts } from "@/lib/products";

const HOME_STRIP_LIMIT = 12;

export default async function Home() {
  const catalogProducts = await getCatalogProducts();
  const inStockByCategory = (category: "dispensadores" | "accesorios") =>
    catalogProducts
      .filter((p) => p.inStock !== false && p.category === category)
      .slice(0, HOME_STRIP_LIMIT);
  const offers = catalogProducts.filter((p) => p.featured).slice(0, HOME_STRIP_LIMIT);
  const catalogPreview = catalogProducts
    .filter((p) => p.inStock !== false)
    .slice(0, HOME_STRIP_LIMIT);
  const alkalineProduct = catalogProducts.find(
    (p) => p.id === "agua-alcalina-20l",
  );

  return (
    <>
      <Header />
      <main className="w-full flex-1">
        <Hero />
        <SpecialOffers products={offers} />
        <ProductsStrip tone="blue" items={catalogPreview} />
        <RecargaBidones />
        <ProductsStrip
          id="dispensadores"
          headingId="dispensadores-strip-heading"
          eyebrow="Dispensadores"
          title="Dispensadores de agua"
          description="Elige el modelo ideal para tu hogar u oficina. Frío, calor y pedestal."
          ctaLabel="Ver más dispensadores"
          ctaHref="/productos?categoria=dispensadores"
          items={inStockByCategory("dispensadores")}
          tone="green"
        />
        <AguaAlcalina product={alkalineProduct} />
        <ProductsStrip
          id="accesorios"
          headingId="accesorios-strip-heading"
          eyebrow="Accesorios"
          title="Accesorios y repuestos"
          description="Bombas, llaves, bases y más para complementar tu dispensador."
          ctaLabel="Ver más accesorios"
          ctaHref="/productos?categoria=accesorios"
          items={inStockByCategory("accesorios")}
          tone="yellow"
        />
        <ContactHelp />
        <GoogleReviews />
      </main>
      <Footer />
    </>
  );
}
