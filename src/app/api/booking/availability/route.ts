import { NextResponse } from "next/server";
import type { AvailabilityResponse } from "@/lib/booking";
import { getServiceIds } from "@/lib/booking";
import {
  SimplyBookError,
  firstUnitId,
  getServerConfig,
  getServices,
  getStartTimeMatrix,
  mockMatrix,
  mockServices,
} from "@/lib/server/simplybook";

export const dynamic = "force-dynamic";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * GET /api/booking/availability?service=2&from=2026-09-01&to=2026-09-30
 * Vabad algusajad kuupäevade kaupa. Vahemik on piiratud 62 päevaga.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") ?? "";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  const allowed = new Set(Object.values(getServiceIds()).filter(Boolean));
  if (!allowed.has(service)) return NextResponse.json({ error: "Tundmatu teenus." }, { status: 400 });
  if (!DATE.test(from) || !DATE.test(to) || from > to) {
    return NextResponse.json({ error: "Vigane kuupäevavahemik." }, { status: 400 });
  }
  const span = (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000;
  if (span > 62) return NextResponse.json({ error: "Liiga pikk vahemik." }, { status: 400 });

  const config = getServerConfig();
  if (!config.configured) {
    return NextResponse.json({ error: "Broneerimine ei ole seadistatud.", code: "not_configured" }, { status: 503 });
  }

  try {
    const services = config.mock ? mockServices([...allowed] as string[]) : await getServices();
    const found = services.find((item) => item.id === service);
    if (!found) return NextResponse.json({ error: "Teenust ei leitud SimplyBookist.", code: "no_service" }, { status: 404 });

    const matrix = config.mock ? mockMatrix(from, to) : await getStartTimeMatrix(from, to, service, firstUnitId(found));
    const dates: Record<string, string[]> = {};
    for (const [day, times] of Object.entries(matrix)) {
      if (Array.isArray(times) && times.length > 0) dates[day] = times.map((t) => t.slice(0, 5));
    }

    const price = found.price !== undefined && found.price !== null && Number(found.price) > 0 ? Number(found.price) : null;
    const body: AvailabilityResponse = {
      service: {
        id: found.id,
        name: found.name,
        durationMinutes: found.duration,
        price,
        currency: price ? (found.currency ?? null) : null,
      },
      dates,
      mock: config.mock,
    };
    return NextResponse.json(body, { headers: { "Cache-Control": "private, max-age=30" } });
  } catch (error) {
    const message = error instanceof SimplyBookError ? error.message : "SimplyBook ei vastanud.";
    console.error("[booking/availability]", error);
    return NextResponse.json({ error: message, code: "upstream" }, { status: 502 });
  }
}
