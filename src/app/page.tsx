import { Artistas } from "@/components/artistas";
import { BarraCanal } from "@/components/canal";
import { Degrade } from "@/components/degrade";
import { Mapa } from "@/components/mapa";
import { DefsArena } from "@/components/pisadas";
import { Programa } from "@/components/programa";
import { Banda, Franjas, ReticulaVisible, Separador } from "@/components/recursos";
import { ComoFunciona } from "@/components/secciones/como-funciona";
import { DesdeCasa } from "@/components/secciones/desde-casa";
import { Info, Pie } from "@/components/secciones/info";
import { Portada } from "@/components/secciones/portada";
import { QueEs } from "@/components/secciones/que-es";
import { Rastro } from "@/components/secciones/rastro";
import { sitio } from "@/lib/programa";

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
      <ReticulaVisible />
      <DefsArena />
      <BarraCanal />
      <Portada />
      <Franjas textos={sitio.franjas} />
      <main>
        <QueEs />
        <ComoFunciona />
        <Banda id="artistas" etiqueta="artistas-titulo" color="#f2dabd" modo={[3, 7]} className="mt-24 md:mt-36">
          <Artistas />
        </Banda>
        <Programa />
        <Separador modo={[2, 5]} />
        <Mapa />
        <Separador modo={[4, 7]} fase={0.6} />
        <DesdeCasa />
        <Banda id="rastro" etiqueta="rastro-titulo" color="#b3a5ba" modo={[2, 6]} className="mt-20">
          <Rastro />
        </Banda>
        <Info />
      </main>
      <Pie />
    </>
  );
}
