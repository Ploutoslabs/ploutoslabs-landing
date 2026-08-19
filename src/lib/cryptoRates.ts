/**
 * Single source for live crypto rates.
 *
 * Rates come from our own Express backend (server/crypto-rates.js), which holds
 * the CoinMarketCap key server-side. The browser never sees the key.
 *
 * Live rates are OFF by default. Without a running backend every fetch would
 * fail and spam the dev terminal with proxy errors, so nothing is requested
 * unless it is explicitly switched on. When off, the UI shows its built-in
 * fallback prices.
 *
 * To turn live rates on:
 *   1. put CMC_API_KEY=<your key> in .env       (see .env.example)
 *   2. run the backend:  npm run server
 *   3. set VITE_ENABLE_LIVE_RATES=true in .env  (restart the dev server)
 *
 * In production, either serve /api from the same origin as the site, or point
 * VITE_API_BASE_URL at wherever the rates backend is hosted.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

/** Whether the app should attempt any rates request at all. */
export const LIVE_RATES_ENABLED =
  import.meta.env.VITE_ENABLE_LIVE_RATES === "true";

export const RATES_ENDPOINT = `${API_BASE}/api/crypto-rates`;

/** Raw CoinMarketCap quote shape we care about. */
export interface CmcQuote {
  price: number;
  percent_change_24h?: number;
}

interface CmcResponse {
  data?: Record<string, { quote?: { USD?: CmcQuote } }>;
}

/**
 * Fetches USD quotes keyed by symbol. Throws if live rates are switched off,
 * or if the API is unreachable, so callers fall back to last known values.
 */
export async function fetchQuotes(): Promise<Record<string, CmcQuote>> {
  if (!LIVE_RATES_ENABLED) {
    throw new Error("Live rates are disabled (VITE_ENABLE_LIVE_RATES != true)");
  }

  const response = await fetch(RATES_ENDPOINT, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error(`Rates API error (${response.status})`);

  const json = (await response.json()) as CmcResponse;
  const quotes: Record<string, CmcQuote> = {};

  for (const [symbol, entry] of Object.entries(json.data ?? {})) {
    const usd = entry?.quote?.USD;
    if (usd && typeof usd.price === "number") quotes[symbol] = usd;
  }

  return quotes;
}
