/**
 * SimplyBook.me avaliku API (JSON-RPC 2.0) klient. Ainult serveris:
 * API-võti loetakse keskkonnamuutujast ja ei jõua kunagi brauserisse.
 *
 * Dokumentatsioon: https://simplybook.me/en/api/developer-api/tab/public_api
 * Seadistus: BOOKING-SETUP.md
 */

const LOGIN_URL = "https://user-api.simplybook.me/login";
const API_URL = "https://user-api.simplybook.me/";

export type Service = {
  id: string;
  name: string;
  description?: string | null;
  /** Kestus minutites. */
  duration: number;
  is_active?: boolean | string | number;
  is_public?: boolean | string | number;
  /** Teenusepakkujate ID-d, kes seda teenust osutavad. */
  unit_map?: Record<string, unknown> | string[] | null;
  price?: string | number | null;
  currency?: string | null;
};

export type BookingResult = {
  id: string | number;
  hash?: string;
  require_confirm?: boolean;
  bookings?: unknown[];
  batch_id?: string | number;
};

export type ClientData = { name: string; email: string; phone: string };

type RpcError = { code: number; message: string; data?: unknown };
type RpcResponse<T> = { jsonrpc: "2.0"; id: number; result?: T; error?: RpcError };

export class SimplyBookError extends Error {
  code: number;
  constructor(message: string, code = 0) {
    super(message);
    this.name = "SimplyBookError";
    this.code = code;
  }
}

export function getServerConfig() {
  const company = process.env.SIMPLYBOOK_COMPANY?.trim() || null;
  const apiKey = process.env.SIMPLYBOOK_API_KEY?.trim() || null;
  const mock = process.env.SIMPLYBOOK_MOCK === "true";
  return { company, apiKey, mock, configured: mock || (company !== null && apiKey !== null) };
}

let tokenCache: { company: string; token: string; issuedAt: number } | null = null;
const TOKEN_TTL_MS = 50 * 60 * 1000;

async function rpc<T>(url: string, method: string, params: unknown[], headers: Record<string, string> = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
    cache: "no-store",
  });
  if (!response.ok) throw new SimplyBookError(`SimplyBook vastas ${response.status}`, response.status);
  const payload = (await response.json()) as RpcResponse<T>;
  if (payload.error) throw new SimplyBookError(payload.error.message, payload.error.code);
  return payload.result as T;
}

async function getToken(force = false) {
  const { company, apiKey } = getServerConfig();
  if (!company || !apiKey) throw new SimplyBookError("SimplyBook ei ole seadistatud", 503);
  const fresh = tokenCache && tokenCache.company === company && Date.now() - tokenCache.issuedAt < TOKEN_TTL_MS;
  if (fresh && !force) return tokenCache!.token;
  const token = await rpc<string>(LOGIN_URL, "getToken", [company, apiKey]);
  tokenCache = { company, token, issuedAt: Date.now() };
  return token;
}

/** Autenditud päring; aegunud tokeni korral logitakse üks kord uuesti sisse. */
async function call<T>(method: string, params: unknown[]): Promise<T> {
  const { company } = getServerConfig();
  const attempt = async (force: boolean) => {
    const token = await getToken(force);
    return rpc<T>(API_URL, method, params, { "X-Company-Login": company as string, "X-Token": token });
  };
  try {
    return await attempt(false);
  } catch (error) {
    const tokenProblem =
      error instanceof SimplyBookError && /token|access denied|unauthori/i.test(error.message);
    if (!tokenProblem) throw error;
    return attempt(true);
  }
}

/* ---------- Avalikud funktsioonid ---------- */

export async function getServices(): Promise<Service[]> {
  const result = await call<Record<string, Service> | Service[]>("getEventList", [true, false]);
  const list = Array.isArray(result) ? result : Object.values(result);
  return list.map((service) => ({ ...service, id: String(service.id), duration: Number(service.duration) }));
}

export function firstUnitId(service: Service): string | null {
  const map = service.unit_map;
  if (!map) return null;
  const keys = Array.isArray(map) ? map.map(String) : Object.keys(map);
  return keys[0] ?? null;
}

/**
 * Vabad algusajad kuupäevade kaupa vahemikus from..to (Y-m-d).
 * Tagastab { "2026-09-18": ["10:00:00", "11:00:00"], ... }.
 */
export async function getStartTimeMatrix(
  from: string,
  to: string,
  serviceId: string,
  unitId: string | null,
  count = 1,
): Promise<Record<string, string[]>> {
  const result = await call<Record<string, string[]> | string[]>("getStartTimeMatrix", [
    from,
    to,
    serviceId,
    unitId,
    count,
  ]);
  return Array.isArray(result) ? {} : result;
}

export async function calculateEndTime(startDateTime: string, serviceId: string, unitId: string | null) {
  return call<string>("calculateEndTime", [startDateTime, serviceId, unitId]);
}

export async function book(
  serviceId: string,
  unitId: string | null,
  date: string,
  time: string,
  client: ClientData,
  additional: Record<string, unknown> = {},
  count = 1,
  batchId?: string,
): Promise<BookingResult> {
  const params: unknown[] = [serviceId, unitId, date, time, client, additional, count];
  if (batchId) params.push(batchId);
  return call<BookingResult>("book", params);
}

/* ---------- Arendusrežiim ilma kontota (SIMPLYBOOK_MOCK=true) ---------- */

export function mockServices(ids: string[]): Service[] {
  return ids.map((id, index) => ({
    id,
    name: `Teenus ${id}`,
    duration: 60,
    unit_map: { [String(index + 1)]: true },
  }));
}

export function mockMatrix(from: string, to: string): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  const cursor = new Date(`${from}T12:00:00`);
  const end = new Date(`${to}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  while (cursor <= end) {
    const day = cursor.getDay();
    const iso = cursor.toISOString().slice(0, 10);
    if (day >= 1 && day <= 5 && cursor > today) {
      out[iso] = ["09:00:00", "10:00:00", "11:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00"].filter(
        (_, i) => (cursor.getDate() + i) % 3 !== 0,
      );
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}
