import type { Metadata } from "next";
import { Cronograma } from "@/components/cronograma";

export const metadata: Metadata = {
  title: "Ritmo Blanco · Cronograma",
};

/*
  Página de impresión del cronograma: un pliego A3 apaisado con el degradé del
  sistema de fondo. De acá sale public/ritmo-blanco-cronograma.pdf
  (npm run pdf, con el servidor de desarrollo corriendo).
*/
export default function PaginaCronograma() {
  return (
    <>
      <style>{"@page{size:420mm 297mm;margin:0}html,body{background:#fff}"}</style>
      <main
        className="con-grano relative min-h-screen px-10 py-8"
        style={{
          background:
            "linear-gradient(rgba(255,255,255,.72), rgba(255,255,255,.72)), url(/fondos/degrade.jpg) center / cover no-repeat",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
        }}
      >
        <h1 className="sr-solo">Ritmo Blanco · Cronograma 14 al 16 de noviembre</h1>
        <Cronograma />
      </main>
    </>
  );
}
