import { NextResponse } from "next/server";
import type { BookingRequest, BookingResponse } from "@/lib/booking";
import { getServiceIds } from "@/lib/booking";
import {
  SimplyBookError,
  book,
  calculateEndTime,
  firstUnitId,
  getServerConfig,
  getServices,
} from "@/lib/server/simplybook";

export const dynamic = "force-dynamic";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{6,}$/;

function addMinutes(date: string, time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${date} ${hh}:${mm}:00`;
}

function bad(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

/** POST /api/booking – loob broneeringu SimplyBook.me-s. */
export async function POST(request: Request) {
  let body: Partial<BookingRequest>;
  try {
    body = (await request.json()) as Partial<BookingRequest>;
  } catch {
    return bad("Vigane päring.");
  }

  const service = String(body.service ?? "");
  const allowed = new Set(Object.values(getServiceIds()).filter(Boolean));
  if (!allowed.has(service)) return bad("Tundmatu teenus.");
  const date = String(body.date ?? "");
  const time = String(body.time ?? "");
  if (!DATE.test(date) || !TIME.test(time)) return bad("Vali kuupäev ja kellaaeg.");
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  if (name.length < 2) return bad("Palun sisesta oma nimi.");
  if (!EMAIL.test(email)) return bad("Palun sisesta korrektne e-posti aadress.");
  if (!PHONE.test(phone)) return bad("Palun sisesta korrektne telefoninumber.");
  const guests = Math.min(Math.max(Math.round(Number(body.guests ?? 0)) || 0, 0), 50);
  const units = Math.min(Math.max(Math.round(Number(body.units ?? 1)) || 1, 1), 4);
  const userNote = String(body.note ?? "").trim().slice(0, 1000);
  const note = [guests > 0 ? `Osalejaid: ${guests}` : null, userNote || null].filter(Boolean).join(" · ");

  const config = getServerConfig();
  if (!config.configured) {
    return NextResponse.json({ error: "Broneerimine ei ole seadistatud.", code: "not_configured" }, { status: 503 });
  }

  const start = `${date} ${time}:00`;

  if (config.mock) {
    const response: BookingResponse = {
      id: `test-${Date.now()}`,
      requireConfirm: false,
      start,
      end: addMinutes(date, time, 60 * units),
      mock: true,
    };
    return NextResponse.json(response);
  }

  try {
    const services = await getServices();
    const found = services.find((item) => item.id === service);
    if (!found) return NextResponse.json({ error: "Teenust ei leitud SimplyBookist." }, { status: 404 });
    const unitId = firstUnitId(found);

    // Pikem aeg = mitu järjestikust broneeringut sama teenuse kestusega (nt 2 × 60 min).
    // Esimese broneeringu batch-ID antakse järgmistele kaasa, et SimplyBook need kokku seoks.
    const ids: string[] = [];
    let requireConfirm = false;
    let batchId: string | undefined;
    for (let i = 0; i < units; i++) {
      const slotTime = addMinutes(date, time, i * found.duration).slice(11, 16);
      const result = await book(service, unitId, date, `${slotTime}:00`, { name, email, phone }, note ? { note } : {}, 1, batchId);
      ids.push(String(result.id));
      requireConfirm = requireConfirm || Boolean(result.require_confirm);
      const returnedBatch = (result as { batch_id?: string | number }).batch_id;
      if (i === 0 && returnedBatch) batchId = String(returnedBatch);
    }
    let end: string | null = addMinutes(date, time, units * found.duration);
    if (units === 1) {
      try {
        end = await calculateEndTime(start, service, unitId);
      } catch {
        /* jääb arvutatud lõpuaeg */
      }
    }
    const response: BookingResponse = {
      id: ids.join(", "),
      requireConfirm,
      start,
      end,
      mock: false,
    };
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof SimplyBookError ? error.message : "SimplyBook ei vastanud.";
    console.error("[booking]", error);
    // Tavalisim põhjus: aeg jõuti vahepeal ära broneerida.
    const taken = /not available|already|busy|occupied|time/i.test(message);
    return NextResponse.json(
      { error: taken ? "See aeg ei ole enam vaba. Vali uus aeg." : message, code: taken ? "taken" : "upstream" },
      { status: taken ? 409 : 502 },
    );
  }
}
