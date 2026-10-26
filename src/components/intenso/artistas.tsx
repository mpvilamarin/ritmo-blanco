"use client";

import { useEffect, useRef, useState } from "react";
import { nombreCanal } from "../canal";
import { Signo } from "../signos";
import { elegirCanal, useCanal } from "@/lib/estado";
import { CANALES, partirHorario, programa, type CanalId } from "@/lib/programa";

type Item = { artista: string; descripcion: string; canal: CanalId | null; dia: number; hora: string };

const ITEMS: Item[] = programa.dias.flatMap((d) => [
  ...d.lineup.sets.flatMap((s) =>
    CANALES.map((c) => ({ ...s.canales[c], canal: c, dia: d.numero, hora: partirHorario(s.horario)[0] })),
  ),
  { ...d.lineup.cierre, canal: null, dia: d.numero, hora: partirHorario(d.lineup.cierre.horario)[0] },
]);

/*
  Placeholder de foto con el tratamiento del sistema: sombras lila azulado,
  luces melocotón. Cada círculo rota el degradé para que no se repitan.
*/
const TONOS = [
  ["#767498", "#e1b0c1", "#edcdb8"],
  ["#9195b4", "#b3a5ba", "#f2dabd"],
  ["#b3a5ba", "#e1b0c1", "#edcdb8"],
  ["#767498", "#9195b4", "#e1b0c1"],
  ["#e1b0c1", "#edcdb8", "#f2dabd"],
];
const fondo = (i: number) => {
  const [a, b, c] = TONOS[i % TONOS.length];
  return `linear-gradient(${120 + ((i * 47) % 120)}deg, ${a} 0%, ${b} 55%, ${c} 100%)`;
};

const PATRON = [1, 2, 2, 1, 1, 2];

function Circulo({ item, i, grande, tuyo }: { item: Item; i: number; grande: boolean; tuyo: boolean }) {
  return (
    <figure
      className={`group con-grano relative flex aspect-square shrink-0 flex-col items-center justify-end overflow-hidden rounded-full text-center text-vino ${
        grande ? "w-[var(--alto)] pb-[18%]" : "w-[calc((var(--alto)-1rem)/2)] pb-[16%]"
      } ${tuyo ? "ring-4 ring-rosa ring-offset-4 ring-offset-noche" : ""}`}
      style={{ background: fondo(i) }}
    >
      <span className="rotulo absolute top-[22%] bg-blanco/70 px-1.5 py-0.5 text-[0.5rem] tracking-[0.1em]">
        [FOTO DE PRENSA]
      </span>
      <figcaption className="px-[12%] transition-transform duration-300 group-hover:-translate-y-1">
        <span className={`mx-auto mb-2 flex w-fit items-center gap-1 ${grande ? "" : "mb-1"}`}>
          {item.canal ? (
            <Signo canal={item.canal} className={grande ? "size-5" : "size-3.5"} />
          ) : (
            CANALES.map((c) => <Signo key={c} canal={c} className={grande ? "size-4" : "size-3"} />)
          )}
        </span>
        <span
          className={`block font-display leading-[0.95] font-bold tracking-[-0.01em] uppercase ${
            grande ? "text-3xl md:text-4xl" : "text-sm md:text-lg"
          }`}
        >
          {item.artista}
        </span>
        <span className={`rotulo mt-2 block ${grande ? "" : "hidden md:block"}`}>
          {item.canal ? nombreCanal(item.canal) : "Cierre"} · Día {item.dia} · {item.hora}
        </span>
      </figcaption>
    </figure>
  );
}

export function ArtistasIntenso() {
  const canal = useCanal();
  const pista = useRef<HTMLDivElement>(null);
  const [avance, setAvance] = useState(0);

  const orden = canal
    ? [...ITEMS.filter((x) => x.canal === canal || !x.canal), ...ITEMS.filter((x) => x.canal && x.canal !== canal)]
    : ITEMS;

  const cols: { items: Item[]; desde: number }[] = [];
  for (let i = 0, p = 0; i < orden.length; p++) {
    const n = PATRON[p % PATRON.length];
    cols.push({ items: orden.slice(i, i + n), desde: i });
    i += n;
  }

  useEffect(() => {
    pista.current?.scrollTo({ left: 0 });
  }, [canal]);

  const medir = () => {
    const el = pista.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAvance(max > 0 ? el.scrollLeft / max : 0);
  };

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: quieto ? "auto" : "smooth" });
  };

  const visto = Math.max(1, Math.round(avance * (ITEMS.length - 1)) + 1);

  return (
    <section id="artistas" aria-labelledby="artistas-titulo" className="scroll-mt-16 py-24 md:py-36">
      <div className="mx-auto flex max-w-[80rem] flex-col items-center px-5 text-center md:px-8">
        <p className="rotulo text-rosa">Line-up · {ITEMS.length} artistas · 3 canales</p>
        <h2 id="artistas-titulo" className="mt-5 font-display text-[clamp(3.5rem,14vw,10rem)] leading-[0.85] font-bold tracking-[-0.03em] uppercase">
          Artistas
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Elegí tu canal">
          {[null, ...CANALES].map((c) => {
            const activo = canal === c;
            return (
              <button
                key={c ?? "todos"}
                type="button"
                aria-pressed={activo}
                onClick={() => elegirCanal(c)}
                className={`rotulo flex items-center gap-2 border px-4 py-2.5 transition-colors ${
                  activo ? "border-rosa bg-rosa text-vino" : "border-blanco/30 hover:border-blanco"
                }`}
              >
                {c && <Signo canal={c} className="size-3.5" />}
                {c ? nombreCanal(c) : "Los tres"}
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={pista}
        onScroll={medir}
        tabIndex={0}
        role="region"
        aria-label="Artistas, desplazá a los costados"
        className="sin-barra mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 [--alto:17rem] focus-visible:outline-offset-[-3px] md:px-8 md:[--alto:24rem] lg:px-12 lg:[--alto:28rem]"
      >
        {cols.map(({ items, desde }) => (
          <div key={`${items[0].artista}-${desde}`} className="flex snap-start flex-col justify-between gap-4" style={{ height: "var(--alto)" }}>
            {items.map((item, k) => (
              <Circulo
                key={item.artista}
                item={item}
                i={desde + k}
                grande={items.length === 1}
                tuyo={!!canal && item.canal === canal}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-[40rem] items-center gap-5 px-5">
        <button type="button" onClick={() => mover(-1)} aria-label="Artistas anteriores" className="rotulo border border-blanco/30 px-3.5 py-2.5 hover:border-blanco">
          ←
        </button>
        <span className="rotulo tabular-nums text-blanco/70">{String(visto).padStart(2, "0")}</span>
        <div aria-hidden className="relative h-[2px] flex-1 bg-blanco/15">
          <div className="absolute inset-y-0 left-0 bg-rosa transition-[width] duration-150" style={{ width: `${Math.max(6, avance * 100)}%` }} />
        </div>
        <span className="rotulo tabular-nums text-blanco/70">{ITEMS.length}</span>
        <button type="button" onClick={() => mover(1)} aria-label="Artistas siguientes" className="rotulo border border-blanco/30 px-3.5 py-2.5 hover:border-blanco">
          →
        </button>
      </div>
      <p className="mt-6 px-5 text-center text-blanco/70">
        Tres canales a la vez. Cambiá cuando quieras: nadie se ofende.
      </p>
    </section>
  );
}
