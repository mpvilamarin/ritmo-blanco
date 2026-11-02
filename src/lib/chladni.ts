/** Interpretación gráfica de líneas nodales; no resuelve la dinámica de una placa. */
export type PerfilChladni = "tumbao" | "pulso" | "sinte" | "todos" | "ninguno";
export type Grano = { x: number; y: number; origenX: number; origenY: number; radio: number; tinta: number };
const MODOS: Record<PerfilChladni, [number, number]> = {
  tumbao: [1, 3], pulso: [2, 4], sinte: [3, 5], todos: [5, 7], ninguno: [1, 3],
};

export function aleatorio(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function campoChladni(x: number, y: number, perfil: PerfilChladni, anillos?: number) {
  if (anillos !== undefined) {
    const r = Math.hypot(x, y);
    const angulo = Math.atan2(y, x);
    return Math.cos(anillos * Math.PI * r) + 0.42 * Math.cos(6 * angulo) * Math.sin(Math.PI * r) ** 2;
  }
  const [n, m] = MODOS[perfil];
  // La simetría en ambos ejes permite leer rosetas y celdas cerradas.
  // Una perturbación pequeña y simétrica conserva el carácter granular.
  const u = x * (1 + 0.018 * Math.cos(5 * y));
  const v = y * (1 + 0.018 * Math.cos(5 * x));
  return Math.cos(n * Math.PI * u / 2) * Math.cos(m * Math.PI * v / 2)
    + Math.cos(m * Math.PI * u / 2) * Math.cos(n * Math.PI * v / 2);
}

/** Ondula la figura como en el key visual: las líneas nodales dejan de ser rectas. */
export function ondular(granos: Grano[], fuerza = 1): Grano[] {
  return granos.map((g) => {
    const dx = fuerza * (0.16 * Math.sin(1.9 * g.y + 0.7) + 0.06 * Math.sin(4.3 * g.y - 1.1 * g.x));
    const dy = fuerza * (0.13 * Math.sin(1.6 * g.x + 1.3) + 0.05 * Math.cos(3.7 * g.x + 0.8 * g.y));
    return { ...g, x: g.x + dx, y: g.y + dy, origenX: g.origenX + dx, origenY: g.origenY + dy };
  });
}

export function generarGranos(total: number, semilla: number, perfil: PerfilChladni, anillos?: number, aspecto = 1): Grano[] {
  const azar = aleatorio(semilla);
  const granos: Grano[] = [];
  // Muestreo de densidad: bandas anchas y porosas en lugar de líneas vectoriales.
  for (let intento = 0; granos.length < total && intento < total * 35; intento++) {
    const x = (azar() * 2 - 1) * Math.max(1, aspecto);
    const y = (azar() * 2 - 1) * Math.max(1, 1 / aspecto);
    const f = campoChladni(x, y, perfil, anillos);
    const nivel = azar() < 0.5 ? -0.20 : 0.20;
    const distancia = Math.abs(f - nivel);
    const espesor = 0.075 + 0.018 * Math.cos(6 * x) * Math.cos(6 * y);
    const acumulacion = 0.65 + 0.25 * Math.sin(39 * x + Math.sin(17 * y)) * Math.sin(31 * y - 6 * x);
    const densidad = 0.0015 + acumulacion * Math.exp(-0.5 * (distancia / espesor) ** 2)
      + 0.035 * Math.exp(-0.5 * (distancia / 0.20) ** 2);
    if (azar() > densidad) continue;
    const angulo = azar() * Math.PI * 2;
    const desplazamiento = 0.012 + azar() * 0.035;
    granos.push({ x, y, origenX: x + Math.cos(angulo) * desplazamiento, origenY: y + Math.sin(angulo) * desplazamiento,
      radio: 0.32 + azar() ** 2 * 1.25, tinta: (nivel < 0 ? 0 : 0.5) + azar() * 0.49 });
  }
  return granos;
}
