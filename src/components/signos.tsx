import type { CanalId, Modalidad, Tipo, Zona } from "@/lib/programa";
import { NOMBRE_MODALIDAD } from "@/lib/programa";

/* Polígono de n puntas alternando radio exterior e interior, centrado en 0,0 */
function estrella(puntas: number, interior: number) {
  const pts: string[] = [];
  for (let i = 0; i < puntas * 2; i++) {
    const r = i % 2 === 0 ? 1 : interior;
    const a = (Math.PI * i) / puntas - Math.PI / 2;
    pts.push(`${(r * Math.cos(a)).toFixed(3)},${(r * Math.sin(a)).toFixed(3)}`);
  }
  return pts.join(" ");
}

const ESTRELLA_8 = estrella(8, 0.5);
const CHISPA_12 = estrella(12, 0.3);
const PETALOS = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);

/*
  Signos de canal: flor de 8 pétalos (Tumbao), estrella de 8 puntas (Pulso),
  chispa de 12 puntas (Sinte). En vino, con currentColor.
*/
export function Signo({ canal, className = "size-4" }: { canal: CanalId; className?: string }) {
  return (
    <svg viewBox="-1 -1 2 2" aria-hidden className={`shrink-0 ${className}`} fill="currentColor">
      {canal === "tumbao" && (
        <>
          {PETALOS.map((g) => (
            <ellipse key={g} cx="0" cy="-0.55" rx="0.24" ry="0.42" transform={`rotate(${g})`} />
          ))}
          <circle r="0.28" />
        </>
      )}
      {canal === "pulso" && <polygon points={ESTRELLA_8} />}
      {canal === "sinte" && <polygon points={CHISPA_12} />}
    </svg>
  );
}

/* Modalidad: la o llena = presencial, vacía = virtual, mitad = híbrida */
export function Modo({ modalidad, conTexto = false }: { modalidad: Modalidad; conTexto?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg viewBox="0 0 12 12" aria-hidden className="size-3 shrink-0">
        <circle
          cx="6"
          cy="6"
          r="5.25"
          fill={modalidad === "presencial" ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {modalidad === "hibrida" && <path d="M6 .75a5.25 5.25 0 0 0 0 10.5z" fill="currentColor" />}
      </svg>
      <span className={conTexto ? "rotulo" : "sr-solo"}>{NOMBRE_MODALIDAD[modalidad]}</span>
    </span>
  );
}

/* Tipo: mono en mayúsculas con contorno vino, sin relleno */
export function TipoEtiqueta({ tipo }: { tipo: Tipo }) {
  return <span className="rotulo border border-vino px-1.5 py-0.5 leading-none">{tipo}</span>;
}

/* Zona: muestra recta con el color de la zona y el nombre al lado (sin texto sobre el color: el vino chico no pasa sobre lila vivo) */
export function ZonaEtiqueta({ nombre, zona }: { nombre: string; zona: Zona }) {
  return (
    <span className="rotulo inline-flex items-center gap-1.5 leading-none tracking-[0.06em]">
      <span aria-hidden className="size-2.5 shrink-0" style={{ background: zona.color, boxShadow: zona.borde ? `inset 0 0 0 1px ${zona.borde}` : undefined }} />
      {nombre}
    </span>
  );
}

/* Recuadro rosa: marca la palabra del guiño, una sola por pieza */
export function Guino({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-rosa px-[0.2em] text-vino [box-decoration-break:clone]">{children}</mark>
  );
}

/* Los datos que faltan van entre corchetes: se ven como pendientes */
export function Texto({ children }: { children: string }) {
  const partes = children.split(/(\[[^\]]+\])/);
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith("[") ? (
          <span key={i} className="underline decoration-dotted underline-offset-4">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}

/*
  Logo provisorio: recorte de LOGOS-03.jpg recoloreado con un filtro
  (negro → color, blanco → transparente). Reemplazar por public/logo.svg.
*/
const TINTAS = {
  vino: [105 / 255, 33 / 255, 54 / 255],
  blanco: [1, 1, 1],
} as const;

export function Logo({ tinta = "vino", className = "" }: { tinta?: keyof typeof TINTAS; className?: string }) {
  const [r, g, b] = TINTAS[tinta];
  const id = `logo-${tinta}`;
  return (
    <svg viewBox="0 0 420 224" role="img" aria-label="Ritmo Blanco" className={className}>
      <filter id={id} colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values={`0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} -0.34 -1.144 -0.116 0 1.4`}
        />
      </filter>
      <image href="/logo-boceto.png" width="420" height="224" filter={`url(#${id})`} />
    </svg>
  );
}

/* Placeholder de foto: tono pastel con grano, texto marcado */
export function FotoPendiente({ texto = "[FOTO]", className = "" }: { texto?: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`Foto pendiente: ${texto}`}
      className={`con-grano flex items-center justify-center overflow-hidden ${className.includes("absolute") ? "" : "relative"} ${className}`}
      style={{
        background:
          "radial-gradient(120% 90% at 85% 10%, var(--color-melocoton) 0%, var(--color-rosa) 35%, var(--color-lila) 70%, var(--color-lila-palido) 100%)",
      }}
    >
      <span className="rotulo bg-blanco/80 px-2 py-1 text-vino">{texto}</span>
    </div>
  );
}
