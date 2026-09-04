import type { RoomSlug } from "./rooms";

/**
 * Broneerimise avalik seadistus (jõuab brauserisse). Salajane API-võti on
 * failis lib/server/simplybook.ts ja loetakse ainult serveris.
 */
export type BookingConfig = {
  /** Kas serveripoolne SimplyBook.me API on seadistatud (või arendusrežiim). */
  enabled: boolean;
  /** Kas tegemist on arendusrežiimi näidisandmetega. */
  mock: boolean;
  /** Ettevõtte broneerimislehe aadress, nt https://pitictest.simplybook.it (linkide jaoks). */
  url: string | null;
  /** Iga ruumi teenuse ID SimplyBook.me-s. */
  services: Record<RoomSlug, string | null>;
};

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getServiceIds(): Record<RoomSlug, string | null> {
  return {
    jousaal: clean(process.env.NEXT_PUBLIC_SIMPLYBOOK_SERVICE_JOUSAAL),
    "noupidamiste-ruum": clean(process.env.NEXT_PUBLIC_SIMPLYBOOK_SERVICE_NOUPIDAMISTE_RUUM),
    suursaal: clean(process.env.NEXT_PUBLIC_SIMPLYBOOK_SERVICE_SUURSAAL),
  };
}

/** Kutsutakse serverikomponentides; tulemus antakse kliendile propsina. */
export function getBookingConfig(): BookingConfig {
  const url = clean(process.env.NEXT_PUBLIC_SIMPLYBOOK_URL);
  const mock = process.env.SIMPLYBOOK_MOCK === "true";
  const hasApi = Boolean(clean(process.env.SIMPLYBOOK_COMPANY) && clean(process.env.SIMPLYBOOK_API_KEY));
  return {
    enabled: mock || hasApi,
    mock,
    url: url ? url.replace(/\/+$/, "") : null,
    services: getServiceIds(),
  };
}

/* ---------- API-otspunktide ühised tüübid (server <-> klient) ---------- */

export type AvailabilityResponse = {
  service: { id: string; name: string; durationMinutes: number; price: number | null; currency: string | null };
  /** Kuupäev (Y-m-d) -> vabad algusajad (H:i). */
  dates: Record<string, string[]>;
  mock: boolean;
};

export type BookingRequest = {
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  note?: string;
  /** Mitu järjestikust teenuse kestuse ühikut (nt 2 = kaks tundi, kui teenus on 60 min). */
  units?: number;
  /** Külaliste arv; lisatakse broneeringu märkusesse. */
  guests?: number;
};

export type BookingResponse = {
  /** Esimese broneeringu ID; mitme ühiku korral kõik ID-d komaga. */
  id: string;
  requireConfirm: boolean;
  start: string;
  end: string | null;
  mock: boolean;
};

/** Kas algusaeg `start` mahub `units` järjestikuse ühikuna vabade aegade hulka. */
export function fitsUnits(slots: string[], start: string, units: number, stepMinutes: number) {
  const set = new Set(slots);
  const [h, m] = start.split(":").map(Number);
  for (let i = 0; i < units; i++) {
    const total = h * 60 + m + i * stepMinutes;
    const hh = String(Math.floor(total / 60)).padStart(2, "0");
    const mm = String(total % 60).padStart(2, "0");
    if (!set.has(`${hh}:${mm}`)) return false;
  }
  return true;
}

export type ApiError = { error: string; code?: string };
