import { Arena } from "../arena";
import { Logo, Signo } from "../signos";
import { CuentaGrande } from "./cuenta";
import { CANALES, programa, sitio } from "@/lib/programa";

/* Cinta fina arriba de todo, como en los sitios de evento */
export function CintaSuperior() {
  const items = [sitio.fechas_largas, programa.sede.split(",")[0], `Entrada ${programa.entrada.split(",")[0].toLowerCase()}`, sitio.cta];
  const tramo = (
    <span className="flex shrink-0 items-center">
      {Array.from({ length: 4 }, (_, r) =>
        items.map((t, i) => (
          <span key={`${r}-${i}`} className="flex items-center gap-4 pr-4">
            {t}
            <Signo canal={CANALES[(i + r) % 3]} className="size-3" />
          </span>
        )),
      )}
    </span>
  );
  return (
    <div aria-hidden className="overflow-hidden bg-rosa py-2 text-vino">
      <div className="desfile rotulo flex w-max text-[0.75rem] font-semibold whitespace-nowrap">
        {tramo}
        {tramo}
      </div>
    </div>
  );
}

const SECCIONES = [
  ["#artistas", "Artistas"],
  ["#programa", "Programa"],
  ["#mapa", "Mapa"],
  ["#info", "Info"],
] as const;

export function Nav() {
  return (
    <nav aria-label="Secciones" className="sticky top-0 z-30 border-b border-blanco/10 bg-noche">
      <div className="mx-auto flex max-w-[80rem] items-center gap-8 px-5 py-3 md:px-8 lg:px-12">
        <a href="#inicio" aria-label="Ritmo Blanco, inicio" className="shrink-0">
          <Logo tinta="blanco" className="h-9 w-auto md:h-10" />
        </a>
        <ul className="ml-auto hidden gap-8 md:flex">
          {SECCIONES.map(([href, t]) => (
            <li key={href}>
              <a href={href} className="rotulo text-blanco/80 transition-colors hover:text-rosa">
                {t}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#artistas"
          className="rotulo ml-auto bg-rosa px-4 py-2.5 text-vino transition-colors hover:bg-blanco md:ml-0"
        >
          {sitio.cta}
        </a>
      </div>
    </nav>
  );
}

/*
  Portada: el titular del posteo, centrado y enorme, con la arena brillando
  sobre el vino noche y el degradé del afiche como luz.
*/
export function Hero() {
  const [antes, guino, despues] = sitio.titular;
  return (
    <header id="inicio" className="relative isolate flex min-h-[calc(100svh-6.5rem)] flex-col overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background: [
            "radial-gradient(55% 45% at 88% 8%, #edcdb8b3 0%, #e1b0c155 35%, transparent 70%)",
            "radial-gradient(60% 60% at 5% 95%, #767498cc 0%, transparent 70%)",
            "radial-gradient(45% 40% at 75% 85%, #e1b0c144 0%, transparent 70%)",
            "#2a0c17",
          ].join(","),
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          maskImage: "radial-gradient(ellipse 48% 42% at 50% 48%, transparent 35%, #000 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 48% 42% at 50% 48%, transparent 35%, #000 90%)",
        }}
      >
        <Arena particulas={16000} />
      </div>
      <div aria-hidden className="con-grano absolute inset-0 -z-10" />

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center md:py-24">
        <h1 className="sr-solo">Ritmo Blanco</h1>
        <p className="rotulo mb-8 text-rosa">
          {sitio.bajada} · {programa.dias.length} días · 3 canales
        </p>
        <p className="font-display text-[clamp(2.6rem,11.5vw,8.6rem)] leading-[0.86] font-bold tracking-[-0.03em] uppercase">
          <span className="block">{antes}</span>
          <span className="my-[0.08em] block">
            <mark className="inline-block bg-rosa px-[0.14em] pt-[0.06em] leading-[0.86] text-vino">{guino}</mark>
          </span>
          <span className="block text-[0.42em] leading-[1.1] font-light tracking-[-0.01em]">{despues}</span>
        </p>
        <div className="mt-12 md:mt-16">
          <CuentaGrande />
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <a href="#artistas" className="rotulo bg-rosa px-6 py-4 text-vino transition-colors hover:bg-blanco">
            {sitio.cta}
          </a>
          <a href="#programa" className="rotulo border border-blanco/40 px-6 py-4 transition-colors hover:border-blanco hover:bg-blanco hover:text-vino">
            Ver programa
          </a>
        </div>
      </div>

      <div className="rotulo mx-auto flex w-full max-w-[80rem] justify-between px-5 pb-6 text-blanco/70 md:px-8 lg:px-12">
        <span>{sitio.fechas_largas}</span>
        <span>{programa.sede.split(",")[0]}</span>
      </div>
    </header>
  );
}

/* Dos cintas cruzadas en rosa y lila, con texto vino */
export function FranjasCruzadas() {
  const cinta = (items: string[], inversa: boolean, clase: string) => {
    const tramo = (
      <span className="flex shrink-0 items-center">
        {Array.from({ length: 3 }, (_, r) =>
          items.map((t, i) => (
            <span key={`${r}-${i}`} className="flex items-center gap-6 pr-6">
              {t}
              <Signo canal={CANALES[(i + r) % 3]} className="size-6" />
            </span>
          )),
        )}
      </span>
    );
    return (
      <div className={`absolute left-[-10%] w-[120%] overflow-hidden py-3 text-vino ${clase}`}>
        <div
          className={`desfile flex w-max font-display text-2xl font-bold tracking-[-0.01em] whitespace-nowrap uppercase md:text-4xl ${inversa ? "desfile-inverso" : ""}`}
        >
          {tramo}
          {tramo}
        </div>
      </div>
    );
  };
  return (
    <div aria-hidden className="relative h-44 overflow-hidden md:h-60">
      {cinta(sitio.franjas[0], false, "top-8 -rotate-[4deg] bg-rosa md:top-10")}
      {cinta(sitio.franjas[1], true, "top-20 rotate-[3deg] bg-lila md:top-28")}
    </div>
  );
}
