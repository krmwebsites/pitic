"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "../icons";

export const MONTHS_ET = [
  "jaanuar",
  "veebruar",
  "märts",
  "aprill",
  "mai",
  "juuni",
  "juuli",
  "august",
  "september",
  "oktoober",
  "november",
  "detsember",
];
const WEEKDAYS_ET = ["E", "T", "K", "N", "R", "L", "P"];

/** Kohalik kuupäev kujul Y-m-d (ilma ajavööndi nihketa). */
export function isoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function monthLabel(date: Date) {
  return `${MONTHS_ET[date.getMonth()]} ${date.getFullYear()}`;
}

type Props = {
  /** Kuvatava kuu esimene päev. */
  month: Date;
  onMonthChange: (next: Date) => void;
  minMonth: Date;
  maxMonth: Date;
  /** Kuupäevad (Y-m-d), millel on vabu aegu. */
  available: Set<string>;
  selected: string | null;
  onSelect: (date: string) => void;
  loading?: boolean;
};

/**
 * Kuukalender: esmaspäevast algav 7-veeruline ruudustik. Vabad päevad on
 * nupud, ülejäänud on nähtavad, kuid mitte valitavad.
 */
export function Calendar({ month, onMonthChange, minMonth, maxMonth, available, selected, onSelect, loading }: Props) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // 0 = esmaspäev
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - offset);
  const todayIso = isoDate(new Date());
  const canPrev = first > minMonth;
  const canNext = first < maxMonth;

  const cells = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return date;
  });
  // Viimane rida ära, kui see on tervenisti järgmises kuus.
  const rows = cells.slice(35).every((d) => d.getMonth() !== first.getMonth()) ? cells.slice(0, 35) : cells;

  return (
    <div className="rounded-md border border-line bg-surface p-3" aria-busy={loading}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(new Date(first.getFullYear(), first.getMonth() - 1, 1))}
          disabled={!canPrev}
          className="inline-flex size-9 items-center justify-center rounded-sm text-ink transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-line-strong"
          aria-label="Eelmine kuu"
        >
          <ArrowLeftIcon />
        </button>
        <p className="text-[0.9375rem] font-medium text-ink capitalize" aria-live="polite">
          {monthLabel(first)}
        </p>
        <button
          type="button"
          onClick={() => onMonthChange(new Date(first.getFullYear(), first.getMonth() + 1, 1))}
          disabled={!canNext}
          className="inline-flex size-9 items-center justify-center rounded-sm text-ink transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-line-strong"
          aria-label="Järgmine kuu"
        >
          <ArrowRightIcon />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 text-center" role="grid" aria-label={`Kalender, ${monthLabel(first)}`}>
        {WEEKDAYS_ET.map((day) => (
          <div key={day} role="columnheader" className="meta py-1 text-xs font-medium tracking-wide">
            {day}
          </div>
        ))}
        {rows.map((date) => {
          const iso = isoDate(date);
          const inMonth = date.getMonth() === first.getMonth();
          const isAvailable = inMonth && available.has(iso) && !loading;
          const isSelected = selected === iso;
          const isToday = iso === todayIso;
          const label = date.toLocaleDateString("et-EE", { weekday: "long", day: "numeric", month: "long" });
          const base = "mx-auto flex size-9 items-center justify-center rounded-full text-[0.9375rem] tabular-nums";
          if (!isAvailable) {
            return (
              <div key={iso} role="gridcell" aria-disabled="true" aria-label={label}>
                <span className={`${base} ${inMonth ? "text-line-strong" : "text-line"} ${isToday ? "ring-1 ring-line-strong" : ""}`}>
                  {date.getDate()}
                </span>
              </div>
            );
          }
          return (
            <div key={iso} role="gridcell">
              <button
                type="button"
                onClick={() => onSelect(iso)}
                aria-pressed={isSelected}
                aria-label={`${label}, vabu aegu`}
                className={`${base} cursor-pointer font-medium transition-colors ${
                  isSelected ? "bg-sage text-white" : "text-ink hover:bg-sage-soft"
                } ${isToday && !isSelected ? "ring-1 ring-sage" : ""}`}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
