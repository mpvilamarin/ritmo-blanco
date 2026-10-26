"use client";

import { useSyncExternalStore } from "react";
import { CANALES, type CanalId, type Modalidad, type Tipo } from "./programa";

/*
  Estado compartido entre secciones sin provider: el canal elegido (se guarda
  en el navegador) y los filtros del programa (el mapa también los cambia).
*/

function crearStore<T>(inicial: T, leerGuardado?: () => T) {
  let valor = inicial;
  let leido = !leerGuardado;
  const oyentes = new Set<() => void>();
  return {
    obtener() {
      if (!leido) {
        leido = true;
        valor = leerGuardado!();
      }
      return valor;
    },
    inicial: () => inicial,
    cambiar(nuevo: T) {
      valor = nuevo;
      oyentes.forEach((o) => o());
    },
    suscribir(o: () => void) {
      oyentes.add(o);
      return () => oyentes.delete(o);
    },
  };
}

const CLAVE = "ritmo-blanco:canal";

const canalStore = crearStore<CanalId | null>(null, () => {
  try {
    const v = localStorage.getItem(CLAVE);
    return CANALES.includes(v as CanalId) ? (v as CanalId) : null;
  } catch {
    return null;
  }
});

export function useCanal() {
  return useSyncExternalStore(canalStore.suscribir, canalStore.obtener, canalStore.inicial);
}

export function elegirCanal(canal: CanalId | null) {
  canalStore.cambiar(canal);
  try {
    if (canal) localStorage.setItem(CLAVE, canal);
    else localStorage.removeItem(CLAVE);
  } catch {}
}

export type Filtros = { zona: string[]; tipo: Tipo[]; modalidad: Modalidad[] };
const SIN_FILTROS: Filtros = { zona: [], tipo: [], modalidad: [] };
const filtrosStore = crearStore<Filtros>(SIN_FILTROS);

export function useFiltros() {
  return useSyncExternalStore(filtrosStore.suscribir, filtrosStore.obtener, filtrosStore.inicial);
}

export function alternarFiltro<K extends keyof Filtros>(grupo: K, valor: Filtros[K][number]) {
  const actual = filtrosStore.obtener();
  const lista = actual[grupo] as Filtros[K][number][];
  const nueva = lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
  filtrosStore.cambiar({ ...actual, [grupo]: nueva });
}

export function soloZona(zona: string) {
  filtrosStore.cambiar({ ...filtrosStore.obtener(), zona: [zona] });
}

export function limpiarFiltros() {
  filtrosStore.cambiar(SIN_FILTROS);
}
