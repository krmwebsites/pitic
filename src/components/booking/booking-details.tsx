"use client";

import Link from "next/link";
import { useId, type FormEvent, type ReactNode, type RefObject } from "react";
import type { BookingResponse } from "@/lib/booking";
import { site } from "@/lib/site";
import { CheckCircleIcon } from "../icons";

/* ---------- Jagatud abifunktsioonid ---------- */

/** Nt "Reede, 18. september 2026" (eesti keeles on kuu väiketähega, esitäht suur). */
export function formatDate(iso: string, withYear = true) {
  const text = new Date(`${iso}T12:00:00`).toLocaleDateString("et-EE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function durationLabel(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  if (Number.isInteger(hours)) return hours === 1 ? "1 tund" : `${hours} tundi`;
  return `${hours.toLocaleString("et-EE")} tundi`;
}

export function formatPrice(amount: number, currency: string | null) {
  try {
    return new Intl.NumberFormat("et-EE", {
      style: "currency",
      currency: currency ?? "EUR",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency ?? ""}`.trim();
  }
}

export type DetailsValues = { name: string; email: string; phone: string; note: string; terms: boolean };

export const EMPTY_DETAILS: DetailsValues = { name: "", email: "", phone: "", note: "", terms: false };

export function validateDetails(values: DetailsValues): string | null {
  if (values.name.trim().length < 2) return "Palun sisesta oma nimi.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) return "Palun sisesta korrektne e-posti aadress.";
  if (!/^\+?[\d\s()-]{6,}$/.test(values.phone.trim())) return "Palun sisesta korrektne telefoninumber.";
  if (!values.terms) return "Broneerimiseks nõustu kasutustingimustega.";
  return null;
}

/* ---------- Sammu pealkiri ---------- */

export function StepIndicator({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Broneerimise sammud">
      {steps.map((label, index) => {
        const number = index + 1;
        const state = number === current ? "current" : number < current ? "done" : "todo";
        return (
          <li
            key={label}
            className={`flex items-center gap-2 last:flex-none ${
              state === "current" ? "flex-none sm:min-w-0 sm:flex-1" : "min-w-0 flex-1"
            }`}
          >
            <span aria-current={state === "current" ? "step" : undefined} className="flex shrink-0 items-center gap-2">
              <span
                className={`flex size-8 items-center justify-center rounded-full border text-sm font-medium ${
                  state === "current"
                    ? "border-sage bg-sage text-white"
                    : state === "done"
                      ? "border-sage text-sage"
                      : "border-line text-muted"
                }`}
                aria-hidden="true"
              >
                {state === "done" ? <CheckCircleIcon size={16} /> : `${number}.`}
              </span>
              {/* Kitsal ekraanil on nähtav ainult aktiivse sammu nimi, numbrid jäävad. */}
              <span className={`text-sm ${state === "current" ? "font-medium text-ink" : "hidden text-muted sm:inline"}`}>
                <span className="sr-only">Samm {number}: </span>
                {label}
              </span>
            </span>
            {index < steps.length - 1 && <span className="h-px min-w-3 flex-1 bg-line" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Andmete vorm ---------- */

type FormProps = {
  values: DetailsValues;
  onChange: (values: DetailsValues) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  error: string | null;
  summary: ReactNode;
  headingRef?: RefObject<HTMLHeadingElement | null>;
};

export function DetailsForm({ values, onChange, onSubmit, onBack, submitting, error, summary, headingRef }: FormProps) {
  const id = useId();
  const set = <K extends keyof DetailsValues>(key: K, value: DetailsValues[K]) => onChange({ ...values, [key]: value });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h4 ref={headingRef} tabIndex={-1} className="text-[0.9375rem] font-medium text-ink outline-none">
        Sinu andmed
      </h4>
      <div className="mt-2 rounded-sm bg-canvas px-3.5 py-2.5">{summary}</div>

      <div className="mt-5 grid gap-4">
        <div className="field">
          <label htmlFor={`${id}-nimi`}>Nimi</label>
          <input id={`${id}-nimi`} type="text" autoComplete="name" required value={values.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor={`${id}-epost`}>E-post</label>
            <input id={`${id}-epost`} type="email" autoComplete="email" inputMode="email" required value={values.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor={`${id}-telefon`}>Telefon</label>
            <input id={`${id}-telefon`} type="tel" autoComplete="tel" inputMode="tel" required value={values.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor={`${id}-sonum`}>
            Lisainfo <span className="font-normal text-muted">(valikuline)</span>
          </label>
          <textarea id={`${id}-sonum`} rows={3} value={values.note} onChange={(e) => set("note", e.target.value)} />
          <p className="field-hint">Soovitud paigutus, varustus või muu, mida peaksime teadma.</p>
        </div>
        <label className="flex items-start gap-3 text-[0.9375rem]">
          <input type="checkbox" checked={values.terms} onChange={(e) => set("terms", e.target.checked)} className="mt-1 size-4 accent-sage" />
          <span>
            Nõustun{" "}
            <Link href="/kasutustingimused" className="link" target="_blank">
              kasutustingimustega
            </Link>{" "}
            ja andmete töötlemisega broneeringu tegemiseks.
          </span>
        </label>
      </div>

      {error && (
        <p className="mt-4 text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onBack} className="btn btn-secondary" disabled={submitting}>
          Tagasi
        </button>
        <button type="submit" className="btn btn-sage flex-1" disabled={submitting} aria-busy={submitting}>
          {submitting ? "Saadame…" : "Kinnita broneering"}
        </button>
      </div>
      <p className="meta mt-3 text-center text-xs">Broneerimine SimplyBook.me kaudu</p>
    </form>
  );
}

/* ---------- Makse / kinnitus ---------- */

type ConfirmationProps = {
  result: BookingResponse;
  roomName: string;
  date: string;
  time: string;
  endTime: string | null;
  email: string;
  price: string | null;
  onReset: () => void;
  headingRef?: RefObject<HTMLHeadingElement | null>;
};

/**
 * Samm „Makse“. Kuni SimplyBookis ei ole makseid seadistatud, kinnitatakse
 * broneering kohe ja maksmine lepitakse kokku eraldi; kui maksed on sees,
 * jääb broneering ootele ja SimplyBook saadab maksejuhised e-postiga.
 */
export function Confirmation({ result, roomName, date, time, endTime, email, price, onReset, headingRef }: ConfirmationProps) {
  const pending = result.requireConfirm;
  return (
    <div role="status">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
          <CheckCircleIcon size={20} />
        </span>
        <div>
          <h4 ref={headingRef} tabIndex={-1} className="text-h3 outline-none">
            {pending ? "Broneering ootab makset" : "Broneering on kinnitatud"}
          </h4>
          <p className="mt-2">
            {result.mock
              ? "Testrežiim: päris broneeringut ei tehtud ja makset ei küsita."
              : pending
                ? `Maksejuhised ja kinnitus saadetakse aadressile ${email}.`
                : `Kinnitus ja meeldetuletus saadetakse aadressile ${email}.`}
          </p>
        </div>
      </div>
      <dl className="mt-5 grid gap-2 rounded-sm bg-canvas px-4 py-3 text-[0.9375rem]">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Ruum</dt>
          <dd className="font-medium text-ink">{roomName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Aeg</dt>
          <dd className="text-right font-medium text-ink">
            {formatDate(date)}, {time}
            {endTime ? `–${endTime}` : ""}
          </dd>
        </div>
        {price && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Summa</dt>
            <dd className="font-medium text-ink tabular-nums">{price}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Broneeringu nr</dt>
          <dd className="font-medium text-ink tabular-nums">{result.id}</dd>
        </div>
      </dl>
      {!price && !result.mock && (
        <p className="meta mt-3">Makse: hind ja tasumise kord lepitakse kokku kinnituskirjas.</p>
      )}
      <p className="meta mt-3">
        Broneeringu muutmine või tühistamine käib kinnituskirjas oleva lingi kaudu. Küsimuste korral{" "}
        <a href={site.email.href} className="link">
          {site.email.display}
        </a>
        .
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onReset} className="btn btn-secondary">
          Broneeri veel üks aeg
        </button>
        <Link href="/" className="btn btn-primary">
          Avalehele
        </Link>
      </div>
    </div>
  );
}
