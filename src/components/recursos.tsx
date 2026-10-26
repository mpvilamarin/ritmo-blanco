import { Signo } from "./signos";
import { Titulo } from "./titulo";
import { CANALES } from "@/lib/programa";

/*
  Curva nodal de una placa de Chladni, recortada a una franja horizontal.
  La misma fórmula que la arena: cada separador es un modo distinto.
*/
export function curvaNodal(n: number, m: number, fase: number, ancho: number, alto: number) {
  const muestras = 180;
  const vs: number[] = [];
  for (let i = 0; i < muestras; i++) {
    const x = i / (muestras - 1);
    const wx = x + 0.05 * Math.sin(3.1 * Math.PI * x + fase);
    vs.push(
      Math.cos(n * Math.PI * wx) * Math.cos(m * Math.PI * fase) -
        Math.cos(m * Math.PI * wx) * Math.cos(n * Math.PI * fase) +
        0.4 * Math.sin(1.5 * Math.PI * x + fase),
    );
  }
  const max = Math.max(...vs.map(Math.abs)) || 1;
  return vs.map((v, i) => [(i / (muestras - 1)) * ancho, alto / 2 + (v / max) * alto * 0.38] as const);
}

export const ANCHO = 1440;
export const trazo = (pts: readonly (readonly [number, number])[]) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");

/* Separador: dos líneas de arena que siguen una curva nodal */
export function Separador({ modo = [2, 5], fase = 0.3 }: { modo?: [number, number]; fase?: number }) {
  const alto = 90;
  const a = curvaNodal(modo[0], modo[1], fase, ANCHO, alto);
  const b = curvaNodal(modo[0], modo[1], fase + 0.06, ANCHO, alto).map(([x, y]) => [x, y + 9] as const);
  return (
    <svg aria-hidden viewBox={`0 0 ${ANCHO} ${alto}`} preserveAspectRatio="none" className="my-6 block h-16 w-full md:h-24">
      <path d={trazo(a)} fill="none" stroke="#e1b0c1" strokeWidth="5" strokeDasharray="0 9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d={trazo(b)} fill="none" stroke="#767498" strokeWidth="2.5" strokeDasharray="0 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/*
  Banda de color con bordes ondulados (curvas nodales) arriba y abajo,
  y una línea de granos sobre cada borde.
*/
export function Banda({
  color,
  modo = [3, 7],
  children,
  className = "",
  id,
  etiqueta,
}: {
  color: string;
  modo?: [number, number];
  children: React.ReactNode;
  className?: string;
  id?: string;
  etiqueta?: string;
}) {
  const alto = 110;
  const arriba = curvaNodal(modo[0], modo[1], 0.21, ANCHO, alto);
  const abajo = curvaNodal(modo[1], modo[0] + 1, 0.67, ANCHO, alto);
  // El relleno pasa 2 unidades del borde del SVG para que no quede costura con el bloque
  const borde = (pts: typeof arriba, cierre: number) => (
    <svg
      aria-hidden
      viewBox={`0 0 ${ANCHO} ${alto}`}
      preserveAspectRatio="none"
      className={`relative z-[1] block h-14 w-full overflow-visible md:h-24 ${cierre ? "-mb-px" : "-mt-px"}`}
    >
      <path d={`${trazo(pts)}L${ANCHO} ${cierre ? cierre + 2 : -2}L0 ${cierre ? cierre + 2 : -2}Z`} fill={color} />
      <path d={trazo(pts)} fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="0 8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
  return (
    <section id={id} aria-labelledby={etiqueta} className={`relative my-10 ${className}`}>
      {borde(arriba, alto)}
      <div className="con-grano relative py-12 md:py-20" style={{ background: color }}>
        {children}
      </div>
      {borde(abajo, 0)}
    </section>
  );
}

/* Franjas cruzadas que se desplazan: como cintas de evento */
export function Franjas({ textos }: { textos: string[][] }) {
  const cinta = (items: string[], inversa: boolean, clase: string) => {
    const tramo = (
      <span className="flex shrink-0 items-center">
        {Array.from({ length: 3 }, (_, r) =>
          items.map((t, i) => (
            <span key={`${r}-${i}`} className="flex items-center gap-5 pr-5">
              <span>{t}</span>
              <Signo canal={CANALES[(i + r) % 3]} className="size-5" />
            </span>
          )),
        )}
      </span>
    );
    return (
      <div className={`absolute left-[-10%] w-[120%] overflow-hidden py-2.5 ${clase}`}>
        <div className={`desfile flex w-max font-display text-xl font-bold whitespace-nowrap uppercase md:text-3xl ${inversa ? "desfile-inverso" : ""}`}>
          {tramo}
          {tramo}
        </div>
      </div>
    );
  };
  return (
    <div aria-hidden className="relative mt-14 h-40 overflow-hidden md:mt-20 md:h-52">
      {cinta(textos[0], false, "top-6 -rotate-[5deg] bg-rosa md:top-8")}
      {cinta(textos[1], true, "top-20 rotate-[3deg] bg-lila md:top-24")}
    </div>
  );
}

/* Encabezado de sección: rótulo chico arriba y titular bold/light */
export function Encabezado({
  id,
  rotulo,
  titulo,
  centrado = false,
  ancho = "max-w-[34rem]",
}: {
  id: string;
  rotulo: string;
  titulo: string[];
  centrado?: boolean;
  ancho?: string;
}) {
  return (
    <div id={id} className={`col-span-full flex flex-col ${centrado ? "items-center text-center" : ""}`}>
      <p className="rotulo mb-5">{rotulo}</p>
      <div className={`w-[85%] ${ancho}`}>
        <Titulo fuerte={titulo[0]} suave={titulo[1]} max={150} className="text-6xl" />
      </div>
    </div>
  );
}

/*
  La retícula a la vista (de 05): líneas verticales finas en vino al 11 %,
  una al centro de cada calle y las de los bordes a media calle del área de
  contenido, así todas las columnas se leen como celdas iguales. Va por encima de todo (también de las
  fotos a sangre) con multiply, sin bloquear clics.
*/
function Lineas({ columnas, clase }: { columnas: number; clase: string }) {
  return (
    <div className={`relative mx-auto h-full max-w-[90rem] ${clase}`} style={{ paddingInline: "var(--margen)" }}>
      <div className="relative h-full">
        <span className="absolute inset-y-0 w-px bg-vino" style={{ left: "calc(var(--calle) / -2)" }} />
        {Array.from({ length: columnas - 1 }, (_, i) => (
          <span
            key={i}
            className="absolute inset-y-0 w-px bg-vino"
            style={{ left: `calc(${i + 1} * (100% + var(--calle)) / ${columnas} - var(--calle) / 2)` }}
          />
        ))}
        <span className="absolute inset-y-0 w-px bg-vino" style={{ right: "calc(var(--calle) / -2)" }} />
      </div>
    </div>
  );
}

export function ReticulaVisible() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-20 opacity-[0.11] mix-blend-multiply">
      <Lineas columnas={4} clase="md:hidden" />
      <Lineas columnas={8} clase="hidden md:block lg:hidden" />
      <Lineas columnas={12} clase="hidden lg:block" />
    </div>
  );
}

/* Filete horizontal a todo el ancho, en el mismo tono que la retícula */
export function FileteGrilla({ className = "" }: { className?: string }) {
  return <hr aria-hidden className={`border-0 border-t border-vino/[0.14] ${className}`} />;
}
