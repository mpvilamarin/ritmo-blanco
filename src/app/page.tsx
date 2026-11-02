import { ComoFunciona, DesdeCasa } from "@/components/rb/casa-como";
import { Cuenta } from "@/components/rb/cuenta";
import { Cabecera, Hero } from "@/components/rb/hero";
import { LineUp } from "@/components/rb/lineup";
import { Mapa } from "@/components/rb/mapa";
import { CreaTuPatron } from "@/components/rb/placa";
import { Pie } from "@/components/rb/pie";
import { Programa } from "@/components/rb/programa";
import { QueEs } from "@/components/rb/que-es";
import { Reserva } from "@/components/rb/reserva";
import { Sustentabilidad } from "@/components/rb/sustentabilidad";

/*
  Recorrido: experiencia, artistas, programa e información para asistir.
  El orden alterna blanco y color (ver espaciado.css): nunca dos bandas de color juntas.
*/
export default function Inicio() {
  return (
    <div className="min-h-screen overflow-x-clip bg-blanco">
      <a
        href="#programa"
        className="rotulo sr-solo bg-blanco px-4 py-3.5 focus:not-sr-only focus:flex focus:min-h-11 focus:items-center focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Saltá al programa
      </a>
      <Cabecera />
      <div className="relative isolate">
        <Hero />
      </div>
      <main>
        <QueEs />
        <CreaTuPatron />
        <ComoFunciona />
        <Cuenta />
        <LineUp />
        <Programa />
        <DesdeCasa />
        <Mapa />
        <Sustentabilidad />
        <Reserva />
      </main>
      <Pie />
    </div>
  );
}
