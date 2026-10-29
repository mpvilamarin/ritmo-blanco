import { programa } from "@/lib/programa";
import { FECHAS, PALETA } from "@/lib/rb";

/*
  Cintas onduladas con texto corrido sobre la onda: una vino con texto rosa y
  una lila oscuro con texto blanco, cruzadas sobre el corte del hero.
*/
const ONDA = "M0,45 Q100,28 200,45 T400,45 T600,45 T800,45 T1000,45 T1200,45 T1400,45 T1600,45";

function Cinta({ id, banda, tinta, palabras, clase }: { id: string; banda: string; tinta: string; palabras: string[]; clase: string }) {
  const texto = `${palabras.join("   ✦   ")}   ✦   `.repeat(2);
  return (
    <div className={`flex w-max ${clase}`}>
      {[0, 1, 2].map((k) => (
        <svg key={k} viewBox="0 0 1600 90" width="1600" height="90" className="block flex-none overflow-visible">
          <path id={`${id}-${k}`} d={ONDA} fill="none" stroke={banda} strokeWidth="58" />
          <text fill={tinta} dominantBaseline="central" className="font-display text-[24px] font-extrabold tracking-[0.04em] uppercase">
            <textPath href={`#${id}-${k}`} textLength="1630" lengthAdjust="spacing">
              {texto}
            </textPath>
          </text>
        </svg>
      ))}
    </div>
  );
}

export function Cintas() {
  const nombres = programa.dias.map((d) => d.nombre.join(" "));
  return (
    <div aria-hidden className="pointer-events-none relative z-10 -mt-16 -mb-12 h-[clamp(140px,12vw,180px)] overflow-hidden">
      <div className="absolute -inset-x-[4%] top-[14%] -rotate-[2.5deg]">
        <Cinta id="cinta-a" banda={PALETA.vino} tinta={PALETA.rosa} palabras={[...nombres, FECHAS.lista]} clase="rb-cinta-izq" />
      </div>
      <div className="absolute -inset-x-[4%] top-[38%] rotate-2">
        <Cinta
          id="cinta-b"
          banda={PALETA.lilaOscuro}
          tinta={PALETA.blanco}
          palabras={["Tumbao", "Pulso", "Sinte", "0 parlantes", "La energía la ponés vos"]}
          clase="rb-cinta-der"
        />
      </div>
    </div>
  );
}
