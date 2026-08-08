import type { Metadata } from "next";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ContactHelp from "@/components/sections/ContactHelp";
import NuestraPlantaView from "@/components/planta/NuestraPlantaView";

export const metadata: Metadata = {
  title: "Nuestra Planta | Agua Ser Plus",
  description:
    "Conoce el proceso de purificación y envasado de Agua Ser Plus, y por qué nuestros envases PET son reutilizables y 100% reciclables.",
};

export default function NuestraPlantaPage() {
  return (
    <>
      <Header />
      <main className="w-full flex-1">
        <NuestraPlantaView />
        <ContactHelp />
      </main>
      <Footer />
    </>
  );
}
