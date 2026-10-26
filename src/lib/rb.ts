import { CANALES, diaSemana, fechaCorta, partirHorario, programa, type CanalId, type Tipo } from "./programa";

/*
  Datos derivados de programa.json para el diseño de Claude Design
  (Ritmo Blanco.dc.html). Nada se escribe a mano: todo sale del JSON.
*/

export const PALETA = {
  vino: "#692136",
  rosa: "#e1b0c1",
  melocoton: "#edcdb8",
  crema: "#f2dabd",
  lila: "#b3a5ba",
  azulgris: "#9195b4",
  lilaOscuro: "#767498",
};

export const INICIO = `${programa.dias[0].fecha}T14:00:00-03:00`;

/* Color de cada canal en el diseño, con su tinta legible */
export const CANAL: Record<CanalId, { nombre: string; que: string; color: string; tinta: string }> = {
  tumbao: { nombre: "Tumbao", que: programa.canales.tumbao, color: PALETA.rosa, tinta: PALETA.vino },
  pulso: { nombre: "Pulso", que: programa.canales.pulso, color: PALETA.melocoton, tinta: PALETA.vino },
  sinte: { nombre: "Sinte", que: programa.canales.sinte, color: PALETA.lilaOscuro, tinta: "#ffffff" },
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

/* Forma de cada tipo de actividad, como en el diseño */
export const FORMA_TIPO: Record<Tipo, { w: number; h: number; r: string; c: string }> = {
  TALLER: { w: 30, h: 30, r: "8px", c: PALETA.melocoton },
  CHARLA: { w: 32, h: 32, r: "50%", c: PALETA.azulgris },
  CLASE: { w: 42, h: 24, r: "999px", c: PALETA.rosa },
  EXPERIENCIA: { w: 30, h: 30, r: "999px 0 999px 0", c: PALETA.vino },
};

export const capital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
export const tipoLindo = (t: Tipo) => capital(t.toLowerCase());
