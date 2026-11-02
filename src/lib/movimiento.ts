"use client";

import { useSyncExternalStore } from "react";
import { crearStore } from "./estado";

/*
  Pausa global del movimiento (WCAG 2.2.2): la usan la arena del hero, la de
  Qué es y el carrusel del line-up. Marca <html data-quieto> para que el CSS
  frene las animaciones.
*/
const store = crearStore(false);

export function useQuieto() {
  return useSyncExternalStore(store.suscribir, store.obtener, store.inicial);
}

export const estaQuieto = () => store.obtener();

export function alternarMovimiento() {
  const quieto = !store.obtener();
  store.cambiar(quieto);
  document.documentElement.toggleAttribute("data-quieto", quieto);
}
