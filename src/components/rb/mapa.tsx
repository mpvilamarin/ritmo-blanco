"use client";

import { useState } from "react";
import { Encabezado, Flecha, ICONOS, Icono, boton } from "./base";
import { Signo } from "../signos";
import { irAlPrograma } from "@/lib/estado-programa";
import { ACTIVIDADES, DIAS, PALETA, SHOWS } from "@/lib/rb";
import { CANALES, programa } from "@/lib/programa";

/* Mancha orgánica cerrada (8 puntos, Catmull-Rom), fija según la semilla */
function mancha(semilla: number) {
  const n = 8;
  const azar = (i: number) => {
    const x = Math.sin(semilla * 91.7 + i * 12.9) * 43758.5;
    return x - Math.floor(x);
  };
  const p = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = 41 + azar(i) * 8;
    return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r];
  });
  let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p[(i - 1 + n) % n], p[i], p[(i + 1) % n], p[(i + 2) % n]];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

/* Posición (x, y, ancho en %), semilla e ícono de cada zona del JSON */
const UBICACION: Record<string, { x: number; y: number; w: number; semilla: number; icono: string | null }> = {
  "Escenario Mudo": { x: 64, y: 28, w: 27, semilla: 3, icono: null },
  "Domo Callado": { x: 20, y: 48, w: 20, semilla: 11, icono: ICONOS.carpa },
  "Usina Bailable": { x: 80, y: 70, w: 21, semilla: 9, icono: ICONOS.rayo },
  "Pantalla Muda": { x: 37, y: 24, w: 16, semilla: 7, icono: ICONOS.pantalla },
  "Instalación central": { x: 47, y: 66, w: 15, semilla: 5, icono: ICONOS.reciclar },
};
const ZONAS = Object.keys(UBICACION).filter((n) => programa.zonas[n]);

const SERVICIOS = [
  { id: "acceso", label: "Acceso", icono: ICONOS.acceso, pts: [[6, 80]] },
  { id: "auri", label: "Auriculares", icono: ICONOS.punto, pts: [[17, 72]] },
  { id: "bici", label: "Bicicletero", icono: ICONOS.bici, pts: [[7, 62], [88, 52]] },
  { id: "agua", label: "Agua", icono: ICONOS.gota, pts: [[50, 49], [30, 70], [90, 86]] },
  { id: "compost", label: "Compost", icono: ICONOS.compost, pts: [[94, 34], [36, 88]] },
  { id: "aux", label: "Primeros auxilios", icono: ICONOS.mas, pts: [[60, 57]] },
];

const SENDEROS =
  "M9.6,88 C18,82 22,78 26,76 S42,70 52,68 S70,72 80,70 S112,68 124,70 M52,68 C58,56 64,46 72,43 S94,36 102,32 M26,76 C28,66 30,58 32,52 M72,43 C66,36 62,30 58,26";

const ARBOLES = [
  [4, 8, 6], [13, 4, 4.5], [9, 16, 3.5], [20, 9, 3], [150, 6, 6], [158, 15, 4], [142, 12, 3], [152, 93, 6], [143, 98, 4],
  [158, 83, 3], [60, 96, 4], [68, 99, 3], [2, 42, 4], [5, 32, 3], [98, 8, 3.5], [106, 4, 3], [118, 50, 2.6], [88, 88, 3],
];

function SignosEscenario({ className }: { className: string }) {
  return (
    <span className="flex gap-[6%]">
      {CANALES.map((c) => (
        <Signo key={c} canal={c} className={className} />
      ))}
    </span>
  );
}

