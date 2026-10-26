import { Arena } from "../arena";
import { Guino, Logo, Signo } from "../signos";
import { CANALES, programa, sitio } from "@/lib/programa";

/*
  Portada: la misma composición que el posteo "El festival más ruidoso".
  Fondo frío profundo abajo a la izquierda, donde va el texto blanco: lila
  oscuro mezclado con vino para que el texto chico pase 4.5:1 y la luz cálida arriba a la derecha, donde vive la arena.
*/
export function Portada() {
  const [antes, guino, despues] = sitio.titular;
  return (
    <header
      id="inicio"
      className="sobre-oscuro con-grano relative flex min-h-[100svh] flex-col overflow-hidden text-blanco"
      style={{
        background: [
          "radial-gradient(75% 55% at 105% -5%, #fff0db 0%, #f8d9c4 22%, #f0bdbd 45%, #e1b0c100 75%)",
          "radial-gradient(60% 45% at 115% 60%, #ffe2c6b3 0%, #f6c7ba00 70%)",
          "radial-gradient(100% 75% at 0% 100%, #5e4a72 0%, #67597d 45%, #6a5f8600 85%)",
          "linear-gradient(195deg, #b3a5ba 0%, #9195b4 18%, #767498 36%, #5e4a72 90%)",
        ].join(","),
      }}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          maskImage: "radial-gradient(110% 80% at 100% 0%, #000 35%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(110% 80% at 100% 0%, #000 35%, transparent 78%)",
        }}
      >
        <Arena />
      </div>

      <div className="reticula relative flex-1 content-between gap-y-10 pt-8 pb-16 md:pt-12 lg:pt-28">
        <div className="col-span-full">
          <h1 className="w-[62%] max-w-[26rem]">
            <Logo tinta="blanco" className="w-full" />
          </h1>
        </div>

        <div className="relative col-span-full md:col-span-6 lg:col-span-7">
          {/* Velo difuso detrás del texto: sostiene el contraste sobre la arena */}
          <div
            aria-hidden
            className="absolute -inset-x-16 -inset-y-20 -z-10"
            style={{ background: "radial-gradient(closest-side, #5e4a72f2 55%, #5e4a7200)" }}
          />
          <p className="rotulo mb-5">{sitio.bajada}</p>
          <p className="font-display text-[clamp(2.1rem,9.6vw,4.6rem)] leading-[0.95] uppercase">
            <span className="block font-bold">{antes}</span>
            <span className="my-[0.08em] block text-[1.42em] leading-[0.95] font-bold">
              <Guino>{guino}</Guino>
            </span>
            <span className="block text-[0.6em] font-light">{despues}</span>
          </p>
          <p className="rotulo mt-7 text-[0.75rem]">
            {sitio.fechas_largas} · {programa.sede.split(",")[0]}
          </p>
          <p className="rotulo mt-2 text-[0.75rem]">Entrada {programa.entrada.toLowerCase()}</p>
          <a
            href="#canal"
            className="rotulo mt-7 inline-flex items-center gap-3 bg-blanco px-4 py-3 text-[0.75rem] text-vino transition-colors hover:bg-rosa"
          >
            {sitio.cta}
            <span className="flex gap-1">
              {CANALES.map((c) => (
                <Signo key={c} canal={c} className="size-3.5" />
              ))}
            </span>
          </a>
        </div>
      </div>

      {/* Fundido hacia el degradé claro de la página */}
      <div aria-hidden className="h-24 bg-gradient-to-b from-[#5e4a72] to-transparent" />
    </header>
  );
}
