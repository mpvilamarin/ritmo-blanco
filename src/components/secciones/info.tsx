import { Guino, Logo, Texto } from "../signos";
import { Encabezado } from "../recursos";
import { sitio } from "@/lib/programa";

export function Info() {
  const t = sitio.info;
  return (
    <section id="info" aria-labelledby="info-titulo" className="reticula gap-y-10 pt-24 md:pt-32">
      <Encabezado id="info-titulo" rotulo={t.rotulo} titulo={t.titulo} />
      <dl className="col-span-full grid gap-x-6 md:grid-cols-2 lg:grid-cols-4">
        {t.items.map((item) => (
          <div key={item.rotulo} className="filete py-3">
            <dt className="rotulo">{item.rotulo}</dt>
            <dd className="mt-1.5 font-display text-lg leading-snug">
              <Texto>{item.texto}</Texto>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* Pie: sponsors en una franja propia, mismo peso y un solo color */
export function Pie() {
  return (
    <footer className="reticula mt-24 gap-y-10 pb-10 md:mt-32">
      <div className="col-span-full filete pt-4">
        <p className="rotulo">Acompañan</p>
        {/* Logos de sponsors pendientes: por ahora, los nombres en vino */}
        <ul className="mt-4 grid grid-cols-2 gap-y-4 md:grid-cols-4">
          {sitio.sponsors.map((s) => (
            <li key={s} className="font-display text-2xl font-bold md:text-center md:text-3xl">
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-full flex flex-col gap-8 filete pt-8 md:flex-row md:items-end md:justify-between">
        <Logo className="w-48 md:w-64" />
        <div className="md:text-right">
          <p className="font-display text-3xl leading-tight uppercase">
            <span className="font-bold">{sitio.despedida[0]}</span> <Guino>{sitio.despedida[1]}</Guino>
          </p>
          <p className="rotulo mt-3">{sitio.redes}</p>
        </div>
      </div>
      <p className="rotulo col-span-full">{sitio.credito}</p>
    </footer>
  );
}