export function Mapa() {
  const [zona, setZona] = useState("Escenario Mudo");
  const [servicio, setServicio] = useState<string | null>(null);

  const items = [
    ...ACTIVIDADES.map((a) => ({ dia: a.dia, inicio: a.inicio, titulo: a.titulo, zona: a.zona })),
    ...SHOWS.map((s) => ({ dia: s.dia, inicio: s.inicio, titulo: s.nombre, zona: programa.dias[0].lineup.escenario })),
  ]
    .filter((i) => i.zona === zona)
    .sort((a, b) => a.dia - b.dia || a.inicio.localeCompare(b.inicio));
  const z = programa.zonas[zona];
  const n = ZONAS.indexOf(zona) + 1;
  const esEscenario = zona === programa.dias[0].lineup.escenario;

  return (
    <section id="mapa" aria-labelledby="mapa-titulo" className="banda contenido scroll-mt-4">
      <Encabezado
        id="mapa-titulo"
        rotulo="Cómo moverte en el bosque"
        titulo={["Mapa", "del predio"]}
        texto={<p>Tocá una zona para ver qué pasa ahí, o un servicio para encontrarlo en el mapa.</p>}
      />

      <div role="group" aria-label="Servicios" className="mt-10 flex flex-wrap gap-1.5">
        {SERVICIOS.map((s) => {
          const on = servicio === s.id;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => setServicio(on ? null : s.id)}
              className={`rotulo inline-flex cursor-pointer items-center gap-2 border border-vino px-3 py-2 ${on ? "bg-vino text-blanco" : "hover:bg-crudo"}`}
            >
              <Icono d={s.icono} className="size-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0 self-start overflow-x-auto border border-vino">
          <div className="relative aspect-[16/10] min-w-[640px] overflow-hidden bg-crudo/40">
            <svg viewBox="0 0 160 100" aria-hidden className="absolute inset-0 size-full">
              <g fill={PALETA.crudo}>
                {ARBOLES.map(([cx, cy, r], i) => (
                  <circle key={i} cx={cx} cy={cy} r={r} />
                ))}
              </g>
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d={SENDEROS} stroke={PALETA.blanco} strokeWidth="4" />
                <path d={SENDEROS} stroke={PALETA.vino} strokeWidth=".5" strokeDasharray="1.4 1.4" />
              </g>
            </svg>

            {ZONAS.map((nombre, k) => {
              const u = UBICACION[nombre];
              const zz = programa.zonas[nombre];
              const on = zona === nombre;
              return (
                <div
                  key={nombre}
                  className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[250ms]"
                  style={{ left: `${u.x}%`, top: `${u.y}%`, width: `${u.w}%`, opacity: servicio ? 0.35 : 1 }}
                >
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-label={`${nombre}: ${zz.uso}`}
                    onClick={() => {
                      setZona(nombre);
                      setServicio(null);
                    }}
                    className="absolute inset-0 cursor-pointer"
                  >
                    <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
                      <path d={mancha(u.semilla)} fill={zz.color} stroke={PALETA.vino} strokeWidth={on ? 2.5 : 0} />
                    </svg>
                    <span className="absolute inset-0 grid place-items-center" style={{ color: zz.texto }}>
                      {u.icono ? <Icono d={u.icono} className="size-[30%]" /> : <SignosEscenario className="size-[1.4vw] min-w-3.5" />}
                    </span>
                    <span className="rotulo absolute top-[6%] left-[6%] grid size-5 place-items-center bg-blanco text-vino">{k + 1}</span>
                  </button>
                  <span
                    className={`rotulo pointer-events-none absolute top-[94%] left-1/2 -translate-x-1/2 px-2 py-1 text-[0.625rem] whitespace-nowrap ${
                      on ? "bg-vino text-blanco" : "bg-blanco text-vino"
                    }`}
                  >
                    {nombre}
                  </span>
                </div>
              );
            })}

            {SERVICIOS.flatMap((s) =>
              s.pts.map(([x, y]) => (
                <div
                  key={`${s.id}-${x}`}
                  aria-hidden
                  className="absolute flex flex-col items-center gap-0.5 transition-[opacity,transform] duration-[250ms]"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%,-50%) scale(${servicio === s.id ? 1.3 : 1})`,
                    opacity: servicio && servicio !== s.id ? 0.2 : 1,
                  }}
                >
                  <span className="grid size-6 place-items-center bg-vino text-blanco">
                    <Icono d={s.icono} className="size-3.5" />
                  </span>
                </div>
              )),
            )}

            <span aria-hidden className="rb-pulso absolute top-[88%] left-[6%] size-[3%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-vino" />
            <span className="rotulo absolute top-[95%] left-[9%] -translate-y-full bg-vino px-2 py-1 text-[0.625rem] text-blanco">Estás acá</span>
          </div>
        </div>

        <div className="flex flex-col border-t border-vino pt-5 lg:border-t-0 lg:pt-0" aria-live="polite">
          <p className="rotulo flex items-center gap-2">
            <span className="size-3" style={{ background: z.color, boxShadow: `inset 0 0 0 1px ${PALETA.vino}` }} />
            Zona {n} · {items.length} {esEscenario ? "shows" : "actividades"}
          </p>
          <h3 className="t-2 mt-3">{zona}</h3>
          <p className="t-chico mt-2">{z.uso}</p>
          <ul className="mt-5 border-t border-vino/25">
            {items.slice(0, 5).map((it) => (
              <li key={`${it.dia}-${it.titulo}`} className="t-chico grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 border-b border-vino/25 py-2.5">
                <span className="font-semibold">
                  {DIAS[it.dia - 1].fecha} · {it.inicio}
                </span>
                <span>{it.titulo}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() =>
              irAlPrograma(esEscenario ? { vista: "lineup" } : { vista: "actividades", zona, tipo: null, modalidad: null, abierta: null })
            }
            className={`${boton("vino")} mt-6 self-start`}
          >
            Buscalo en el programa
            <Flecha />
          </button>
          <div className="mt-8 border-t border-vino pt-4">
            <p className="rotulo">Zonas</p>
            <ul className="mt-3 grid gap-1.5">
              {ZONAS.map((nombre, k) => {
                const zz = programa.zonas[nombre];
                return (
                  <li key={nombre}>
                    <button
                      type="button"
                      onClick={() => setZona(nombre)}
                      className={`t-chico flex cursor-pointer items-center gap-2.5 ${zona === nombre ? "font-semibold underline underline-offset-4" : ""}`}
                    >
                      {/* Muestra de color sin texto encima: el vino chico no pasa sobre lila vivo */}
                      <span aria-hidden className="size-4 shrink-0" style={{ background: zz.color, boxShadow: zz.borde ? `inset 0 0 0 1px ${zz.borde}` : undefined }} />
                      <span className="rotulo">{k + 1}</span>
                      {nombre}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
