"use client";

import { soloZona, useFiltros } from "@/lib/estado";
import { programa, sitio } from "@/lib/programa";
import { Titulo } from "./titulo";

/*
  Mapa esquemático del predio, con la lectura del impreso: caminos blancos,
  árboles en puntos y las avenidas en rosa. Los colores de zona son los del
  JSON, los mismos que los recuadros del programa.
*/
const FORMAS: Record<string, { d?: string; circulo?: [number, number, number]; etiqueta: [number, number] }> = {
  "Domo Callado": {
    d: "M58 122C70 96 106 98 113 126C119 151 101 176 78 173C55 169 47 144 58 122Z",
    etiqueta: [84, 138],
  },
  "Escenario Mudo": {
    d: "M150 96C175 70 246 72 263 101C281 129 263 161 226 166C190 171 160 166 148 141C138 121 135 109 150 96Z",
    etiqueta: [206, 122],
  },
  "Usina Bailable": {
    d: "M300 108C321 92 353 106 353 133C353 161 331 173 311 166C290 159 284 126 300 108Z",
    etiqueta: [320, 138],
  },
  "Pantalla Muda": {
    d: "M168 206C193 189 251 191 263 211C273 229 246 241 211 241C179 241 154 226 168 206Z",
    etiqueta: [214, 218],
  },
  "Instalación central": {
    circulo: [118, 205, 17],
    etiqueta: [118, 238],
  },
};

const CAMINOS = [
  "M40 262C80 230 100 200 118 205C140 210 150 190 170 175",
  "M118 188C110 160 100 120 120 95C140 70 170 60 210 62",
  "M265 140C285 140 290 120 300 118",
  "M226 166C230 180 220 190 214 192",
  "M263 211C300 215 330 230 360 250",
  "M210 62C260 58 320 60 350 45",
  "M113 126C125 126 135 125 145 128",
];

const SERVICIOS: [number, number][][] = [
  [
    [48, 252],
    [352, 52],
  ],
  [[70, 236]],
  [
    [176, 66],
    [290, 232],
  ],
  [[330, 214]],
  [[140, 76]],
];

/* Árboles: puntos a lo largo del borde, con un ruido fijo */
const ARBOLES = Array.from({ length: 70 }, (_, i) => {
  const t = i / 70;
  const lado = Math.floor(t * 4);
  const u = (t * 4) % 1;
  const ruido = Math.sin(i * 12.9898) * 5;
  const [x, y] = [
    [36 + u * 330, 46 - u * 16 + ruido],
    [372 + ruido, 32 + u * 230],
    [370 - u * 340, 266 + u * 12 + ruido],
    [26 + ruido, 278 - u * 230],
  ][lado];
  return { x, y, r: 3.2 + ((i * 7) % 4) * 0.7, c: i % 3 ? "#9195b4" : "#b3a5ba" };
});

