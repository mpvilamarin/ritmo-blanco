/*
  Placa de Chladni interactiva. No dibuja una figura precalculada: cada grano
  salta en proporción a cuánto vibra la placa donde está parado. Donde la
  placa no se mueve (las líneas nodales) los granos dejan de saltar y ahí se
  acumulan. Es una aproximación de una placa cuadrada ideal, no su física exacta.
*/

/** Hz por unidad de n² + m²: fija dónde caen las resonancias en el deslizador */
const K = 40;
export const RANGO: [number, number] = [160, 1600];

/* Modos (n, m) de la placa ordenados por frecuencia */
export const RESONANCIAS = [
  [1, 2], [1, 3], [2, 3], [1, 4], [2, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 6],
].map(([n, m]) => ({ n, m, hz: K * (n * n + m * m) }));

/** Qué tan cerca está una frecuencia de la resonancia más próxima (0 a 1) */
const ANCHO = 26;
export const sintonia = (hz: number) => Math.max(...RESONANCIAS.map((r) => 1 / (1 + ((hz - r.hz) / ANCHO) ** 2)));

const MEDIO_PI = Math.PI / 2;
const modo = (x: number, y: number, n: number, m: number) =>
  Math.cos(n * MEDIO_PI * x) * Math.cos(m * MEDIO_PI * y) + Math.cos(m * MEDIO_PI * x) * Math.cos(n * MEDIO_PI * y);

export type Placa = {
  frecuencia: (hz: number) => void;
  /** Golpe en un punto de la placa (coordenadas del lienzo, en px); sin punto, arena nueva */
  sacudir: (px?: number, py?: number) => void;
  guardar: (pie: string, archivo: string) => void;
  detener: () => void;
};

export function iniciarPlaca(canvas: HTMLCanvasElement, opciones: { hz: number; tinta: string; fondo: string }): Placa {
  const ctx = canvas.getContext("2d")!;
  const reducido = matchMedia("(prefers-reduced-motion: reduce)");
  let hz = opciones.hz;
  // La placa mide 2 de alto y 2 × aspecto de ancho: un rectángulo muestra más figura a los costados
  let ancho = 0, alto = 0, aspecto = 1, cantidad = 0, raf = 0, visible = false;
  let xs = new Float32Array(0), ys = new Float32Array(0);
  let activos: { n: number; m: number; peso: number }[] = [];
  let quietud = 0;

  const sintonizar = () => {
    activos = RESONANCIAS.map((r) => ({ n: r.n, m: r.m, peso: 1 / (1 + ((hz - r.hz) / ANCHO) ** 2) })).filter((r) => r.peso > 0.04);
    quietud = Math.max(0, ...activos.map((r) => r.peso));
  };

  const sembrar = () => {
    for (let i = 0; i < cantidad; i++) { xs[i] = (Math.random() * 2 - 1) * aspecto; ys[i] = Math.random() * 2 - 1; }
  };

  const vibracion = (x: number, y: number, ruido: number) => {
    let a = ruido;
    for (const r of activos) a += r.peso * Math.abs(modo(x, y, r.n, r.m)) * 0.5;
    return a;
  };

  // Un paso: cada grano salta según cuánto vibra la placa en su lugar. Los
  // saltos hacia donde vibra menos casi siempre se aceptan; los otros, pocas
  // veces: así la arena va derivando hacia las líneas quietas.
  const paso = () => {
    const ruido = 0.55 * (1 - quietud);
    for (let i = 0; i < cantidad; i++) {
      const x = xs[i], y = ys[i];
      const antes = vibracion(x, y, ruido);
      const salto = 0.007 + antes * 0.05;
      const nx = Math.max(-aspecto, Math.min(aspecto, x + (Math.random() * 2 - 1) * salto));
      const ny = Math.max(-1, Math.min(1, y + (Math.random() * 2 - 1) * salto));
      if (vibracion(nx, ny, ruido) <= antes || Math.random() < 0.3) { xs[i] = nx; ys[i] = ny; }
    }
  };

  const pintar = (destino = ctx, w = ancho, h = alto) => {
    const s = Math.max(1.2, h / 380);
    destino.fillStyle = opciones.fondo;
    destino.fillRect(0, 0, w, h);
    destino.fillStyle = opciones.tinta;
    const cx = w / 2, medio = h / 2;
    for (let i = 0; i < cantidad; i++) destino.fillRect(cx + xs[i] * medio - s / 2, medio + ys[i] * medio - s / 2, s, s);
  };

  // Con movimiento reducido la arena se asienta sin animación
  const asentar = () => { for (let k = 0; k < 160; k++) paso(); pintar(); };

  const cuadro = () => {
    paso(); paso();
    pintar();
    raf = requestAnimationFrame(cuadro);
  };
  const activar = () => {
    cancelAnimationFrame(raf); raf = 0;
    if (!visible || document.hidden || !cantidad) return;
    if (reducido.matches) asentar();
    else raf = requestAnimationFrame(cuadro);
  };

  const medir = () => {
    ancho = canvas.clientWidth; alto = canvas.clientHeight;
    if (!ancho || !alto) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(ancho * dpr); canvas.height = Math.round(alto * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const total = Math.round(Math.min(26000, Math.max(9000, ancho * alto * 0.07)));
    if (total !== cantidad || Math.abs(aspecto - ancho / alto) > 0.01) {
      cantidad = total;
      aspecto = ancho / alto;
      xs = new Float32Array(cantidad); ys = new Float32Array(cantidad);
      sembrar();
    }
    activar();
  };

  const tamano = new ResizeObserver(medir);
  const interseccion = new IntersectionObserver(([e]) => { visible = e.isIntersecting; activar(); });
  tamano.observe(canvas); interseccion.observe(canvas);
  reducido.addEventListener("change", activar);
  document.addEventListener("visibilitychange", activar);
  sintonizar();

  return {
    frecuencia(nuevo) {
      hz = nuevo; sintonizar();
      if (reducido.matches) activar();
    },
    sacudir(px, py) {
      if (px === undefined || py === undefined) sembrar();
      else {
        const cx = (px - ancho / 2) / (alto / 2), cy = (py - alto / 2) / (alto / 2);
        for (let i = 0; i < cantidad; i++) {
          if (Math.hypot(xs[i] - cx, ys[i] - cy) > 0.4) continue;
          xs[i] = Math.max(-aspecto, Math.min(aspecto, xs[i] + (Math.random() * 2 - 1) * 0.3));
          ys[i] = Math.max(-1, Math.min(1, ys[i] + (Math.random() * 2 - 1) * 0.3));
        }
      }
      if (reducido.matches) activar();
    },
    guardar(pie, archivo) {
      // Imagen de 2000 px de ancho, con la proporción de la placa y un pie de texto
      const w = 2000, h = Math.round(w / aspecto);
      const salida = document.createElement("canvas");
      salida.width = w; salida.height = h;
      const c = salida.getContext("2d")!;
      pintar(c, w, h);
      c.fillStyle = opciones.fondo;
      c.fillRect(0, h - 80, w, 80);
      c.fillStyle = opciones.tinta;
      c.font = `500 34px ${getComputedStyle(document.body).fontFamily}`;
      c.fillText(pie, 48, h - 28);
      salida.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = archivo;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }, "image/png");
    },
    detener() {
      cancelAnimationFrame(raf); tamano.disconnect(); interseccion.disconnect();
      reducido.removeEventListener("change", activar); document.removeEventListener("visibilitychange", activar);
    },
  };
}
