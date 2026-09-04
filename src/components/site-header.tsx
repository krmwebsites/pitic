"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { content } from "@/lib/content";
import { nav, site } from "@/lib/site";
import { CloseIcon, MenuIcon } from "./icons";

/** Avalehe sektsioonid, mille vahel menüü indikaator kerimisel liigub (dokumendi järjekorras). */
const HOME_SECTIONS = ["ruumid", "meist"] as const;
type HomeSection = "hero" | (typeof HOME_SECTIONS)[number];

function activeHref(pathname: string, section: HomeSection) {
  if (pathname === "/") return section === "hero" ? "/" : `/#${section}`;
  // Ruumi detailvaade kuulub „Ruumid“ alla.
  if (pathname.startsWith("/ruumide-rent")) return "/#ruumid";
  const match = nav.find((item) => item.href !== "/" && !item.href.startsWith("/#") && pathname.startsWith(item.href));
  return match?.href ?? null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const [section, setSection] = useState<HomeSection>("hero");
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Sulge mobiilimenüü lehe vahetumisel (olek tuletatakse renderdamise ajal).
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setOpen(false);
  }

  // Avatud menüü: fookus esimesele lingile, Escape sulgeb ja viib fookuse nupule, lehte ei kerita.
  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Avalehel jälgib vaatleja, milline sektsioon („Ruumid“, „Meist“) katab vaateakna
  // 40% joone; kui ükski, on aktiivne „Avaleht“.
  useEffect(() => {
    if (pathname !== "/") return;
    const targets = new Map<Element, HomeSection>();
    for (const id of HOME_SECTIONS) {
      const target = document.getElementById(id)?.closest("section");
      if (target) targets.set(target, id);
    }
    if (targets.size === 0) return;
    const visible = new Set<HomeSection>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = targets.get(entry.target);
          if (!id) continue;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        const last = [...HOME_SECTIONS].reverse().find((id) => visible.has(id));
        setSection(last ?? "hero");
      },
      { rootMargin: "-40% 0px -60% 0px", threshold: 0 },
    );
    for (const target of targets.keys()) observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  const current = activeHref(pathname, section);

  /** „Avaleht“ avalehel: keri üles ilma navigeerimata (Link ise sama lehe algusesse ei keri). */
  function onNavClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false);
    if (href === "/" && pathname === "/") {
      event.preventDefault();
      history.replaceState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSection("hero");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
        <Link href="/" className="flex shrink-0 items-center py-2" aria-label="Pitic, avaleht">
          {/* Päises logo põhiosa ilma väikese tagline'ita (see jääks loetamatuks). */}
          <Image
            src="/brand/pitic-logo-header.png"
            alt="Pitic"
            width={981}
            height={354}
            priority
            sizes="130px"
            className="h-8 w-auto lg:h-9"
          />
        </Link>

        <nav aria-label="Peamenüü" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => {
              const active = item.href === current;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={(event) => onNavClick(event, item.href)}
                    className={`inline-block py-2 text-[0.9375rem] font-medium underline-offset-[10px] transition-colors hover:text-ink ${
                      active ? "text-ink underline decoration-sage decoration-2" : "text-body"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/broneerimine" className="btn btn-primary btn-sm hidden lg:inline-flex">
            {content.hero.secondaryCta}
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-sm text-ink transition-colors hover:bg-surface-hover lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Sulge menüü" : "Ava menüü"}</span>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-canvas lg:hidden"
      >
        <nav aria-label="Mobiilimenüü" className="wrap flex flex-col pt-2 pb-8">
          <ul className="flex flex-col">
            {nav.map((item, index) => {
              const active = item.href === current;
              return (
                <li key={item.href} className="border-b border-line">
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={(event) => onNavClick(event, item.href)}
                    className={`flex items-center justify-between py-4 text-xl font-medium transition-colors hover:text-sage ${
                      active ? "text-sage underline decoration-sage decoration-2 underline-offset-8" : "text-ink"
                    }`}
                  >
                    {item.label}
                    {active && <span className="meta">Oled siin</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href="/broneerimine" onClick={() => setOpen(false)} className="btn btn-primary btn-block mt-6">
            {content.hero.secondaryCta}
          </Link>
          <div className="meta mt-6 flex flex-col gap-2">
            <a href={site.phone.href} className="link">
              {site.phone.display}
            </a>
            <a href={site.email.href} className="link">
              {site.email.display}
            </a>
            <span>{site.hours.label}</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
