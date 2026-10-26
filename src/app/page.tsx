import { Degrade } from "@/components/degrade";
import { ReticulaVisible } from "@/components/recursos";
import { Hero } from "@/components/secciones/hero";

/*
  Web rehecha según REFERENCIAS-WEB.md, una sección por vez.
  Hecho: grilla visible y hero. Siguen: franjas, timer, qué es...
*/
export default function Inicio() {
  return (
    <>
      <Degrade />
      <ReticulaVisible />
      <Hero />
      <main className="min-h-[60vh]" />
    </>
  );
}
