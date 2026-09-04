"use client";

import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * React Bits „Count Up“ (reactbits.dev/text-animations/count-up), kohandatud:
 * täisarvud, eesti vormindus, reduced-motion korral kohe lõppväärtus.
 * Serveris ja enne vaatevälja jõudmist on tekstiks lõppväärtus, nii et number
 * on alati olemas (ka ilma JS-ita); animatsioon algab alles nähtavaks saades.
 * Litsents: MIT + Commons Clause (React Bits).
 */
type Props = {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
};

export function CountUp({ to, from = 0, duration = 1.2, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(from);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (reduced || !inView) return;
    const element = ref.current;
    if (!element) return;
    element.textContent = from.toLocaleString("et-EE");
    const unsubscribe = spring.on("change", (latest: number) => {
      element.textContent = Math.round(latest).toLocaleString("et-EE");
    });
    motionValue.set(to);
    return () => {
      unsubscribe();
      element.textContent = to.toLocaleString("et-EE");
    };
  }, [inView, reduced, spring, motionValue, from, to]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {to.toLocaleString("et-EE")}
    </span>
  );
}
