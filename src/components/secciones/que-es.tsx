"use client";

import { useRef } from "react";
import { Encabezado } from "../recursos";
import { Guino } from "../signos";
import { nombreCanal } from "../canal";
import { elegirCanal, useCanal } from "@/lib/estado";
import { CANALES, programa, sitio, type CanalId } from "@/lib/programa";

/*
  Qué es: los tres canales como tres círculos que se cruzan. Donde se
  superponen los tres está el blanco: la suma de los canales. Tocar un
  círculo elige ese canal. Alrededor de cada uno corren sus artistas (del JSON).
*/
const R = 116;
/* afuera: ángulo (en grados) hacia donde el círculo no se cruza con los otros */
const CIRCULOS: Record<CanalId, { cx: number; cy: number; etiqueta: [number, number]; afuera: number }> = {
  tumbao: { cx: 142, cy: 148, etiqueta: [96, 112], afuera: 225 },
  pulso: { cx: 258, cy: 148, etiqueta: [304, 112], afuera: 315 },
  sinte: { cx: 200, cy: 250, etiqueta: [200, 312], afuera: 90 },
};

/*
  Anillo que arranca en el lado opuesto a "afuera", así el texto centrado al 50 %
  queda en el arco exterior. Abajo gira al revés para que se lea derecho.
*/
function anillo({ cx, cy, afuera }: (typeof CIRCULOS)[CanalId], r: number) {
  const a = ((afuera + 180) * Math.PI) / 180;
  const x0 = cx + r * Math.cos(a);
  const y0 = cy + r * Math.sin(a);
  const x1 = cx - r * Math.cos(a);
  const y1 = cy - r * Math.sin(a);
  const giro = afuera > 0 && afuera < 180 ? 0 : 1;
  return `M${x0} ${y0}A${r} ${r} 0 1 ${giro} ${x1} ${y1}A${r} ${r} 0 1 ${giro} ${x0} ${y0}`;
}

function artistasDe(canal: CanalId) {
  return programa.dias
    .flatMap((d) => d.lineup.sets.map((s) => s.canales[canal].artista))
    .join(" · ");
}

/* Mismas formas que Signo, dibujadas dentro del SVG */
function SignoSvg({ canal, x, y, s }: { canal: CanalId; x: number; y: number; s: number }) {
  const puntas = (n: number, k: number) =>
    Array.from({ length: n * 2 }, (_, i) => {
      const r = i % 2 ? k : 1;
      const a = (Math.PI * i) / n - Math.PI / 2;
      return `${(r * Math.cos(a)).toFixed(3)},${(r * Math.sin(a)).toFixed(3)}`;
    }).join(" ");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="currentColor">
      {canal === "tumbao" && (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i} cy="-0.55" rx="0.24" ry="0.42" transform={`rotate(${i * 45})`} />
          ))}
          <circle r="0.28" />
        </>
      )}
      {canal === "pulso" && <polygon points={puntas(8, 0.5)} />}
      {canal === "sinte" && <polygon points={puntas(12, 0.3)} />}
    </g>
  );
}

export function QueEs() {
  const t = sitio.que_es;
  const canal = useCanal();
  const nodos = useRef<(SVGGElement | null)[]>([]);
  const activo = canal ? CANALES.indexOf(canal) : 0;

  const teclas = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      elegirCanal(canal === CANALES[i] ? null : CANALES[i]);
      return;
    }
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const j = (i + delta + 3) % 3;
    elegirCanal(CANALES[j]);
    nodos.current[j]?.focus();
  };

  return (
    <section id="canales" aria-labelledby="que-es-titulo" className="reticula scroll-mt-4 gap-y-12 pt-24 md:pt-36 lg:scroll-mt-20">
      <Encabezado id="que-es-titulo" rotulo={t.rotulo} titulo={t.titulo} centrado />

      <div className="col-span-full md:col-span-5 lg:col-span-6 lg:col-start-1">
        <svg viewBox="0 0 400 400" className="w-full overflow-visible" role="radiogroup" aria-label={sitio.cta}>
          <defs>
            {CANALES.map((c) => (
              <path key={c} id={`anillo-${c}`} d={anillo(CIRCULOS[c], R + 8)} />
            ))}
          </defs>

          {CANALES.map((c) => (
            <text key={c} aria-hidden fontSize="6.2" letterSpacing="0.35" fill="#692136" fontFamily="var(--font-mono)" className="uppercase">
              <textPath href={`#anillo-${c}`} startOffset="50%" textAnchor="middle">
                {artistasDe(c)}
              </textPath>
            </text>
          ))}

          {CANALES.map((c, i) => {
            const k = CIRCULOS[c];
            const marcado = canal === c;
            return (
              <g
                key={c}
                ref={(g) => {
                  nodos.current[i] = g;
                }}
                role="radio"
                aria-checked={marcado}
                aria-label={`${nombreCanal(c)}: ${programa.canales[c]}`}
                tabIndex={i === activo ? 0 : -1}
                onClick={() => elegirCanal(marcado ? null : c)}
                onKeyDown={(e) => teclas(e, i)}
                className="cursor-pointer text-vino outline-none [&:focus-visible>circle]:stroke-[3] [&:hover>circle]:fill-rosa/40"
              >
                <circle
                  cx={k.cx}
                  cy={k.cy}
                  r={R}
                  fill={marcado ? "#e1b0c1" : "transparent"}
                  fillOpacity={marcado ? 0.85 : 1}
                  stroke="#692136"
                  strokeWidth="1.25"
                  className="transition-[fill] duration-300"
                  style={{ mixBlendMode: "multiply" }}
                />
                <SignoSvg canal={c} x={k.etiqueta[0]} y={k.etiqueta[1] - 34} s={13} />
                <text
                  x={k.etiqueta[0]}
                  y={k.etiqueta[1]}
                  textAnchor="middle"
                  fontSize="25"
                  fontWeight="700"
                  fill="currentColor"
                  fontFamily="var(--font-display)"
                >
                  {nombreCanal(c).toUpperCase()}
                </text>
                <text
                  x={k.etiqueta[0]}
                  y={k.etiqueta[1] + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fill="currentColor"
                  fontFamily="var(--font-mono)"
                >
                  {programa.canales[c]}
                </text>
              </g>
            );
          })}

          <g aria-hidden className="pointer-events-none">
            <circle cx="200" cy="183" r="27" fill="#ffffff" stroke="#692136" strokeWidth="1.25" />
            <text x="200" y="187" textAnchor="middle" fontSize="10" fontWeight="600" letterSpacing="1.5" fill="#692136" fontFamily="var(--font-mono)">
              {t.centro.toUpperCase()}
            </text>
          </g>
        </svg>
      </div>

      <div className="col-span-full space-y-5 self-center text-base md:col-span-3 lg:col-span-5 lg:col-start-8">
        {t.texto.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className="filete pt-4">
          {t.cierre[0]} <Guino>{t.cierre[1]}</Guino>
        </p>
        <p className="rotulo">
          {canal ? `Elegiste ${nombreCanal(canal)}. Tocalo de nuevo para soltarlo.` : `${sitio.cta}: tocá un círculo.`}
        </p>
      </div>
    </section>
  );
}
