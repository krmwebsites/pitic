"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ApiError, AvailabilityResponse, BookingConfig, BookingRequest, BookingResponse } from "@/lib/booking";
import { fitsUnits } from "@/lib/booking";
import { roomHref, type Room, type RoomSlug } from "@/lib/rooms";
import { site } from "@/lib/site";
import { CalendarCheckIcon, ClockIcon, TagIcon, UsersIcon } from "../icons";
import { Photo } from "../photo";
import { BookingFallback } from "./booking-fallback";
import {
  Confirmation,
  DetailsForm,
  EMPTY_DETAILS,
  StepIndicator,
  addMinutes,
  durationLabel,
  formatDate,
  formatPrice,
  validateDetails,
  type DetailsValues,
} from "./booking-details";
import { DatePicker } from "./date-picker";

const STEPS = ["Aeg ja kestus", "Vali ruum", "Andmed", "Makse"] as const;
const START_TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
const UNIT_OPTIONS = [1, 2, 3, 4];

type Query = { date: string; time: string; units: number };

type RoomResult = {
  room: Room;
  serviceId: string;
  availability: AvailabilityResponse | null;
  error: string | null;
  /** Kas valitud algusaeg ja kestus on selles ruumis vabad. */
  fits: boolean;
  /** Muud vabad algusajad samal päeval, mis kestusega sobivad. */
  alternatives: string[];
};

/**
 * Broneerimine otsingu kaudu: 1) kuupäev, algusaeg ja kestus,
 * 2) ruumide nimekiri saadavusega, 3) andmed, 4) makse/kinnitus.
 * Saadavus ja broneering käivad läbi /api/booking/*, taustal SimplyBook.me.
 */
