import { CANALES, diaSemana, fechaCorta, partirHorario, programa, type CanalId, type Tipo } from "./programa";

/*
  Datos derivados de programa.json para el diseño de Claude Design
  (Ritmo Blanco.dc.html). Nada se escribe a mano: todo sale del JSON.
*/

/* Los colores salen de las variables de globals.css: nunca hex en los componentes */
export const PALETA = {
  vino: "var(--color-vino)",
  blanco: "var(--color-blanco)",
  rosa: "var(--color-rosa)",
  magenta: "var(--color-magenta)",
  violeta: "var(--color-violeta)",
  lila: "var(--color-lila)",
  lilaPalido: "var(--color-lila-palido)",
  crudo: "var(--color-crudo)",
  /** Solo dentro del degradé difuso */
  melocoton: "var(--color-melocoton)",
};

/** Un color de la paleta con transparencia: velo(PALETA.lila, 20) */
export const velo = (color: string, porciento: number) => `color-mix(in srgb, ${color} ${porciento}%, transparent)`;

/* Fechas del festival, siempre derivadas del JSON: "14", "15", "16", "17" */
const NUMEROS = programa.dias.map((d) => d.fecha.slice(8));
const LETRAS = ["", "un día", "dos días", "tres días", "cuatro días", "cinco días"];
export const FECHAS = {
  numeros: NUMEROS,
  /** "14—17.11" */
  rango: `${NUMEROS[0]}—${NUMEROS.at(-1)}.11`,
  /** "14·15·16·17 de noviembre" */
  lista: `${NUMEROS.join("·")} de noviembre`,
  /** "14 al 17 de noviembre" */
  larga: programa.fechas,
  /** "14, 15, 16 y 17.11" */
  enumeradas: `${NUMEROS.slice(0, -1).join(", ")} y ${NUMEROS.at(-1)}.11`,
  /** "cuatro días" */
  dias: LETRAS[NUMEROS.length] ?? `${NUMEROS.length} días`,
};

export const INICIO = `${programa.dias[0].fecha}T14:00:00-03:00`;

/* Canales: nombre y qué suena. Se distinguen solo por su signo, nunca por color (el color es de las zonas). */
export const CANAL: Record<CanalId, { nombre: string; que: string }> = {
  tumbao: { nombre: "Tumbao", que: programa.canales.tumbao },
  pulso: { nombre: "Pulso", que: programa.canales.pulso },
  sinte: { nombre: "Sinte", que: programa.canales.sinte },
};

export const DIAS = programa.dias.map((d) => ({
  numero: d.numero,
  etiqueta: `Día ${d.numero} · ${diaSemana(d.fecha)}`,
  fecha: fechaCorta(d.fecha),
  nombre: d.nombre.join(" "),
  cierre: d.lineup.cierre.artista,
  actividades: d.actividades.length,
}));

export type Show = {
  slug: string;
  dia: number;
  inicio: string;
  fin: string;
  canal: CanalId | "todos";
  nombre: string;
  que: string;
  cierre: boolean;
};

const slug = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const SHOWS: Show[] = programa.dias.flatMap((d) => {
  const sets = d.lineup.sets.flatMap((s) => {
    const [inicio, fin] = partirHorario(s.horario);
    return CANALES.map((c) => ({
      slug: slug(s.canales[c].artista),
      dia: d.numero,
      inicio,
      fin,
      canal: c as CanalId | "todos",
      nombre: s.canales[c].artista,
      que: s.canales[c].descripcion,
      cierre: false,
    }));
  });
  const [inicio, fin] = partirHorario(d.lineup.cierre.horario);
  const c = d.lineup.cierre;
  return [...sets, { slug: slug(c.artista), dia: d.numero, inicio, fin, canal: "todos" as const, nombre: c.artista, que: c.descripcion, cierre: true }];
});

export const ACTIVIDADES = programa.dias.flatMap((d) => d.actividades.map((a) => ({ ...a, dia: d.numero, clave: `${d.numero}-${slug(a.titulo)}` })));

export const TOTALES = {
  dias: programa.dias.length,
  canales: CANALES.length,
  artistas: SHOWS.length,
  actividades: ACTIVIDADES.length,
  soloOnline: ACTIVIDADES.filter((a) => a.modalidad === "virtual").length,
};


export const capital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
export const tipoLindo = (t: Tipo) => capital(t.toLowerCase());
