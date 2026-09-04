"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Tagasihoidlik kerimisel ilmumine suurtele sektsioonidele (≤16 px, 360 ms).
 * Peidetakse ainult sisu, mis on laadimisel vaateaknast allpool; ilma JS-ita,
 * reduced-motion korral ja hiljemalt 1,5 s pärast on sisu igal juhul nähtav.
 */
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    // Juba vaateaknas olev sisu jääb kohe nähtavaks.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    element.classList.add("reveal");
    const show = () => {
      element.classList.add("is-visible");
      observer.disconnect();
      window.clearTimeout(timer);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) show();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    observer.observe(element);
    const timer = window.setTimeout(show, 1500);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  // Tag on kitsalt piiratud liit, seetõttu on ref-tüüp siin ohutu.
  const Component = Tag as "div";
  return (
    <Component ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </Component>
  );
}