export function BookingSearch({ rooms, config }: { rooms: Room[]; config: BookingConfig }) {
  const today = useMemo(() => new Date(), []);
  const minMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);
  const maxMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth() + 6, 1), [today]);

  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState("10:00");
  const [units, setUnits] = useState(2);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<RoomResult[] | null>(null);
  const [searched, setSearched] = useState<Query | null>(null);
  const [selected, setSelected] = useState<RoomSlug | null>(null);

  const [details, setDetails] = useState<DetailsValues>(EMPTY_DETAILS);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BookingResponse | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step === 2) resultsRef.current?.focus();
    if (step >= 3) headingRef.current?.focus();
  }, [step]);

  const stepMinutes = results?.find((r) => r.availability)?.availability?.service.durationMinutes ?? 60;
  const endTime = searched ? addMinutes(searched.time, searched.units * stepMinutes) : null;

  const chosen = results?.find((r) => r.room.slug === selected) ?? null;
  const chosenPrice =
    chosen?.availability?.service.price != null && searched
      ? formatPrice(chosen.availability.service.price * searched.units, chosen.availability.service.currency)
      : null;

  async function search(query?: Query) {
    const q: Query | null = query ?? (date ? { date, time, units } : null);
    if (!q) return;
    setSearching(true);
    setSelected(null);
    setResult(null);
    const entries = await Promise.all(
      rooms.map(async (room): Promise<RoomResult> => {
        const serviceId = config.services[room.slug];
        const base = { room, serviceId: serviceId ?? "", availability: null, error: null, fits: false, alternatives: [] };
        if (!serviceId) return { ...base, error: "Ruum ei ole veel broneerimissüsteemiga ühendatud." };
        try {
          const response = await fetch(`/api/booking/availability?service=${serviceId}&from=${q.date}&to=${q.date}`);
          const payload = (await response.json()) as AvailabilityResponse | ApiError;
          if (!response.ok || "error" in payload) throw new Error("error" in payload ? payload.error : "Viga");
          const slots = payload.dates[q.date] ?? [];
          const minutes = payload.service.durationMinutes;
          const fits = fitsUnits(slots, q.time, q.units, minutes);
          const alternatives = slots.filter((slot) => slot !== q.time && fitsUnits(slots, slot, q.units, minutes));
          return { ...base, availability: payload, fits, alternatives };
        } catch (error) {
          return { ...base, error: error instanceof Error ? error.message : "Saadavust ei õnnestunud laadida." };
        }
      }),
    );
    setResults(entries);
    setSearched(q);
    setSearching(false);
    setStep(2);
  }

  async function submit() {
    if (!chosen || !searched) return;
    const problem = validateDetails(details);
    if (problem) return setFormError(problem);
    setFormError(null);
    setSubmitting(true);
    const body: BookingRequest = {
      service: chosen.serviceId,
      date: searched.date,
      time: searched.time,
      units: searched.units,
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      note: details.note.trim() || undefined,
    };
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as BookingResponse | ApiError;
      if (!response.ok || "error" in payload) throw new Error("error" in payload ? payload.error : "Broneering ebaõnnestus.");
      setResult(payload);
      setStep(4);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Broneering ebaõnnestus.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setResults(null);
    setSearched(null);
    setSelected(null);
    setResult(null);
    setDetails(EMPTY_DETAILS);
    setStep(1);
  }

  if (!config.enabled) {
    return (
      <div className="surface mx-auto max-w-3xl overflow-hidden">
        <BookingFallback />
      </div>
    );
  }

  const availableCount = results?.filter((r) => r.fits).length ?? 0;

  return (
    <div>
      <div className="mx-auto max-w-3xl">
        <StepIndicator steps={STEPS} current={step} />
      </div>

      {config.mock && (
        <p className="mx-auto mt-5 max-w-3xl rounded-sm bg-sage-soft px-3 py-2 text-center text-sm text-sage" role="status">
          Testrežiim: näidisajad, päris broneeringut ei tehta.
        </p>
      )}

      {/* Samm 1: otsinguriba (jääb nähtavaks ka tulemuste kohal) */}
      {step <= 2 && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void search();
          }}
          className="surface mt-8 grid gap-4 p-5 sm:p-6 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end lg:gap-6"
          aria-label="Aeg ja kestus"
        >
          <DatePicker value={date} onChange={setDate} label="Kuupäev" minMonth={minMonth} maxMonth={maxMonth} />
          <div className="field">
            <label htmlFor="algusaeg">Algusaeg</label>
            <div className="relative">
              <ClockIcon size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
              <select id="algusaeg" value={time} onChange={(e) => setTime(e.target.value)} className="pl-11">
                {START_TIMES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="kestus">Kestus</label>
            <div className="relative">
              <ClockIcon size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
              <select id="kestus" value={units} onChange={(e) => setUnits(Number(e.target.value))} className="pl-11">
                {UNIT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {durationLabel(option * 60)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-sage" disabled={!date || searching} aria-busy={searching}>
            {searching ? "Otsime…" : "Otsi vabu ruume"}
          </button>
        </form>
      )}

      {/* Samm 2: tulemused + Sinu valik */}
      {step === 2 && results && searched && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start lg:gap-6">
          <div>
            <h2 ref={resultsRef} tabIndex={-1} className="text-h3 outline-none">
              {availableCount === 0 ? "Sel ajal vabu ruume ei ole" : availableCount === 1 ? "Saadaval 1 ruum" : `Saadaval ${availableCount} ruumi`}
            </h2>
            <p className="meta mt-1">
              {formatDate(searched.date, false).replace(/^[^,]+, /, "")} · {searched.time}–{endTime}
            </p>

            <ul className="mt-5 grid gap-4">
              {results.map((entry, index) => {
                const service = entry.availability?.service ?? null;
                const price = service?.price ?? null;
                const currency = service?.currency ?? null;
                const ok = entry.fits && !entry.error;
                const isSelected = selected === entry.room.slug;
                const status = entry.error
                  ? { label: "Pole saadaval", tone: "bg-surface-hover text-muted" }
                  : entry.fits
                    ? { label: "Saadaval", tone: "bg-sage-soft text-sage" }
                    : { label: "Sel ajal hõivatud", tone: "bg-surface-hover text-muted" };
                return (
                  <li key={entry.room.slug}>
                    <article
                      className={`surface grid overflow-hidden transition-colors sm:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] ${
                        isSelected ? "border-sage ring-1 ring-sage" : ""
                      } ${ok ? "" : "opacity-80"}`}
                      aria-current={isSelected ? "true" : undefined}
                    >
                      <Photo
                        photo={entry.room.photo}
                        priority={index === 0}
                        sizes="(min-width: 640px) 352px, 100vw"
                        className="aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-56"
                      />
                      <div className={`grid ${price !== null ? "sm:grid-cols-[minmax(0,1fr)_auto]" : ""}`}>
                        <div className="flex flex-col gap-3 p-5 sm:p-6">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-h3">{entry.room.name}</h3>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.tone}`}>{status.label}</span>
                          </div>
                          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-body">
                            <li className="inline-flex items-center gap-2">
                              <UsersIcon size={16} className="text-muted" />
                              {entry.room.capacityLabel}
                            </li>
                            {price !== null && (
                              <li className="inline-flex items-center gap-2 border-l border-line pl-4">
                                <TagIcon size={16} className="text-muted" />
                                {formatPrice(price, currency)} / {durationLabel(service?.durationMinutes ?? 60)}
                              </li>
                            )}
                          </ul>
                          <p className="text-sm text-body">{entry.room.description}</p>
                          {entry.error && <p className="text-sm text-error">{entry.error}</p>}
                          {!entry.error && !entry.fits && entry.alternatives.length > 0 && (
                            <p className="text-sm text-body">
                              Vabad algusajad samal päeval:{" "}
                              {entry.alternatives.map((slot) => (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => {
                                    setTime(slot);
                                    void search({ ...searched, time: slot });
                                  }}
                                  className="link mr-2 tabular-nums"
                                >
                                  {slot}
                                </button>
                              ))}
                            </p>
                          )}
                          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
                            <Link href={roomHref(entry.room.slug)} className="text-sm font-medium text-sage underline underline-offset-4">
                              Vaata ruumi
                            </Link>
                            <button
                              type="button"
                              onClick={() => setSelected(entry.room.slug)}
                              disabled={!ok}
                              className={`btn btn-sm ${isSelected ? "btn-sage" : "btn-secondary"}`}
                              aria-pressed={isSelected}
                            >
                              {isSelected ? "Valitud" : "Vali ruum"}
                            </button>
                          </div>
                        </div>
                        {price !== null && (
                          <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4 sm:flex-col sm:items-end sm:justify-start sm:border-t-0 sm:border-l sm:px-6 sm:py-6">
                            <span className="meta">Kokku</span>
                            <span className="text-2xl font-medium text-ink tabular-nums">
                              {formatPrice(price * searched.units, currency)}
                            </span>
                          </div>
                        )}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="surface p-5 sm:p-6 lg:sticky lg:top-28" aria-label="Sinu valik">
            <h3 className="text-[1.0625rem] font-medium text-ink">Sinu valik</h3>
            <ul className="mt-4 flex flex-col gap-3 text-[0.9375rem] text-body">
              <li className="flex items-center gap-3">
                <CalendarCheckIcon size={18} className="text-sage" />
                {formatDate(searched.date).replace(/^[^,]+, /, "")}
              </li>
              <li className="flex items-center gap-3">
                <ClockIcon size={18} className="text-sage" />
                {searched.time}–{endTime}
              </li>
              <li className="flex items-center gap-3">
                <ClockIcon size={18} className="text-sage" />
                {durationLabel(searched.units * 60)}
              </li>
            </ul>
            <div className="mt-5 border-t border-line pt-4">
              {chosen ? (
                <>
                  <p className="font-medium text-ink">{chosen.room.name}</p>
                  <p className="meta">{chosen.room.capacityLabel}</p>
                  {chosenPrice && (
                    <p className="mt-2 flex items-baseline justify-between">
                      <span className="meta">Kokku</span>
                      <span className="text-xl font-medium text-ink tabular-nums">{chosenPrice}</span>
                    </p>
                  )}
                  <button type="button" onClick={() => setStep(3)} className="btn btn-sage btn-block mt-4">
                    Jätka
                  </button>
                </>
              ) : (
                <p className="meta">Vali jätkamiseks ruum.</p>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Mobiilis: valitud ruumi järel kleepuv riba, et „Jätka“ oleks käeulatuses. */}
      {step === 2 && chosen && searched && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 p-3 backdrop-blur-md lg:hidden">
          <div className="wrap flex items-center justify-between gap-4">
            <p className="min-w-0 text-sm">
              <span className="block truncate font-medium text-ink">{chosen.room.name}</span>
              <span className="meta block truncate">
                {formatDate(searched.date, false)} · {searched.time}–{endTime}
              </span>
            </p>
            <button type="button" onClick={() => setStep(3)} className="btn btn-sage btn-sm shrink-0">
              Jätka
            </button>
          </div>
        </div>
      )}

      {/* Samm 3: andmed */}
      {step === 3 && chosen && searched && (
        <div className="surface mx-auto mt-8 max-w-3xl p-5 sm:p-7">
          <DetailsForm
            values={details}
            onChange={setDetails}
            onSubmit={() => void submit()}
            onBack={() => setStep(2)}
            submitting={submitting}
            error={formError}
            headingRef={headingRef}
            summary={
              <p className="text-[0.9375rem] text-body">
                <span className="font-medium text-ink">{chosen.room.name}</span> · {formatDate(searched.date)} · {searched.time}–{endTime} ·{" "}
                {durationLabel(searched.units * 60)}
                {chosenPrice ? ` · ${chosenPrice}` : ""}
              </p>
            }
          />
        </div>
      )}

      {/* Samm 4: makse / kinnitus */}
      {step === 4 && chosen && searched && result && (
        <div className="surface mx-auto mt-8 max-w-3xl p-5 sm:p-7">
          <Confirmation
            result={result}
            roomName={chosen.room.name}
            date={searched.date}
            time={searched.time}
            endTime={endTime}
            email={details.email.trim()}
            price={chosenPrice}
            onReset={reset}
            headingRef={headingRef}
          />
        </div>
      )}

      {step <= 2 && (
        <p className="meta mx-auto mt-6 max-w-3xl text-center">
          Ruumid on broneeritavad {site.hours.days.toLowerCase()} kell {site.hours.open.replace(/^0/, "")}–{site.hours.close}. Broneerimine SimplyBook.me kaudu.
        </p>
      )}
    </div>
  );
}
