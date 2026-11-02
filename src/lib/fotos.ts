/*
  Fotos de prensa cargadas en public/fotos/artistas/<slug>.webp (cuadradas,
  520 px, color natural). Un artista sin foto sigue mostrando el lugar vacío.
*/
const CARGADAS = [
  "kumbia-queers",
  "chancha-via-circuito",
  "dancing-mood",
  "la-delio-valdez",
  "miss-bolivia",
  "hernan-cattaneo",
  "bomba-estereo",
  "raly-barrionuevo",
  "conociendo-rusia",
  "dengue-dengue-dengue",
  "peteco-carabajal",
  "el-mato-a-un-policia-motorizado",
  "poncho",
  "bajofondo",
  "tonolec",
  "lisandro-aristimuno",
  "nicola-cruz",
  "mitu",
  "daniel-melero",
  "monte-simon-mejia",
  "juana-molina",
  "perota-chingo",
  "usted-senalemelo",
  "juan-ingaramo",
  "kevin-johansen",
  "cigarbox-man",
  "indios",
  "bandalos-chinos",
];

export const fotoArtista = (slug: string) => (CARGADAS.includes(slug) ? `/fotos/artistas/${slug}.webp` : null);
