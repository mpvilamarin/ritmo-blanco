"use client";

import { useSyncExternalStore } from "react";
import { crearStore } from "./estado";
import type { Modalidad, Tipo } from "./programa";

/* Estado del programa, compartido con el mapa ("Ver en el programa") */
export type EstadoPrograma = {
  dia: number;
  vista: "lineup" | "actividades";
  tipo: Tipo | null;
  modalidad: Modalidad | null;
  zona: string | null;
  abierta: string | null;
};

const store = crearStore<EstadoPrograma>({
  dia: 1,
  vista: "lineup",
  tipo: null,
  modalidad: null,
  zona: null,
  abierta: null,
});

export function usePrograma() {
  return useSyncExternalStore(store.suscribir, store.obtener, store.inicial);
}

export function cambiarPrograma(parcial: Partial<EstadoPrograma>) {
  store.cambiar({ ...store.obtener(), ...parcial });
}

export function irAlPrograma(parcial: Partial<EstadoPrograma>) {
  cambiarPrograma(parcial);
  const el = document.getElementById("programa");
  if (!el) return;
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 10, behavior: quieto ? "auto" : "smooth" });
}
