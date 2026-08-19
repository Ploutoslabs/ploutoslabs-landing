/**
 * Live crypto rates, straight from CoinGecko's public API.
 *
 * CoinGecko's free tier needs no API key and sends
 * `access-control-allow-origin: *`, so the browser calls it directly — no
 * backend, no proxy, no secret to leak. It works the same in dev and in
 * production with zero configuration.
 *
 * Docs: https://docs.coingecko.com/
 *
 * The free tier is rate limited (a handful of calls per minute), so callers
 * refresh on a long interval rather than aggressively.
 */

/** Site symbol → CoinGecko coin id. Only these are requested. */
export const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  BNB: "binancecoin",
  SOL: "solana",
  USDC: "usd-coin",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  AVAX: "avalanche-2",
};

const MARKETS_URL =
  "https://api.coingecko.com/api/v3/coins/markets" +
  `?vs_currency=usd&ids=${Object.values(COINGECKO_IDS).join(",")}` +
  "&order=market_cap_desc&sparkline=false&price_change_percentage=24h";

/** Normalised quote for one coin, keyed by its uppercase symbol. */
export interface Quote {
  price: number;
  change24h: number;
  /** CoinGecko-hosted logo. */
  image: string;
  name: string;
}

interface CoinGeckoMarket {
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
}

const REQUEST_TIMEOUT_MS = 12_000;

/**
 * How long a successful response is reused before hitting the network again.
 * The hero ticker and the crypto panel both want the same data on load, and
 * React StrictMode double-invokes effects in dev — without this they'd fire
 * four identical requests and trip CoinGecko's free-tier rate limit.
 */
const CACHE_TTL_MS = 60_000;

let cache: { at: number; quotes: Record<string, Quote> } | null = null;
let inFlight: Promise<Record<string, Quote>> | null = null;

/**
 * Fetches USD quotes keyed by uppercase symbol (BTC, ETH, …).
 *
 * Concurrent callers share a single request, and a successful result is reused
 * for CACHE_TTL_MS. Throws if CoinGecko is unreachable or returns an error, so
 * callers can fall back to their last known values.
 */
export function fetchQuotes(): Promise<Record<string, Quote>> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return Promise.resolve(cache.quotes);
  }
  if (inFlight) return inFlight;

  inFlight = requestQuotes()
    .then((quotes) => {
      cache = { at: Date.now(), quotes };
      return quotes;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/** Bypasses the cache — used by the manual refresh button. */
export function refreshQuotes(): Promise<Record<string, Quote>> {
  cache = null;
  return fetchQuotes();
}

async function requestQuotes(): Promise<Record<string, Quote>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(MARKETS_URL, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`CoinGecko error (${response.status})`);
    }

    const markets = (await response.json()) as CoinGeckoMarket[];
    if (!Array.isArray(markets)) throw new Error("Unexpected CoinGecko payload");

    const quotes: Record<string, Quote> = {};
    for (const m of markets) {
      if (typeof m?.current_price !== "number") continue;
      quotes[m.symbol.toUpperCase()] = {
        price: m.current_price,
        change24h: m.price_change_percentage_24h ?? 0,
        image: m.image,
        name: m.name,
      };
    }

    if (Object.keys(quotes).length === 0) throw new Error("No quotes returned");
    return quotes;
  } finally {
    clearTimeout(timer);
  }
}
