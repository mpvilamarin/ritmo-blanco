import { Pisadas } from "../pisadas";
import { Encabezado } from "../recursos";
import { Guino } from "../signos";
import { sitio } from "@/lib/programa";

/* Tres pasos con número grande, unidos por pisadas */
export function ComoFunciona() {
  const t = sitio.pasos;
  return (
    <section id="como" aria-labelledby="como-titulo" className="reticula gap-y-12 pt-24 md:pt-36">
      <Encabezado id="como-titulo" rotulo={t.rotulo} titulo={t.titulo} centrado ancho="max-w-[26rem]" />
      <ol className="col-span-full grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-4 lg:col-span-10 lg:col-start-2">
        {t.lista.map((paso, i) => (
          <li key={paso.titulo} className="contents">
            <div className="flex flex-col items-center text-center">
              <span aria-hidden className="font-display text-[6.5rem] leading-[0.85] font-bold text-rosa md:text-[8rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-2xl leading-tight font-bold uppercase">
                <span className="sr-solo">Paso {i + 1}: </span>
                {paso.titulo}
              </h3>
              <p className="mt-2 max-w-[18rem] text-base">
                {paso.texto} {"guino" in paso && <Guino>{paso.guino}</Guino>}
              </p>
            </div>
            {i < t.lista.length - 1 && (
              <>
                <Pisadas pasos={3} className="my-6 md:hidden" />
                <Pisadas horizontal pasos={3} className="hidden pt-12 md:flex" />
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
