"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import { useMemo, type ElementType } from "react";

/**
 * React Bits „Blur Text“ (reactbits.dev/text-animations/blur-text), kohandatud:
 * - renderdatakse semantilise elemendina (nt h1), mitte <p>;
 * - reduced-motion korral kuvatakse tekst kohe ilma liikumiseta;
 * - vaikeväärtused on tagasihoidlikud (väike nihe, lühike hägu), nagu spetsifikatsioon nõuab.
 * Litsents: MIT + Commons Clause (React Bits).
 */
type Props = {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  /** Viivitus sõnade vahel millisekundites. */
  delay?: number;
  animateBy?: "words" | "letters";
  stepDuration?: number;
};

export function BlurText({ text, as: Tag = "p", id, className = "", delay = 70, animateBy = "words", stepDuration = 0.3 }: Props) {
  const reduced = useReducedMotion();
  const elements = useMemo(() => (animateBy === "words" ? text.split(" ") : text.split("")), [text, animateBy]);

  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  const from = { filter: "blur(8px)", opacity: 0, y: 14 };
  const keyframes = { filter: ["blur(8px)", "blur(3px)", "blur(0px)"], opacity: [0, 0.6, 1], y: [14, 3, 0] };

  return (
    <Tag id={id} className={className} aria-label={text}>
      {elements.map((segment, index) => {
        const transition: Transition = {
          duration: stepDuration * 2,
          times: [0, 0.5, 1],
          delay: (index * delay) / 1000,
          ease: [0.22, 1, 0.36, 1],
        };
        return (
          <motion.span
            key={`${segment}-${index}`}
            aria-hidden="true"
            initial={from}
            animate={keyframes}
            transition={transition}
            style={{ display: "inline-block", willChange: "transform, filter, opacity" }}
          >
            {segment === " " ? " " : segment}
            {animateBy === "words" && index < elements.length - 1 && " "}
          </motion.span>
        );
      })}
    </Tag>
  );
}
