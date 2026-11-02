import { aleatorio, type Grano } from "./chladni";
import type { CanalId } from "./programa";

/** Signos sugeridos por acumulación de arena, con bordes porosos y granos sueltos. */
export function generarGranosCanal(total: number, semilla: number, canal: CanalId): Grano[] {
  const azar = aleatorio(semilla);
  const puntas = canal === "sinte" ? 12 : 8;
  const interior = canal === "sinte" ? .3 : .5;
  const vertices = Array.from({ length: puntas * 2 }, (_, i) => {
    const a = Math.PI * i / puntas - Math.PI / 2;
    const r = i % 2 ? interior : 1;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  const contiene = (x: number, y: number) => {
    if (canal === "tumbao") {
      if (Math.hypot(x, y) < .22) return true;
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        const u = x * Math.cos(a) + y * Math.sin(a);
        const v = -x * Math.sin(a) + y * Math.cos(a);
        if ((u / .16) ** 2 + ((v + .62) / .36) ** 2 < 1) return true;
      }
      return false;
    }
    let dentro = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const [xi, yi] = vertices[i], [xj, yj] = vertices[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) dentro = !dentro;
    }
    return dentro;
  };
  const granos: Grano[] = [];
  const normal = () => Math.sqrt(-2 * Math.log(Math.max(.00001, azar()))) * Math.cos(2 * Math.PI * azar());
  while (granos.length < total) {
    // Una parte de la arena permanece dispersa incluso con la figura asentada.
    const suelto = granos.length % 100 < 7;
    const x = azar() * 2 - 1, y = azar() * 2 - 1;
    if (!suelto && !contiene(x, y)) continue;
    // Variación local y desplazamientos independientes deshacen el contorno vectorial.
    const ruido = azar() < .15 ? .06 : .02;
    const px = suelto ? normal() * .5 : x * .8 + .025 * Math.sin(11 * y + 3 * x) + .012 * Math.sin(23 * y) + normal() * ruido;
    const py = suelto ? normal() * .45 : y * .8 + .025 * Math.sin(13 * x - 2 * y) + .012 * Math.cos(19 * x) + normal() * ruido;
    // Solo la arena suelta se desvanece hacia el borde: la figura queda entera.
    const distancia = Math.hypot(px, py);
    if (distancia >= 1) continue;
    const borde = suelto ? Math.max(0, (distancia - .6) / .4) : 0;
    if (azar() < borde * borde * (3 - 2 * borde)) continue;
    granos.push({ x: px, y: py,
      origenX: x, origenY: y, radio: .18 + azar() ** 3 * (suelto ? .65 : .8), tinta: azar() });
  }

  return granos;
}
