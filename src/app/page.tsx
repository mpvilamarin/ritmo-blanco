import { Degrade } from "@/components/degrade";
import { Guino, Logo, Modo, Signo, TipoEtiqueta, ZonaEtiqueta } from "@/components/signos";
import { Titulo } from "@/components/titulo";
import { CANALES, programa } from "@/lib/programa";

export default function Inicio() {
  const [dia] = programa.dias;
  return (
    <>
      <Degrade />
      <main className="reticula gap-y-8 py-16">
        <Logo className="col-span-2 w-full" />
        <Titulo fuerte={dia.nombre[0]} suave={dia.nombre[1]} className="col-span-3 text-6xl" />
        <p className="col-span-full font-display text-3xl font-bold">
          El festival más <Guino>ruidoso</Guino>
        </p>
        <div className="col-span-full flex flex-wrap items-center gap-3">
          {CANALES.map((c) => (
            <Signo key={c} canal={c} className="size-8" />
          ))}
          <TipoEtiqueta tipo="TALLER" />
          <Modo modalidad="presencial" conTexto />
          <Modo modalidad="hibrida" conTexto />
          <Modo modalidad="virtual" conTexto />
          {Object.entries(programa.zonas).map(([n, z]) => (
            <ZonaEtiqueta key={n} nombre={n} zona={z} />
          ))}
        </div>
        <div className="col-span-full h-[200vh]" />
      </main>
    </>
  );
}
