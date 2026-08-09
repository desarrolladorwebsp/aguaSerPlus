import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/sections/Hero";
import SpecialOffers from "@/components/sections/SpecialOffers";
import ProductsStrip from "@/components/sections/ProductsStrip";
import RecargaBidones from "@/components/sections/RecargaBidones";
import AguaAlcalina from "@/components/sections/AguaAlcalina";
import ContactHelp from "@/components/sections/ContactHelp";
import GoogleReviews from "@/components/sections/GoogleReviews";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full flex-1">
        <Hero />
        <SpecialOffers />
        <ProductsStrip />
        <RecargaBidones />
        <ProductsStrip
          id="dispensadores"
          headingId="dispensadores-strip-heading"
          eyebrow="Dispensadores"
          title="Dispensadores de agua"
          description="Elige el modelo ideal para tu hogar u oficina. Frío, calor y pedestal."
          ctaLabel="Ver más dispensadores"
          ctaHref="/productos?categoria=dispensadores"
          category="dispensadores"
        />
        <AguaAlcalina />
        <ProductsStrip
          id="accesorios"
          headingId="accesorios-strip-heading"
          eyebrow="Accesorios"
          title="Accesorios y repuestos"
          description="Bombas, llaves, bases y más para complementar tu dispensador."
          ctaLabel="Ver más accesorios"
          ctaHref="/productos?categoria=accesorios"
          category="accesorios"
        />
        <ContactHelp />
        <GoogleReviews />
      </main>
      <Footer />
    </>
  );
}
