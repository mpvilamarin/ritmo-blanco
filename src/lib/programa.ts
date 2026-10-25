import datos from "../../data/programa.json";
import textos from "../../data/sitio.json";

export type CanalId = "tumbao" | "pulso" | "sinte";
export const CANALES: CanalId[] = ["tumbao", "pulso", "sinte"];

export type Tipo = "TALLER" | "CHARLA" | "CLASE" | "EXPERIENCIA";
export const TIPOS: Tipo[] = ["TALLER", "CHARLA", "CLASE", "EXPERIENCIA"];

export type Modalidad = "presencial" | "virtual" | "hibrida";
export const MODALIDADES: Modalidad[] = ["presencial", "hibrida", "virtual"];
export const NOMBRE_MODALIDAD: Record<Modalidad, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  hibrida: "Híbrida",
};

export type Zona = {
  color: string;
  texto: string;
  borde?: string;
  uso: string;
};

export type Actividad = {
  inicio: string;
  fin: string;
  duracion: string;
  titulo: string;
  descripcion: string;
  tipo: Tipo;
  modalidad: Modalidad;
  zona: string;
  destacado: boolean;
};

export type Artista = { artista: string; descripcion: string };

export type Dia = {
  numero: number;
  fecha: string;
  nombre: [string, string];
  generos: string;
  frase: string;
  horario: string;
  lineup: {
    escenario: string;
    sets: { horario: string; canales: Record<CanalId, Artista> }[];
    cierre: Artista & { horario: string; todos_los_canales: boolean };
  };
  actividades: Actividad[];
};

export type Programa = {
  festival: string;
  sede: string;
  fechas: string;
  entrada: string;
  canales: Record<CanalId, string>;
  zonas: Record<string, Zona>;
  dias: Dia[];
};

// El JSON se tipa a mano: TypeScript infiere `nombre` como string[], no como par.
export const programa = datos as unknown as Programa;
export const sitio = textos;

export function minutos(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

/** "2026-11-14" → "14.11" */
export function fechaCorta(fecha: string) {
  const [, mes, dia] = fecha.split("-");
  return `${dia}.${mes}`;
}

/** "2026-11-14" → "sábado" */
export function diaSemana(fecha: string) {
  return new Date(`${fecha}T12:00:00-03:00`).toLocaleDateString("es-AR", {
    weekday: "long",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

/** "16:00–17:45" → ["16:00", "17:45"] */
export function partirHorario(horario: string) {
  return horario.split("–") as [string, string];
}

export function ordenarActividades(lista: Actividad[]) {
  return [...lista].sort(
    (a, b) => minutos(a.inicio) - minutos(b.inicio) || a.zona.localeCompare(b.zona),
  );
}
