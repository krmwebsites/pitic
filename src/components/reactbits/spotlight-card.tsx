"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";

/**
 * React Bits „Spotlight Card“ (reactbits.dev/components/spotlight-card), kohandatud:
 * ilma oma taustavärvide ja nurkadeta (need tulevad meie .surface klassist),
 * salvei-tooniline pehme valgusvihk, mis järgib kursorit. Ilma sõltuvusteta.
 * Litsents: MIT + Commons Clause (React Bits).
 */
type Props = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
};

export function SpotlightCard({ children, className = "", spotlightColor = "rgba(64, 88, 71, 0.14)" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ease-out motion-reduce:hidden"
        style={{
          opacity,
          background: `radial-gradient(28rem circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
