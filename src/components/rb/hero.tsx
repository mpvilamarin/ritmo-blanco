"use client";

import { useState } from "react";
import { Arena } from "../arena";
import { BoldLight, Guino, Marca } from "../sistema";
import { Flecha, boton } from "./base";
import { programa } from "@/lib/programa";
import { FECHAS } from "@/lib/rb";

const MENU = [
  ["#programa", "Programa"],
  ["#lineup", "Artistas"],
  ["#mapa", "Mapa"],
  ["#desde-casa", "Desde casa"],
] as const;

/*
  Barra fina: logo a la izquierda (vuelve al inicio), menú al centro y
  "En vivo" en la esquina derecha. En el celular el menú se abre con "Menú".
*/
function Menu() {
  const [abierto, setAbierto] = useState(false);
  return (
    <nav aria-label="Principal" className="relative z-20 border-b border-vino/20 bg-blanco">
      <div className="grid grid-cols-[1fr_auto] items-center gap-6 px-[var(--margen)] py-3 lg:grid-cols-[1fr_auto_1fr]">
        <a href="#top" aria-label="Ritmo Blanco, inicio" className="justify-self-start">
          <Marca tinta="vino" className="w-20 lg:w-24" />
        </a>
        <ul
          id="menu-links"
          className={`${abierto ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col bg-blanco px-[var(--margen)] py-2 lg:static lg:flex lg:flex-row lg:gap-10 lg:bg-transparent lg:p-0`}
        >
          {MENU.map(([href, t]) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setAbierto(false)}
                className="tx-rotulo block border-b border-vino/20 py-4 underline-offset-[6px] hover:underline lg:border-0 lg:py-2"
              >
                {t}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-6 justify-self-end">
          <a href="#desde-casa" className="tx-rotulo hidden items-center gap-2 py-2 underline-offset-[6px] hover:underline sm:flex">
            <span aria-hidden className="size-2 rounded-full bg-vino" />
            En vivo
          </a>
          <a href="#reserva" className={`${boton("vino")} hidden py-2.5 lg:inline-flex`}>
            Reservá
          </a>
          <button
            type="button"
            aria-expanded={abierto}
            aria-controls="menu-links"
            onClick={() => setAbierto(!abierto)}
            className="tx-rotulo flex cursor-pointer items-center gap-2 py-2 lg:hidden"
          >
            <span aria-hidden className="flex w-4 flex-col gap-[3px]">
              <span className={`h-px bg-current transition-transform ${abierto ? "translate-y-[2px] rotate-45" : ""}`} />
              <span className={`h-px bg-current transition-transform ${abierto ? "-translate-y-[2px] -rotate-45" : ""}`} />
            </span>
            Menú
          </button>
        </div>
      </div>
    </nav>
  );
}

/*
  Portada en la dirección del merch (PROVISORIA hasta que esté el KV nuevo):
  fondo blanco con aire, la arena ordenada en anillos (vino y rosa) a la
  derecha y, a la izquierda, de más grande a más chico:
    1. el titular bold/light, lo más grande, con el guiño principal de la web
       en el recuadro rosa (el único recuadro de la página)
    2. fechas y datos, en una línea
    3. una sola acción: el CTA
  CTA "Reservá tus auriculares": PROPUESTA, pendiente de confirmar.
*/
export function Hero() {
  return (
    <section id="top" aria-label="Portada" className="relative isolate z-[1] flex min-h-[100svh] flex-col overflow-hidden bg-blanco text-vino">
      {/* La arena: en escritorio a la derecha; en el celular, arriba. Se desvanece hacia el texto. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,#000_30%,transparent_62%)] lg:[mask-image:linear-gradient(90deg,transparent_40%,#000_66%)]"
      >
        <Arena fijo="todos" forma="anillos" centro={[0.78, 0.5]} anillos={9} tintas={["--color-vino", "--color-rosa", "--color-rosa"]} particulas={26000} className="hidden lg:block" />
        <Arena fijo="todos" forma="anillos" centro={[0.62, 0.2]} anillos={7} tintas={["--color-vino", "--color-rosa", "--color-rosa"]} particulas={16000} className="lg:hidden" />
      </div>

      <Menu />

      <div className="grilla flex-1 content-end pb-[clamp(2.5rem,7svh,5rem)] lg:content-center lg:pb-0">
        <div className="col-span-4 lg:col-span-8">
          <p className="rotulo flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-vino" />
            Festival silencioso y sustentable · {programa.sede.split(",")[0]}
          </p>

          {/* 1 · Titular bold/light, lo más grande de la portada, con el guiño principal */}
          <div className="mt-6 w-full">
            <BoldLight
              as="h1"
              fuerte={
                <>
                  El festival más <Guino>ruidoso</Guino>
                </>
              }
              suave="que nunca vas a escuchar."
              max={120}
            />
          </div>

          {/* 2 · Fechas y datos: se leen, no compiten con el titular */}
          <p className="mt-[clamp(1.5rem,4svh,2.5rem)] flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="t-3">{FECHAS.lista}</span>
            <span className="rotulo">14 a 23 h · Entrada gratuita</span>
          </p>

          {/* 3 · Una sola acción */}
          <div className="mt-[clamp(1.75rem,4svh,2.5rem)] flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#reserva" className={`${boton("vino")} min-h-13 px-6 text-[0.8125rem]`}>
              Reservá tus auriculares
              <Flecha />
            </a>
            <a href="#programa" className="rotulo py-3 underline underline-offset-[6px] hover:no-underline">
              Mirá el programa
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
