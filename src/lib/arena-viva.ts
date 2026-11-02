import { generarGranos, type Grano, type PerfilChladni } from "./chladni";

/** Granos persistentes sobre un plano fijo, sin rotación ni fundidos de imágenes. */
export function iniciarArenaViva(canvas: HTMLCanvasElement, opciones: {
  perfil: PerfilChladni; semilla: number; particulas: number; tintas: string[];
  centro: [number, number]; pausado: () => boolean;
  perfiles?: PerfilChladni[]; reposo?: number; transicion?: number; grano?: number;
  generarPatron?: (total: number, semilla: number, perfil: PerfilChladni, aspecto: number) => Grano[];
  alCambiar?: (indice: number) => void;
  /** Entrada: los granos salen de un punto (en px del lienzo) y viajan hasta la primera figura */
  entrada?: { origen: () => [number, number] | null; duracion: number };
}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reducido = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false, raf = 0, tiempo = 0, anterior = 0, ultimoCuadro = 0;
  let ancho = 0, alto = 0, aspecto = 0, cantidad = 0;
  let patrones: Float32Array[] = [];
  let tamanos = new Float32Array(0);
  let dispersiones = new Float32Array(0);
  let tintas = new Uint8Array(0);
  let pigmentos: HTMLCanvasElement[] = [];
  const reposo = opciones.reposo ?? 0;
  const ciclo = opciones.transicion ? reposo + opciones.transicion : 5500;
  let ultimoIndice = -1;
  // La entrada corre con su propio reloj; el ciclo de figuras arranca cuando termina
  const entrada = opciones.entrada;
  let tiempoEntrada = entrada && !reducido.matches ? 0 : Infinity;
  let retrasos = new Float32Array(0);
  let boca: [number, number] | null = null;
  const dibujarEntrada = () => {
    const radio = Math.min(ancho, alto) / 2;
    const escala = Math.min(1.3, Math.max(0.7, radio / 270));
    const [ox, oy] = boca!;
    const figura = patrones[0];
    const vuelo = 0.42;
    ctx.clearRect(0, 0, ancho, alto);
    for (let i = 0; i < cantidad; i++) {
      // Cada grano sale cuando le toca y llega con una curva suave
      const t = Math.min(1, Math.max(0, (tiempoEntrada / entrada!.duracion - retrasos[i]) / vuelo));
      if (t <= 0) continue;
      const k = 1 - (1 - t) ** 3;
      const x1 = figura[i * 2] * radio + ancho * opciones.centro[0];
      const y1 = figura[i * 2 + 1] * radio + alto * opciones.centro[1];
      // Punto de control desplazado: la arena se abre como un chorro, no en línea recta
      const cx = (ox + x1) / 2 + dispersiones[i * 2 + 1] * radio * 2.2;
      const cy = (oy + y1) / 2 - Math.abs(dispersiones[i * 2]) * radio * 2.6;
      const x = (1 - k) ** 2 * ox + 2 * (1 - k) * k * cx + k * k * x1;
      const y = (1 - k) ** 2 * oy + 2 * (1 - k) * k * cy + k * k * y1;
      const r = tamanos[i] * escala * (0.55 + 0.45 * k);
      ctx.drawImage(pigmentos[tintas[i]], x - r, y - r, r * 2, r * 2);
    }
  };
  const dibujar = () => {
    if (!cantidad) return;
    if (entrada && boca && tiempoEntrada < entrada.duracion) { dibujarEntrada(); return; }
    const fase = reducido.matches ? 0 : tiempo / ciclo;
    const indice = Math.floor(fase) % patrones.length;
    const siguiente = (indice + 1) % patrones.length;
    // Se abre la arena, viaja dispersa y vuelve a asentarse en la siguiente figura.
    const t = opciones.transicion
      ? Math.max(0, Math.min(1, ((tiempo % ciclo) - reposo) / opciones.transicion))
      : Math.min(1, (fase % 1) / 0.88);
    if (indice !== ultimoIndice) { ultimoIndice = indice; opciones.alCambiar?.(indice); }
    const mezcla = t * t * (3 - 2 * t);
    const origen = patrones[indice], destino = patrones[siguiente];
    const dispersion = Math.sin(Math.PI * t) ** 2;
    const radio = Math.min(ancho, alto) / 2;
    const escala = Math.min(1.3, Math.max(0.7, radio / 270));
    ctx.clearRect(0, 0, ancho, alto);
    for (let i = 0; i < cantidad; i++) {
      // Desvío fijo por identidad: dispersión local sin girar toda la composición.
      const dx = dispersiones[i * 2];
      const dy = dispersiones[i * 2 + 1];
      const x = (origen[i * 2] + (destino[i * 2] - origen[i * 2]) * mezcla + dx * dispersion) * radio + ancho * opciones.centro[0];
      const y = (origen[i * 2 + 1] + (destino[i * 2 + 1] - origen[i * 2 + 1]) * mezcla + dy * dispersion) * radio + alto * opciones.centro[1];
      const r = tamanos[i] * escala;
      ctx.drawImage(pigmentos[tintas[i]], x - r, y - r, r * 2, r * 2);
    }
  };
  const cuadro = (ahora: number) => {
    if (!opciones.pausado() && anterior) {
      if (entrada && tiempoEntrada < entrada.duracion) tiempoEntrada += Math.min(ahora - anterior, 50);
      else tiempo += ahora - anterior;
    }
    anterior = ahora;
    if (!opciones.pausado() && ahora - ultimoCuadro >= 1000 / 30) { dibujar(); ultimoCuadro = ahora; }
    raf = requestAnimationFrame(cuadro);
  };
  const activar = () => {
    cancelAnimationFrame(raf); anterior = 0;
    if (!visible || document.hidden || !cantidad) return;
    dibujar();
    if (!reducido.matches) raf = requestAnimationFrame(cuadro);
  };
  const medir = () => {
    ancho = canvas.clientWidth; alto = canvas.clientHeight;
    if (!ancho || !alto || !visible) { activar(); return; }
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(ancho * dpr); canvas.height = Math.round(alto * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pigmentos = opciones.tintas.map(variable => {
      const imagen = document.createElement("canvas"); imagen.width = imagen.height = 24;
      const pincel = imagen.getContext("2d")!;
      const color = getComputedStyle(canvas).getPropertyValue(variable).trim();
      const halo = pincel.createRadialGradient(12, 12, 0, 12, 12, 12);
      halo.addColorStop(0, color); halo.addColorStop(0.3, color); halo.addColorStop(1, "transparent");
      pincel.globalAlpha = 0.72; pincel.fillStyle = halo; pincel.fillRect(0, 0, 24, 24);
      return imagen;
    });
    const total = Math.min(opciones.particulas, 32000, Math.max(700, Math.round(ancho * alto * 0.09)));
    if (cantidad !== total || aspecto !== ancho / alto) {
      aspecto = ancho / alto;
      const figuras = (opciones.perfiles ?? [opciones.perfil, "sinte", "pulso"]).map(perfil =>
        (opciones.generarPatron
          ? opciones.generarPatron(total, opciones.semilla, perfil as PerfilChladni, aspecto)
          : generarGranos(total, opciones.semilla, perfil as PerfilChladni, undefined, aspecto)).sort((a, b) => {
          return Math.floor(a.tinta * pigmentos.length) - Math.floor(b.tinta * pigmentos.length)
            || Math.floor((a.y + 3) * 24) - Math.floor((b.y + 3) * 24) || a.x - b.x;
        }));
      cantidad = Math.min(...figuras.map(p => p.length));
      patrones = figuras.map(figura => {
        const datos = new Float32Array(cantidad * 2);
        for (let j = 0; j < cantidad; j++) { datos[j * 2] = figura[j].x; datos[j * 2 + 1] = figura[j].y; }
        return datos;
      });
      tamanos = new Float32Array(cantidad); tintas = new Uint8Array(cantidad);
      dispersiones = new Float32Array(cantidad * 2);
      for (let j = 0; j < cantidad; j++) {
        dispersiones[j * 2] = Math.sin(j * 127.1 + 0.7) * (0.06 + 0.13 * (0.5 + 0.5 * Math.sin(j * 19.7)));
        dispersiones[j * 2 + 1] = Math.sin(j * 311.7 + 2.3) * (0.06 + 0.13 * (0.5 + 0.5 * Math.sin(j * 23.1)));
        tamanos[j] = (0.65 + figuras[0][j].radio * 1.9) * (opciones.grano ?? 1);
        tintas[j] = Math.min(pigmentos.length - 1, Math.floor(figuras[0][j].tinta * pigmentos.length));
      }
    }
    boca = entrada?.origen() ?? null;
    if (boca) {
      // Primero salen los granos cercanos al cable; los lejanos, después
      const [ox, oy] = boca, radio = Math.min(ancho, alto) / 2;
      const distancias = Array.from({ length: cantidad }, (_, j) =>
        Math.hypot(patrones[0][j * 2] * radio + ancho * opciones.centro[0] - ox, patrones[0][j * 2 + 1] * radio + alto * opciones.centro[1] - oy));
      const lejos = distancias.reduce((a, b) => Math.max(a, b), 1);
      retrasos = Float32Array.from(distancias, (d, j) => (d / lejos) * 0.5 + (0.5 + 0.5 * Math.sin(j * 71.3)) * 0.08);
    }
    activar();
  };
  const tamano = new ResizeObserver(medir);
  const interseccion = new IntersectionObserver(([e]) => { visible = e.isIntersecting; medir(); });
  tamano.observe(canvas); interseccion.observe(canvas);
  reducido.addEventListener("change", activar); document.addEventListener("visibilitychange", activar);
  return () => {
    cancelAnimationFrame(raf); tamano.disconnect(); interseccion.disconnect();
    reducido.removeEventListener("change", activar); document.removeEventListener("visibilitychange", activar);
  };
}
