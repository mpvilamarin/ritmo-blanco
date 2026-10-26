"use client";

import { useEffect, useRef, useState } from "react";

/*
  Pisadas: huellas en la arena, como pasos de baile. Son el hilo que conecta
  las secciones; aparecen de a una cuando entran en pantalla.
*/
export function Pisadas({
  pasos = 6,
  horizontal = false,
  className = "",
}: {
  pasos?: number;
  horizontal?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`flex ${horizontal ? "flex-row items-center gap-5" : "flex-col items-center gap-3"} ${className}`}
    >
      {Array.from({ length: pasos }, (_, i) => {
        const izquierda = i % 2 === 0;
        const giro = (horizontal ? 90 : 180) + (izquierda ? -8 : 8) + ((i * 7) % 5) - 2;
        const corrimiento = izquierda ? -9 : 9;
        return (
          <svg
            key={i}
            viewBox="0 0 20 46"
            className="h-11 w-5 transition-[opacity,transform] duration-500 ease-[var(--ease-reposo)]"
            style={{
              transitionDelay: `${i * 140}ms`,
              opacity: visible ? 1 : 0,
              transform: `${horizontal ? `translateY(${corrimiento}px)` : `translateX(${corrimiento}px)`} rotate(${giro}deg) scaleX(${izquierda ? -1 : 1}) scale(${visible ? 1 : 0.85})`,
            }}
          >
            <path d="M10 1C15.5 1 18.5 5.5 18.5 12C18.5 19 15.5 25 10.5 25C5.5 25 2 20 2 13C2 6 5 1 10 1Z" fill="url(#arena-pisada)" />
            <ellipse cx="10" cy="37" rx="6.5" ry="8" fill="url(#arena-pisada)" />
          </svg>
        );
      })}
    </div>
  );
}

/* Trama de granos para rellenar las huellas: rosa, lila y melocotón */
export function DefsArena() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <pattern id="arena-pisada" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="0.8" cy="0.9" r="0.75" fill="#e1b0c1" />
          <circle cx="2.9" cy="1.6" r="0.6" fill="#b3a5ba" />
          <circle cx="1.7" cy="3.2" r="0.5" fill="#767498" />
          <circle cx="3.6" cy="3.5" r="0.5" fill="#edcdb8" />
        </pattern>
      </defs>
    </svg>
  );
}
