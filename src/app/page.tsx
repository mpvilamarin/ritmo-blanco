import { ComoFunciona, DesdeCasa } from "@/components/rb/casa-como";
import { Cintas } from "@/components/rb/cintas";
import { Cuenta } from "@/components/rb/cuenta";
import { Hero } from "@/components/rb/hero";
import { LineUp } from "@/components/rb/lineup";
import { Mapa } from "@/components/rb/mapa";
import { BarraFlotante, Pie } from "@/components/rb/pie";
import { Programa } from "@/components/rb/programa";
import { QueEs } from "@/components/rb/que-es";
import { Reserva } from "@/components/rb/reserva";
import { Sustentabilidad } from "@/components/rb/sustentabilidad";
import { Rio } from "@/components/rio";

const RECORRIDO = ["top", "cuenta", "que-es"];

/* Página según el diseño de Claude Design (Ritmo Blanco.dc.html), con los datos de programa.json */
export default function Inicio() {
  return (
    <div className="min-h-screen overflow-x-clip bg-blanco">
      <a
        href="#programa"
        className="rotulo sr-solo bg-blanco px-4 py-3 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Saltá al programa
      </a>
      {/* El río atraviesa portada, cuenta regresiva y "Qué es" como una sola capa */}
      <div className="relative isolate">
        <Rio secciones={RECORRIDO} />
        <Hero />
        <Cintas />
        <Cuenta />
        <QueEs />
      </div>
      <main>
        <LineUp />
        <Programa />
        <DesdeCasa />
        <ComoFunciona />
        <Mapa />
        <Sustentabilidad />
        <Reserva />
      </main>
      <Pie />
      <BarraFlotante />
    </div>
  );
}
