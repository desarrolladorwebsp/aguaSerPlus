import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import AguaAlcalinaPromo from "@/components/sections/AguaAlcalinaPromo";

export const metadata = {
  title: "Agua Alcalina | Agua Ser Plus - Únicos en Chile",
  description:
    "Descubre los beneficios del agua alcalina ionizada. Somos los únicos en Chile que ofrecemos agua alcalina pura con tecnología avanzada de desinfección con ozono.",
};

export default function AguaAlcalinaPage() {
  return (
    <>
      <Header />
      <main className="w-full flex-1">
        <AguaAlcalinaPromo />
      </main>
      <Footer />
    </>
  );
}
