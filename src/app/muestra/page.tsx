import type { Metadata } from "next";
import { ArtistasIntenso } from "@/components/intenso/artistas";
import { CintaSuperior, FranjasCruzadas, Hero, Nav } from "@/components/intenso/hero";
import { ProgramaIntenso } from "@/components/intenso/programa";

export const metadata: Metadata = {
  title: "Ritmo Blanco · muestra de la versión intensa",
};

/* Muestra para aprobar la dirección: portada, artistas y programa */
export default function Muestra() {
  return (
    <div className="sobre-oscuro min-h-screen bg-noche text-blanco">
      {/* Esta página no usa la barra fija del celular */}
      <style>{"body{padding-bottom:0;background:#2a0c17}"}</style>
      <CintaSuperior />
      <Nav />
      <Hero />
      <FranjasCruzadas />
      <main>
        <ArtistasIntenso />
        <ProgramaIntenso />
      </main>
      <footer className="rotulo border-t border-blanco/10 px-5 py-10 text-center text-blanco/60">
        Muestra · portada, artistas y programa
      </footer>
    </div>
  );
}
