import { Pisadas } from "../pisadas";
import { Guino } from "../signos";
import { Titulo } from "../titulo";
import { sitio } from "@/lib/programa";

/* Tres pasos unidos por pisadas: en vertical en el celular, en fila desde tablet */
export function ComoFunciona() {
  const t = sitio.pasos;
  return (
    <section id="como" aria-labelledby="como-titulo" className="reticula gap-y-10 pt-12 md:pt-20">
      <div id="como-titulo" className="col-span-3 md:col-span-4 lg:col-span-5">
        <Titulo fuerte={t.titulo[0]} suave={t.titulo[1]} max={130} className="text-6xl" />
      </div>
      <ol className="col-span-full grid gap-0 md:grid-cols-3 md:gap-6">
        {t.lista.map((paso, i) => (
          <li key={paso.titulo} className="flex flex-col">
            <div className="filete flex items-start gap-4 pt-3">
              <span className="font-display text-[5.5rem] leading-[0.8] font-bold text-rosa" aria-hidden>
                {i + 1}
              </span>
              <div className="pt-1">
                <h3 className="font-display text-2xl leading-tight font-bold uppercase">
                  <span className="sr-solo">Paso {i + 1}: </span>
                  {paso.titulo}
                </h3>
                <p className="mt-2 text-base">
                  {paso.texto} {"guino" in paso && <Guino>{paso.guino}</Guino>}
                </p>
              </div>
            </div>
            {i < t.lista.length - 1 && (
              <Pisadas pasos={3} className="my-4 md:hidden" />
            )}
          </li>
        ))}
      </ol>
      <Pisadas horizontal pasos={9} className="col-span-full hidden justify-center md:flex" />
    </section>
  );
}
