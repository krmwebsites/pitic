"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ApiError, AvailabilityResponse, BookingConfig, BookingRequest, BookingResponse } from "@/lib/booking";
import { content } from "@/lib/content";
import type { Room, RoomSlug } from "@/lib/rooms";
import { site } from "@/lib/site";
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
import { Calendar, isoDate } from "./calendar";

type Props = {
  rooms: Room[];
  config: BookingConfig;
  /** Eelvalitud ruum (ruumi lehel). */
  initialRoom?: RoomSlug;
};

type Step = 1 | 2 | 3;

const STEPS = ["Aeg", "Andmed", "Makse"] as const;

/**
 * Ühe ruumi broneerimiskaart (ruumi lehel). Sammud: 1 Aeg (kalender + vabad
 * ajad), 2 Andmed, 3 Makse/kinnitus. Saadavus ja broneering käivad läbi
 * /api/booking/*, taustal SimplyBook.me; API-võti jääb serverisse.
 */
export function BookingFlow({ rooms, config, initialRoom }: Props) {
  const room = rooms.find((item) => item.slug === initialRoom) ?? rooms[0];
  const serviceId = config.services[room.slug];

  const today = useMemo(() => new Date(), []);
  const minMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);
  const maxMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth() + 6, 1), [today]);
  const [month, setMonth] = useState(minMonth);

  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [step, setStep] = useState<Step>(1);

  const [details, setDetails] = useState<DetailsValues>(EMPTY_DETAILS);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BookingResponse | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cacheRef = useRef(new Map<string, AvailabilityResponse>());

  // Laeb kuu saadavuse; tulemus jääb vahemällu, kuni kuu muutub.
  const load = useCallback(async () => {
    if (!serviceId || !config.enabled) return;
    const from = month <= minMonth ? isoDate(today) : isoDate(month);
    const to = isoDate(new Date(month.getFullYear(), month.getMonth() + 1, 0));
    const key = `${serviceId}|${from}|${to}`;
    const cached = cacheRef.current.get(key);
    if (cached) {
      setAvailability(cached);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch(`/api/booking/availability?service=${serviceId}&from=${from}&to=${to}`);
      const payload = (await response.json()) as AvailabilityResponse | ApiError;
      if (!response.ok || "error" in payload) throw new Error("error" in payload ? payload.error : "Viga");
      cacheRef.current.set(key, payload);
      setAvailability(payload);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Saadavust ei õnnestunud laadida.");
    } finally {
      setLoading(false);
    }
  }, [serviceId, config.enabled, month, minMonth, today]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (step > 1) headingRef.current?.focus();
  }, [step]);

  const availableDates = useMemo(() => new Set(Object.keys(availability?.dates ?? {})), [availability]);
  const slots = date ? (availability?.dates[date] ?? []) : [];
  const service = availability?.service ?? null;
  const endTime = time && service ? addMinutes(time, service.durationMinutes) : null;
  const price = service?.price != null ? formatPrice(service.price, service.currency) : null;

  async function submit() {
    if (!serviceId || !date || !time) return;
    const problem = validateDetails(details);
    if (problem) return setFormError(problem);
    setFormError(null);
    setSubmitting(true);
    const body: BookingRequest = {
      service: serviceId,
      date,
      time,
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
      if (!response.ok || "error" in payload) {
        const message = "error" in payload ? payload.error : "Broneering ebaõnnestus.";
        if ("code" in payload && payload.code === "taken") {
          cacheRef.current.clear();
          setTime(null);
          setStep(1);
          void load();
        }
        throw new Error(message);
      }
      setResult(payload);
      setStep(3);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Broneering ebaõnnestus.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    cacheRef.current.clear();
    setResult(null);
    setDate(null);
    setTime(null);
    setDetails(EMPTY_DETAILS);
    setStep(1);
    void load();
  }

  if (!config.enabled) {
    return (
      <div className="surface overflow-hidden">
        <BookingFallback />
      </div>
    );
  }
  if (!serviceId) {
    return (
      <div className="surface overflow-hidden">
        <BookingFallback
          heading={`${room.name}: veebibroneerimine on seadistamisel`}
          intro="Selle ruumi teenus ei ole veel broneerimissüsteemiga ühendatud. Broneeri seni e-posti või telefoni teel:"
        />
      </div>
    );
  }

  return (
    <div className="surface p-5 sm:p-7">
      <h3 className="text-h3">
        {content.hero.secondaryCta.split(" ")[0]} {room.name.toLowerCase()}
      </h3>
      <div className="mt-6">
        <StepIndicator steps={STEPS} current={step} />
      </div>

      {config.mock && (
        <p className="mt-4 rounded-sm bg-sage-soft px-3 py-2 text-sm text-sage" role="status">
          Testrežiim: näidisajad, päris broneeringut ei tehta.
        </p>
      )}

      {step === 1 && (
        <div className="mt-6">
          <p className="text-[0.9375rem] font-medium text-ink">Vali kuupäev</p>
          <div className="mt-3">
            <Calendar
              month={month}
              onMonthChange={(next) => {
                setMonth(next);
                setDate(null);
                setTime(null);
              }}
              minMonth={minMonth}
              maxMonth={maxMonth}
              available={availableDates}
              selected={date}
              onSelect={(next) => {
                setDate(next);
                setTime(null);
              }}
              loading={loading}
            />
          </div>
          {loading && (
            <p className="meta mt-3" role="status">
              Laadime vabu aegu…
            </p>
          )}
          {loadError && (
            <div className="mt-4 rounded-sm border border-error/40 bg-surface px-4 py-3 text-sm" role="alert">
              <p className="text-error">Vabu aegu ei õnnestunud laadida. {loadError}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <button type="button" onClick={() => void load()} className="link font-medium">
                  Proovi uuesti
                </button>
                <a href={site.email.href} className="link">
                  {site.email.display}
                </a>
                <a href={site.phone.href} className="link">
                  {site.phone.display}
                </a>
              </div>
            </div>
          )}
          {!loading && !loadError && availability && availableDates.size === 0 && (
            <p className="meta mt-3">Sellel kuul vabu aegu ei ole. Vaata järgmist kuud või võta ühendust.</p>
          )}

          {date && (
            <div className="mt-6">
              <p className="text-[0.9375rem] font-medium text-ink">Vabad ajad</p>
              {slots.length === 0 ? (
                <p className="meta mt-2">Sellel päeval vabu aegu ei ole.</p>
              ) : (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Kellaaeg">
                  {slots.map((slot) => {
                    const active = slot === time;
                    return (
                      <button
                        key={slot}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setTime(slot)}
                        className={`rounded-sm border py-2.5 text-[0.9375rem] font-medium tabular-nums transition-colors ${
                          active ? "border-sage bg-sage text-white" : "border-line-strong text-ink hover:bg-sage-soft"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {service && (
            <dl className="mt-6 grid gap-3">
              <div>
                <dt className="text-[0.9375rem] font-medium text-ink">Kestus</dt>
                <dd className="mt-1.5 flex items-center justify-between rounded-sm border border-line px-3.5 py-2.5 text-[0.9375rem]">
                  <span>{durationLabel(service.durationMinutes)}</span>
                  {time && endTime && (
                    <span className="meta tabular-nums">
                      {time}–{endTime}
                    </span>
                  )}
                </dd>
              </div>
              {price && (
                <div className="flex items-baseline justify-between border-t border-line pt-3">
                  <dt className="text-[0.9375rem] font-medium text-ink">Kokku</dt>
                  <dd className="text-xl font-medium text-ink tabular-nums">{price}</dd>
                </div>
              )}
            </dl>
          )}

          <button type="button" onClick={() => setStep(2)} disabled={!date || !time} className="btn btn-sage btn-block mt-6">
            {content.booking.continueLabel}
          </button>
          <p className="meta mt-3 text-center text-xs">Broneerimine SimplyBook.me kaudu</p>
        </div>
      )}

      {step === 2 && date && time && (
        <div className="mt-6">
          <DetailsForm
            values={details}
            onChange={setDetails}
            onSubmit={() => void submit()}
            onBack={() => setStep(1)}
            submitting={submitting}
            error={formError}
            headingRef={headingRef}
            summary={
              <p className="text-[0.9375rem] text-body">
                <span className="font-medium text-ink">{formatDate(date)}</span> · {time}
                {endTime ? `–${endTime}` : ""}
                {service ? ` · ${durationLabel(service.durationMinutes)}` : ""}
              </p>
            }
          />
        </div>
      )}

      {step === 3 && result && date && time && (
        <div className="mt-6">
          <Confirmation
            result={result}
            roomName={room.name}
            date={date}
            time={time}
            endTime={endTime}
            email={details.email.trim()}
            price={price}
            onReset={reset}
            headingRef={headingRef}
          />
        </div>
      )}
    </div>
  );
}
