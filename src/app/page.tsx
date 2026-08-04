import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/sections/Hero";
import SpecialOffers from "@/components/sections/SpecialOffers";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SpecialOffers />
      </main>
      <Footer />
    </>
  );
}
