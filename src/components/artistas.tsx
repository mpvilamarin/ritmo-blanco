"use client";

import { useEffect, useRef, useState } from "react";
import { nombreCanal } from "./canal";
import { Encabezado } from "./recursos";
import { Signo } from "./signos";
import { elegirCanal, useCanal } from "@/lib/estado";
import { CANALES, partirHorario, programa, sitio, type CanalId } from "@/lib/programa";

type Item = {
  artista: string;
  descripcion: string;
  canal: CanalId | null;
  dia: number;
  hora: string;
};

/* Todos los artistas del JSON: tres por franja y el cierre de cada día (canal null) */
const ITEMS: Item[] = programa.dias.flatMap((d) => [
  ...d.lineup.sets.flatMap((s) =>
    CANALES.map((c) => ({ ...s.canales[c], canal: c, dia: d.numero, hora: partirHorario(s.horario)[0] })),
  ),
  { ...d.lineup.cierre, canal: null, dia: d.numero, hora: partirHorario(d.lineup.cierre.horario)[0] },
]);

const FONDO: Record<CanalId | "cierre", string> = {
  tumbao: "#e1b0c1",
  pulso: "#b3a5ba",
  sinte: "#edcdb8",
  cierre: "#ffffff",
};

/* Ritmo del carrusel: un círculo grande, dos chicos apilados, otra vez dos, dos grandes... */
const PATRON = ["grande", "par", "par", "grande", "grande", "par"] as const;

function columnas(items: Item[]) {
  const cols: Item[][] = [];
  let i = 0;
  let p = 0;
  while (i < items.length) {
    const n = PATRON[p % PATRON.length] === "grande" ? 1 : 2;
    cols.push(items.slice(i, i + n));
    i += n;
    p++;
  }
  return cols;
}

function Circulo({ item, grande, tuyo }: { item: Item; grande: boolean; tuyo: boolean }) {
  const clave = item.canal ?? "cierre";
  return (
    <figure
      className={`con-grano relative flex aspect-square shrink-0 flex-col items-center justify-center overflow-hidden rounded-full border text-center transition-transform duration-300 hover:scale-[1.03] ${
        tuyo ? "border-2 border-vino" : "border-vino/40"
      } ${grande ? "w-[var(--alto)] gap-2 p-8" : "w-[calc((var(--alto)-0.75rem)/2)] gap-1 p-4"}`}
      style={{
        background: FONDO[clave],
      }}
    >
      <span className="rotulo text-[0.5625rem] opacity-80">[FOTO DE PRENSA]</span>
      {item.canal ? (
        <Signo canal={item.canal} className={grande ? "size-7" : "size-4"} />
      ) : (
        <span className="flex -space-x-1.5">
          {CANALES.map((c) => (
            <Signo key={c} canal={c} className={grande ? "size-6" : "size-3.5"} />
          ))}
        </span>
      )}
      <figcaption>
        <span
          className={`block font-display leading-[1.05] font-bold uppercase ${grande ? "text-2xl md:text-3xl" : "text-[0.8125rem] md:text-base"}`}
        >
          {item.artista}
        </span>
        <span className={`rotulo mt-1.5 block ${grande ? "" : "text-[0.5625rem]"}`}>
          {item.canal ? nombreCanal(item.canal) : "Cierre · los tres"} · Día {item.dia} · {item.hora}
        </span>
        {grande && <span className="mt-1 block text-[0.8125rem]">{item.descripcion}</span>}
      </figcaption>
    </figure>
  );
}

export function Artistas() {
  const canal = useCanal();
  const pista = useRef<HTMLUListElement>(null);
  const [avance, setAvance] = useState(0);
  const t = sitio.artistas;

  // Con un canal elegido, sus artistas (y los cierres, que son de todos) pasan adelante
  const orden = canal
    ? [...ITEMS.filter((i) => i.canal === canal || !i.canal), ...ITEMS.filter((i) => i.canal && i.canal !== canal)]
    : ITEMS;
  const cols = columnas(orden);

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
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: quieto ? "auto" : "smooth" });
  };

  const chip = (activo: boolean) =>
    `rotulo flex items-center gap-1.5 border border-vino px-3 py-2 transition-colors ${
      activo ? "bg-vino text-blanco" : "hover:bg-blanco"
    }`;

  return (
    <div className="flex flex-col gap-10">
      <div className="reticula gap-y-8">
        <Encabezado id="artistas-titulo" rotulo={t.rotulo} titulo={t.titulo} centrado />
        <div className="col-span-full flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrar por canal">
          <button type="button" aria-pressed={!canal} onClick={() => elegirCanal(null)} className={chip(!canal)}>
            {t.todos}
          </button>
          {CANALES.map((c) => (
            <button key={c} type="button" aria-pressed={canal === c} onClick={() => elegirCanal(c)} className={chip(canal === c)}>
              <Signo canal={c} className="size-3.5" />
              {nombreCanal(c)}
            </button>
          ))}
        </div>
      </div>

      <ul
        ref={pista}
        onScroll={medir}
        tabIndex={0}
        aria-label="Artistas del festival, desplazá a los costados"
        className="sin-barra flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [--alto:17rem] focus-visible:outline-offset-[-3px] md:px-8 md:[--alto:22rem] lg:px-12 lg:[--alto:26rem]"
      >
        {cols.map((col, i) => (
          <li key={`${col[0].artista}-${i}`} className="flex snap-start flex-col justify-between gap-3" style={{ height: "var(--alto)" }}>
            {col.map((item) => (
              <Circulo key={item.artista} item={item} grande={col.length === 1} tuyo={!!canal && item.canal === canal} />
            ))}
          </li>
        ))}
      </ul>

      <div className="reticula items-center gap-y-6">
        <div className="col-span-full flex items-center gap-4 md:col-span-6 md:col-start-2 lg:col-span-6 lg:col-start-4">
          <button type="button" onClick={() => mover(-1)} aria-label="Artistas anteriores" className="rotulo border border-vino px-3 py-2 hover:bg-blanco">
            ←
          </button>
          <div className="relative h-[3px] flex-1 bg-vino/20" aria-hidden>
            <div className="absolute inset-y-0 left-0 bg-vino" style={{ width: `${Math.max(8, avance * 100)}%` }} />
          </div>
          <button type="button" onClick={() => mover(1)} aria-label="Artistas siguientes" className="rotulo border border-vino px-3 py-2 hover:bg-blanco">
            →
          </button>
        </div>
        <p className="col-span-full text-center">{t.texto}</p>
      </div>
    </div>
  );
}
