import { programa } from "@/lib/programa";

export default function Inicio() {
  return (
    <main className="reticula py-16">
      <h1 className="col-span-full font-display text-5xl font-bold uppercase">
        {programa.festival}
      </h1>
    </main>
  );
}
