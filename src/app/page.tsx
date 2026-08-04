import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/sections/Hero";
import RecargaBidones from "@/components/sections/RecargaBidones";
import SpecialOffers from "@/components/sections/SpecialOffers";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full flex-1">
        <Hero />
        <RecargaBidones />
        <SpecialOffers />
      </main>
      <Footer />
    </>
  );
}
