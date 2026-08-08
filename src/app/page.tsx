import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/sections/Hero";
import SpecialOffers from "@/components/sections/SpecialOffers";
import ProductsStrip from "@/components/sections/ProductsStrip";
import RecargaBidones from "@/components/sections/RecargaBidones";
import AguaAlcalina from "@/components/sections/AguaAlcalina";
import ContactHelp from "@/components/sections/ContactHelp";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full flex-1">
        <Hero />
        <SpecialOffers />
        <ProductsStrip />
        <RecargaBidones />
        <AguaAlcalina />
        <ContactHelp />
      </main>
      <Footer />
    </>
  );
}
