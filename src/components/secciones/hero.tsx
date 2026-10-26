import { Arena } from "../arena";
import { ANCHO, curvaNodal, trazo } from "../recursos";
import { Logo } from "../signos";
import { Titulo } from "../titulo";
import { programa, sitio } from "@/lib/programa";

/*
  Hero (de 07): la foto del KV a sangre y a pantalla completa, con el degradé
  del sistema encima; el logo grande y centrado; el titular, la fecha y la
  sede. El borde inferior es una curva nodal de Chladni que corta hacia la
  sección siguiente.

  Falta la foto del KV: mientras tanto, el lugar de la foto lo ocupa el
  degradé del sistema (assets/fondo-degrade.png) con la arena encima, y queda
  marcado [FOTO DEL KV]. Para ponerla: guardarla en public/fotos/kv.jpg y
  completar FOTO_KV.
*/
const FOTO_KV: string | null = null;

/* Alto del corte en px: la curva vive en esa franja */
const CORTE = 120;
const CURVA = curvaNodal(2, 5, 0.42, ANCHO, CORTE);

// Máscara: todo lo que queda por encima de la curva se ve
const MASCARA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${CORTE}" preserveAspectRatio="none"><path d="M0 0L${ANCHO} 0L${[...CURVA]
  .reverse()
  .map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`)
  .join("L")}Z"/></svg>`;
const MASCARA = `linear-gradient(#000,#000), url("data:image/svg+xml,${encodeURIComponent(MASCARA_SVG)}")`;

const SECCIONES = [
  ["#que-es", "Qué es"],
  ["#artistas", "Artistas"],
  ["#programa", "Programa"],
  ["#mapa", "Mapa"],
  ["#preguntas", "Preguntas"],
] as const;

export function Hero() {
  const [antes, guino, despues] = sitio.titular;
  const mascara = {
    maskImage: MASCARA,
    WebkitMaskImage: MASCARA,
    maskSize: `100% calc(100% - ${CORTE - 1}px), 100% ${CORTE}px`,
    WebkitMaskSize: `100% calc(100% - ${CORTE - 1}px), 100% ${CORTE}px`,
    maskPosition: "top, bottom",
    WebkitMaskPosition: "top, bottom",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  } as const;

  return (
    <header id="inicio" className="relative isolate flex min-h-[100svh] flex-col">
      {/* Foto a sangre + degradé del sistema + arena, recortados por la curva */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden" style={mascara}>
        {FOTO_KV && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={FOTO_KV} alt="" className="absolute inset-0 size-full object-cover" />
        )}
        <div
          className="con-grano absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/fondos/degrade.jpg)", opacity: FOTO_KV ? 0.75 : 1 }}
        />
        <div className="absolute inset-0 opacity-90">
          <Arena particulas={18000} />
        </div>
      </div>
      <svg
        aria-hidden
        viewBox={`0 0 ${ANCHO} ${CORTE}`}
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 -z-10 block w-full"
        style={{ height: CORTE }}
      >
        <path d={trazo(CURVA)} fill="none" stroke="#692136" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      </svg>

      <nav aria-label="Secciones" className="reticula items-center py-5">
        <p className="rotulo col-span-2 md:col-span-3">
          {sitio.fechas_largas.replace(" de noviembre", ".11").replace("14 al 16", "14—16")} · {programa.sede.split(",")[0]}
        </p>
        <ul className="col-span-6 hidden justify-center gap-7 lg:flex">
          {SECCIONES.map(([href, t]) => (
            <li key={href}>
              <a href={href} className="rotulo underline-offset-4 hover:underline">
                {t}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#canales"
          className="rotulo col-span-2 justify-self-end bg-vino px-4 py-2.5 text-blanco transition-colors hover:bg-lila-oscuro md:col-span-5 lg:col-span-3"
        >
          {sitio.cta}
        </a>
      </nav>

      <div className="reticula flex-1 content-center gap-y-8 pt-10 text-center" style={{ paddingBottom: CORTE + 24 }}>
        <h1 className="col-span-full mx-auto w-[88%] md:col-span-6 md:col-start-2 md:w-full lg:col-span-6 lg:col-start-4">
          <Logo className="w-full" />
        </h1>
        <p className="rotulo col-span-full">{sitio.bajada}</p>
        <div className="col-span-full md:col-span-6 md:col-start-2 lg:col-span-8 lg:col-start-3">
          <Titulo
            as="p"
            fuerte={
              <>
                {antes} <mark className="inline-block bg-rosa px-[0.12em] pt-[0.04em] leading-[0.86] text-vino">{guino}</mark>
              </>
            }
            suave={despues}
            max={84}
            className="text-4xl"
          />
        </div>
        <p className="rotulo col-span-full text-[0.8125rem]">
          {sitio.fechas_largas} · {programa.sede}
        </p>
      </div>

      <p className="rotulo absolute bottom-[calc(120px+0.75rem)] left-[var(--margen)] bg-blanco/75 px-2 py-1">
        [FOTO DEL KV]
      </p>
    </header>
  );
}
