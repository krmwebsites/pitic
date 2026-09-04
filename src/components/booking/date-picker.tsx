"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CalendarCheckIcon } from "../icons";
import { Calendar, isoDate } from "./calendar";
import { formatDate } from "./booking-details";

type Props = {
  value: string | null;
  onChange: (iso: string) => void;
  label: string;
  /** Kuupäevad, mida saab valida. Kui puudub, lubatakse kõik tööpäevad alates homsest. */
  available?: Set<string>;
  minMonth: Date;
  maxMonth: Date;
};

function weekdaysOf(month: Date, from: Date) {
  const out = new Set<string>();
  const cursor = new Date(month.getFullYear(), month.getMonth(), 1);
  while (cursor.getMonth() === month.getMonth()) {
    const day = cursor.getDay();
    if (day >= 1 && day <= 5 && cursor > from) out.add(isoDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

/** Kuupäeva valik: nupp avab kalendri; Escape ja klikk väljapoole sulgevad. */
export function DatePicker({ value, onChange, label, available, minMonth, maxMonth }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => (value ? new Date(`${value}T12:00:00`) : minMonth));
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = available ?? weekdaysOf(month, today);

  return (
    <div ref={rootRef} className="field relative">
      <label htmlFor={id}>{label}</label>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex min-h-12 w-full items-center gap-3 rounded-sm border border-field-border bg-surface px-3.5 text-left text-[0.9375rem] text-ink transition-colors hover:border-muted"
      >
        <CalendarCheckIcon size={18} className="shrink-0 text-muted" />
        <span className="flex-1 truncate">{value ? formatDate(value).replace(/^[^,]+, /, "") : "Vali kuupäev"}</span>
        <span className="text-muted" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div role="dialog" aria-label="Kalender" className="absolute top-full left-0 z-30 mt-2 w-[20rem] max-w-[calc(100vw-2.5rem)] shadow-soft">
          <Calendar
            month={month}
            onMonthChange={setMonth}
            minMonth={minMonth}
            maxMonth={maxMonth}
            available={days}
            selected={value}
            onSelect={(iso) => {
              onChange(iso);
              setOpen(false);
              buttonRef.current?.focus();
            }}
          />
        </div>
      )}
    </div>
  );
}
