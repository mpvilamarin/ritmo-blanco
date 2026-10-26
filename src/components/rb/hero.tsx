import { Flecha, boton } from "./base";
import { Logo } from "../signos";
import { programa } from "@/lib/programa";

const NAV = [
  ["#lineup", "Line-up"],
  ["#programa", "Programa"],
  ["#como", "Cómo funciona"],
  ["#mapa", "Mapa"],
  ["#sustentabilidad", "Sustentabilidad"],
] as const;

export function Hero() {
  const primero = programa.dias[0];
  return (
    <section id="top" aria-label="Portada" className="relative flex min-h-[min(92vh,880px)] flex-col overflow-hidden bg-rosa">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden className="absolute inset-0 size-full">
        {[
          [250, 0.35],
          [640, 0.45],
          [690, 0.3],
        ].map(([y, o]) => (
          <path
            key={y}
            d={`M0,${y} Q100,${y - 30} 200,${y} T400,${y} T600,${y} T800,${y} T1000,${y} T1200,${y} T1400,${y} T1600,${y}`}
            fill="none"
            stroke="#fff"
            strokeOpacity={o}
            strokeWidth="2"
          />
        ))}
      </svg>

      <nav aria-label="Secciones" className="contenido relative flex items-center gap-8 py-5">
        <a href="#top" aria-label="Ritmo Blanco, inicio" className="flex-none">
          <Logo className="h-9 w-auto" />
        </a>
        <ul className="hidden gap-7 lg:flex">
          {NAV.map(([href, t]) => (
            <li key={href}>
              <a href={href} className="rotulo underline-offset-4 hover:underline">
                {t}
              </a>
            </li>
          ))}
        </ul>
        <a href="#desde-casa" className="rotulo ml-auto hidden items-center gap-2 sm:inline-flex">
          <span className="size-2 rounded-full bg-vino" />
          En vivo
        </a>
        <a href="#reserva" className={`${boton("vino")} ml-auto py-3 sm:ml-0`}>
          Reservá tu lugar
        </a>
      </nav>

      <div className="contenido relative flex flex-1 flex-col items-center justify-center gap-7 py-12 text-center">
        <p className="rotulo">
          Festival silencioso · 14 — 16.11.{primero.fecha.slice(0, 4)} · {programa.sede.split(",")[0]}
        </p>
        <h1>
          <Logo className="block h-auto w-[clamp(220px,34vw,480px)]" />
        </h1>
        <p className="t-2 max-w-[22ch]">
          Tres canales en tus auriculares. <span className="font-normal">Cero parlantes. Tu energía.</span>
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <a href="#reserva" className={boton("vino")}>
            Reservá tu lugar
            <Flecha />
          </a>
          <a href="#lineup" className={boton("claro")}>
            Ver line-up
          </a>
        </div>
      </div>

      <dl className="contenido relative mb-16 grid grid-cols-1 sm:grid-cols-3">
        {[
          ["Cuándo", "14, 15 y 16 de noviembre"],
          ["Horario", primero.horario.replace("–", " a ")],
          ["Cómo", "En el bosque o desde casa"],
        ].map(([r, v]) => (
          <div key={r} className="border-t border-vino py-4 sm:pr-6">
            <dt className="rotulo">{r}</dt>
            <dd className="t-3 mt-1.5">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
