import { Arena } from "../arena";
import { Cuenta } from "../cuenta";
import { FotoPendiente, Guino, Logo, Signo } from "../signos";
import { Titulo } from "../titulo";
import { CANALES, programa, sitio } from "@/lib/programa";

/* Curva de Lissajous 3:2: el trazo que cruza la portada, como un gesto de arena */
const LISSAJOUS = Array.from({ length: 241 }, (_, i) => {
  const t = (i / 240) * Math.PI * 2;
  return `${i ? "L" : "M"}${Math.sin(3 * t + Math.PI / 2).toFixed(3)} ${Math.sin(2 * t).toFixed(3)}`;
}).join("");

/*
  Portada: el nombre enorme sangrando por los bordes (bold/light, mismo ancho),
  una foto en collage que lo pisa y la cuenta regresiva.
*/
export function Portada() {
  const [antes, guino, despues] = sitio.titular;
  return (
    <header id="inicio" className="relative overflow-x-clip pt-6 md:pt-10 lg:pt-24">
      <div className="reticula">
        <div className="col-span-full flex items-start justify-between gap-4">
          <Logo className="w-24 md:w-32 lg:hidden" />
          <p className="rotulo ml-auto text-right">
            {sitio.fechas_largas}
            <br />
            {programa.sede.split(",")[0]}
          </p>
        </div>
      </div>

      <div className="relative mt-8 md:mt-10">
        <div className="-ml-[3vw] w-[106vw] lg:ml-[3rem] lg:w-[72vw]">
          <Titulo as="h1" fuerte="Ritmo" suave="Blanco" max={250} className="text-[28vw]" />
        </div>
        <div className="absolute top-[42%] right-[4%] w-[44%] -rotate-[4deg] md:w-[32%] lg:top-[10%] lg:right-[7%] lg:w-[22%]">
          <div className="relative aspect-[4/5] overflow-hidden">
            <FotoPendiente className="absolute inset-0" />
            <div className="absolute inset-0 opacity-90">
              <Arena particulas={9000} />
            </div>
          </div>
        </div>
        <svg
          aria-hidden
          viewBox="-1.15 -1.15 2.3 2.3"
          className="pointer-events-none absolute top-[8%] left-[36%] w-[42%] rotate-[14deg] mix-blend-multiply md:left-[40%] lg:top-[-6%] lg:left-[48%] lg:w-[30%]"
        >
          <path d={LISSAJOUS} fill="none" stroke="#e1b0c1" strokeWidth="0.07" strokeLinecap="round" strokeDasharray="0.001 0.035" />
          <path d={LISSAJOUS} fill="none" stroke="#e1b0c1" strokeWidth="0.025" opacity="0.8" />
        </svg>
      </div>

      <div className="reticula mt-28 gap-y-12 md:mt-20 lg:mt-12">
        <div className="col-span-full md:col-span-6 lg:col-span-6">
          <p className="rotulo mb-4">{sitio.bajada}</p>
          <p className="font-display text-[2rem] leading-[1.02] font-bold uppercase md:text-5xl">
            {antes} <Guino>{guino}</Guino> <span className="font-light">{despues}</span>
          </p>
          <p className="rotulo mt-6">Entrada {programa.entrada.toLowerCase()}</p>
          <a
            href="#canales"
            className="rotulo mt-6 inline-flex items-center gap-3 bg-vino px-5 py-3.5 text-[0.75rem] text-blanco transition-colors hover:bg-lila-oscuro"
          >
            {sitio.cta}
            <span className="flex gap-1">
              {CANALES.map((c) => (
                <Signo key={c} canal={c} className="size-3.5" />
              ))}
            </span>
          </a>
        </div>
        <div className="col-span-full filete pt-5 md:col-span-8 lg:col-span-5 lg:col-start-8 lg:self-end">
          <Cuenta />
        </div>
      </div>
    </header>
  );
}
