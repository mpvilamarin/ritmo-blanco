"use client";

import { Fragment, useState } from "react";
import { Signo } from "../signos";
import { CANALES } from "@/lib/programa";
import { Guino, Marca } from "../sistema";
import { programa } from "@/lib/programa";

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
    <nav aria-label="Principal" className="relative z-20 border-b border-blanco/35">
      <div className="grid grid-cols-[1fr_auto] items-center gap-6 px-[var(--margen)] py-3 lg:grid-cols-[1fr_auto_1fr]">
        <a href="#top" aria-label="Ritmo Blanco, inicio" className="justify-self-start">
          <Marca tinta="blanco" className="w-20 lg:w-24" />
        </a>
        <ul
          id="menu-links"
          className={`${abierto ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col bg-lila-oscuro px-[var(--margen)] py-2 lg:static lg:flex lg:flex-row lg:gap-10 lg:bg-transparent lg:p-0`}
        >
          {MENU.map(([href, t]) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setAbierto(false)}
                className="tx-rotulo block border-b border-blanco/20 py-4 underline-offset-[6px] hover:underline lg:border-0 lg:py-2"
              >
                {t}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-6 justify-self-end">
          <a href="#desde-casa" className="tx-rotulo flex items-center gap-2 py-2 underline-offset-[6px] hover:underline">
            <span aria-hidden className="size-2 rounded-full bg-rosa" />
            En vivo
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
  Hero: la foto del KV a sangre. Estructura y niveles de lectura de la
  referencia del usuario, de más chico a más grande:
    1. rótulo con filete en rosa (mono 12 px)
    2. título bold/light enorme, con el guiño en el recuadro rosa
    3. bajada de dos líneas (mono 18 px)
    4. un solo botón: ver el cronograma
    5. tres datos en fila (número 36 px + rótulo), separados por los signos de canal
  El logo va en la barra. El bloque ocupa 7 de 12 columnas a la izquierda;
  la derecha queda para las bailarinas.
*/
export function Hero() {
  const primero = programa.dias[0];
  const datos = [
    ["14—16.11", "Noviembre"],
    [primero.horario.replace("–", "—").replace(/:00/g, ""), "Horas"],
    ["Gratis", "Entrada"],
  ];
  return (
    <section id="top" aria-label="Portada" className="sobre-oscuro relative isolate flex min-h-[100svh] flex-col overflow-hidden text-blanco">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/fotos/kv.jpg"
        alt="Dos personas bailan con auriculares al atardecer en el bosque, con el público y el domo detrás."
        className="absolute inset-y-0 left-0 -z-20 h-full w-full max-w-none object-cover object-[66%_center] saturate-[.78] lg:w-[109%] lg:object-left"
      />
      {/* Velo localizado detrás del bloque de texto, más una franja arriba para el menú */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: [
            "linear-gradient(90deg, rgba(118,116,152,.62) 0%, rgba(118,116,152,.48) 32%, rgba(118,116,152,.18) 50%, rgba(118,116,152,0) 62%)",
            "linear-gradient(180deg, rgba(118,116,152,.4) 0%, rgba(118,116,152,0) 14%)",
          ].join(","),
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 lg:hidden"
        style={{ background: "linear-gradient(0deg, rgba(118,116,152,.7) 0%, rgba(118,116,152,.55) 50%, rgba(118,116,152,.25) 72%, rgba(118,116,152,0) 88%)" }}
      />

      <Menu />

      {/* El bloque se centra en el alto total de la pantalla (no en el espacio que deja el menú) */}
      <div className="grilla pointer-events-none absolute inset-0 content-center [&_a]:pointer-events-auto">
        <div className="col-span-4 lg:col-span-4">
          {/* 1 · Rótulo */}
          <p className="tx-rotulo flex items-center gap-3 text-[0.75rem]">
            <span aria-hidden className="h-px w-10 bg-blanco" />
            Festival silencioso<span className="hidden sm:inline"> · {programa.sede.split(",")[0]}</span>
          </p>

          {/* 2 · La marca: el elemento más grande */}
          <h1 className="mt-5 w-[82%] lg:mt-6 lg:w-full">
            <Marca tinta="blanco" className="w-full" />
          </h1>

          {/* 3 · Todo en una sola columna, subordinado a la marca: título, bajada y acción */}
          <div className="@container mt-6 border-t border-blanco/70 pt-6 lg:mt-8 lg:pt-7">
            {/* En un solo renglón y del ancho exacto del bloque (unidades del contenedor): bold + light en el recuadro rosa */}
            <p className="font-display text-[5.7cqw] leading-none whitespace-nowrap uppercase">
              <span className="font-black tracking-[-0.02em]">Tres canales.</span>{" "}
              <Guino>
                <span className="font-light tracking-[-0.01em]">Cero parlantes.</span>
              </Guino>
            </p>
            <p className="mt-5 max-w-[30rem] font-mono text-[0.9375rem] leading-[1.55]">
              Elegí tu canal y bailá en los Bosques de Palermo. Afuera, el parque sigue en silencio.
            </p>
            <a
              href="#programa"
              className="mt-6 inline-flex min-h-13 items-center bg-rosa px-5 font-mono text-base font-semibold tracking-[0.06em] text-vino uppercase transition-colors hover:bg-blanco"
            >
              Ver cronograma
            </a>
          </div>

          {/* 4 · Datos, separados por los signos de canal */}
          <dl className="mt-8 flex items-center gap-3 sm:gap-8 lg:mt-10">
            {datos.map(([v, k], i) => (
              <Fragment key={k}>
                {i > 0 && <Signo canal={CANALES[i - 1]} className="size-3 shrink-0 text-rosa sm:size-4" />}
                <div className="flex flex-col-reverse">
                  <dt className="tx-rotulo mt-1.5 text-blanco/80">{k}</dt>
                  <dd className="font-display text-xl leading-none font-bold whitespace-nowrap uppercase sm:text-3xl">{v}</dd>
                </div>
              </Fragment>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
