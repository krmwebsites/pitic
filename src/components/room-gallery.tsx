"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/photos";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "./icons";

type Props = {
  photos: Photo[];
  roomName: string;
  /** Suure pildi konteineri klassid (kuvasuhe / kõrgus). */
  className?: string;
};

/**
 * Ruumi galerii: suur pilt nooltega, loendur, pisipildid ja täisekraanivaade.
 * Klaviatuur: nooled vahetavad pilti, Escape sulgeb täisekraani.
 */
export function RoomGallery({ photos, roomName, className = "" }: Props) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = photos.length;
  const photo = photos[index] ?? photos[0];

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  // Klaviatuur: nooled (alati), Escape (täisekraan). Täisekraanis lehte ei kerita.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "Escape" && open) setOpen(false);
    };
    if (!open) return;
    const opener = openerRef.current;
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      opener?.focus();
    };
  }, [open, go]);

  const arrow = (direction: -1 | 1, extra = "") => (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        go(direction);
      }}
      aria-label={direction < 0 ? "Eelmine pilt" : "Järgmine pilt"}
      className={`flex size-10 items-center justify-center rounded-full border border-line bg-surface/90 text-ink shadow-soft backdrop-blur transition-colors hover:bg-surface ${extra}`}
    >
      {direction < 0 ? <ArrowLeftIcon /> : <ArrowRightIcon />}
    </button>
  );

  return (
    <div>
      <div className={`group relative overflow-hidden rounded-md border border-line bg-surface-hover ${className}`}>
        <button
          ref={openerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="block h-full w-full cursor-zoom-in"
          aria-label={`Ava suurelt: ${photo.alt}`}
        >
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            priority={index === 0}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="h-full w-full object-cover"
          />
        </button>
        {photo.placeholder && (
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-sm bg-surface/90 px-2 py-1 text-xs text-muted">
            Näidisfoto
          </span>
        )}
        {count > 1 && (
          <>
            <div className="absolute inset-y-0 left-3 flex items-center">{arrow(-1)}</div>
            <div className="absolute inset-y-0 right-3 flex items-center">{arrow(1)}</div>
            <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-white tabular-nums" aria-live="polite">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="mt-3 flex gap-3" aria-label={`${roomName}: fotod`}>
          {photos.map((item, i) => (
            <li key={item.src} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Pilt ${i + 1}: ${item.alt}`}
                aria-current={i === index ? "true" : undefined}
                className={`block w-full overflow-hidden rounded-sm border transition-colors ${
                  i === index ? "border-sage ring-1 ring-sage" : "border-line hover:border-line-strong"
                }`}
              >
                <Image src={item.src} alt="" width={item.width} height={item.height} sizes="200px" className="h-16 w-full object-cover sm:h-20 lg:h-[5.5rem]" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${roomName}: fotod suurelt`}
          className="fixed inset-0 z-50 flex flex-col bg-ink/95 p-4 sm:p-8"
          onClick={() => setOpen(false)}
        >
          <div className="flex items-center justify-between text-canvas/80">
            <span className="text-sm tabular-nums">
              {roomName} · {index + 1} / {count}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Sulge"
              className="flex size-11 items-center justify-center rounded-full text-canvas transition-colors hover:bg-white/10"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="relative min-h-0 flex-1 py-3 sm:px-14" onClick={(event) => event.stopPropagation()}>
            <Image
              key={`large-${photo.src}`}
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="100vw"
              className="h-full w-full rounded-md object-contain"
            />
            {count > 1 && (
              <>
                <div className="absolute inset-y-0 left-0 flex items-center">{arrow(-1)}</div>
                <div className="absolute inset-y-0 right-0 flex items-center">{arrow(1)}</div>
              </>
            )}
          </div>
          <p className="mt-3 text-center text-sm text-canvas/80">{photo.alt}</p>
        </div>
      )}
    </div>
  );
}
