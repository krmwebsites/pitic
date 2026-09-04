"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { content } from "@/lib/content";
import { nav, site } from "@/lib/site";
import { CloseIcon, MenuIcon } from "./icons";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
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
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
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
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-line">
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between py-4 text-xl font-medium transition-colors hover:text-sage ${
                      active ? "text-sage" : "text-ink"
                    }`}
                  >
                    {item.label}
                    {active && <span className="meta">Oled siin</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href="/broneerimine" className="btn btn-primary btn-block mt-6">
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