export function Mapa() {
  const filtros = useFiltros();

  const elegir = (zona: string) => {
    soloZona(zona);
    document.getElementById("actividades")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  const zonas = Object.entries(programa.zonas);
  const t = sitio.mapa;

  return (
    <section id="mapa" aria-labelledby="mapa-titulo" className="reticula gap-y-8 pt-20 md:pt-28">
      <div id="mapa-titulo" className="col-span-3 md:col-span-4 lg:col-span-4">
        <Titulo fuerte={t.titulo[0]} suave={t.titulo[1]} max={130} className="text-6xl" />
      </div>
      <p className="col-span-full self-end md:col-span-4 lg:col-span-5 lg:col-start-8">{t.texto}</p>

      <figure className="col-span-full lg:col-span-8">
        <svg viewBox="0 0 400 300" className="w-full" role="group" aria-label="Mapa del predio">
          <rect x="0" y="0" width="400" height="300" fill="#ffffff" fillOpacity="0.35" />
          {/* Avenidas */}
          <path d="M0 26L400 2V18L0 42Z" fill="#e1b0c1" />
          <path d="M0 290L400 276V292L0 300Z" fill="#e1b0c1" />
          <text x="140" y="21" fontSize="9" fill="#692136" fontFamily="var(--font-mono)" transform="rotate(-3.4 150 20)">
            {t.avenidas[1]}
          </text>
          <text x="140" y="294" fontSize="9" fill="#692136" fontFamily="var(--font-mono)" transform="rotate(-2 150 292)">
            {t.avenidas[0]}
          </text>
          {/* Predio */}
          <path d="M30 48L368 30L380 266L22 282Z" fill="#e1b0c1" fillOpacity="0.45" />
          {CAMINOS.map((d) => (
            <path key={d} d={d} fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
          ))}
          {ARBOLES.map((a, i) => (
            <circle key={i} cx={a.x} cy={a.y} r={a.r} fill={a.c} />
          ))}

          {zonas
            .filter(([nombre]) => FORMAS[nombre])
            .map(([nombre, z]) => {
              const f = FORMAS[nombre];
              const activa = filtros.zona.includes(nombre);
              const trazo = { stroke: "#692136", strokeWidth: activa ? 2.5 : z.texto === "#692136" ? 1 : 0 };
              return (
                <g
                  key={nombre}
                  role="button"
                  tabIndex={0}
                  aria-pressed={activa}
                  aria-label={`${nombre}: ${z.uso}. Ver sus actividades`}
                  className="cursor-pointer outline-none [&:focus-visible>*:first-child]:stroke-[3] [&:hover>*:first-child]:opacity-85"
                  onClick={() => elegir(nombre)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      elegir(nombre);
                    }
                  }}
                >
                  {f.d ? (
                    <path d={f.d} fill={z.color} {...trazo} />
                  ) : (
                    <circle cx={f.circulo![0]} cy={f.circulo![1]} r={f.circulo![2]} fill={z.color} {...trazo} />
                  )}
                  <text
                    x={f.etiqueta[0]}
                    y={f.etiqueta[1]}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    letterSpacing="0.2"
                    fill={f.d ? z.texto : "#692136"}
                    fontFamily="var(--font-mono)"
                  >
                    {nombre.toUpperCase().split(" ").map((p, i) => (
                      <tspan key={p} x={f.etiqueta[0]} dy={i ? 11 : 0}>
                        {p}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}

          {SERVICIOS.map((puntos, i) =>
            puntos.map(([x, y]) => (
              <g key={`${i}-${x}`} aria-hidden>
                <rect x={x - 7} y={y - 7} width="14" height="14" fill="#692136" />
                <text x={x} y={y + 3.5} textAnchor="middle" fontSize="10" fill="#ffffff" fontFamily="var(--font-mono)">
                  {i + 1}
                </text>
              </g>
            )),
          )}
        </svg>
        <figcaption className="sr-solo">
          Mapa esquemático. Las zonas son botones que filtran las actividades del programa.
        </figcaption>
      </figure>

      <div className="col-span-full grid gap-8 md:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
        <div>
          <h3 className="font-display text-2xl font-bold uppercase">Zonas</h3>
          <ul className="mt-3">
            {zonas.map(([nombre, z]) => (
              <li key={nombre} className="filete">
                <button
                  type="button"
                  onClick={() => elegir(nombre)}
                  aria-pressed={filtros.zona.includes(nombre)}
                  className="flex w-full items-start gap-3 py-2.5 text-left hover:bg-rosa/40"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0"
                    style={{ background: z.color, boxShadow: z.borde ? `inset 0 0 0 1px ${z.borde}` : undefined }}
                  />
                  <span>
                    <span className="font-display text-lg leading-none font-medium">{nombre}</span>
                    <span className="block text-[0.8125rem]">{z.uso}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold uppercase">Servicios</h3>
          <ol className="mt-3">
            {t.servicios.map((s, i) => (
              <li key={s} className="flex items-center gap-3 filete py-2">
                <span aria-hidden className="flex size-5 items-center justify-center bg-vino text-[0.6875rem] text-blanco">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
