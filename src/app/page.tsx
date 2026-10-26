import { BarraCanal } from "@/components/canal";
import { Degrade } from "@/components/degrade";
import { Mapa } from "@/components/mapa";
import { DefsArena } from "@/components/pisadas";
import { Programa } from "@/components/programa";
import { ComoFunciona } from "@/components/secciones/como-funciona";
import { Portada } from "@/components/secciones/portada";
import { QueEs } from "@/components/secciones/que-es";

export default function Inicio() {
  return (
    <>
      <a
        href="#programa"
        className="rotulo sr-solo bg-blanco p-3 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
      >
        Saltar al programa
      </a>
      <Degrade />
      <DefsArena />
      <BarraCanal />
      <Portada />
      <main>
        <QueEs />
        <ComoFunciona />
        <Programa />
        <Mapa />
        <div className="h-[60vh]" />
      </main>
    </>
  );
}
