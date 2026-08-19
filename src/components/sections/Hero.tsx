import { ArrowRight, Star, Shield, Zap } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import TokenCoin from "../../assets/Token.png";
import { fetchQuotes, refreshQuotes } from "../../lib/cryptoRates";
import "./Hero.css";
import { Link } from "react-router-dom";

// ── Ticker coin types ──────────────────────────────────────────────────────
interface TickerCoin {
  sym: string;
  price: string;
  change: string;
  up: boolean;
}

const TICKER_SYMBOLS = [
  "BTC",
  "ETH",
  "USDT",
  "BNB",
  "SOL",
  "USDC",
  "XRP",
  "DOGE",
];

const FALLBACK_TICKER: TickerCoin[] = [
  { sym: "BTC", price: "$67,421", change: "+2.4%", up: true },
  { sym: "ETH", price: "$3,520", change: "+1.8%", up: true },
  { sym: "USDT", price: "$1.00", change: "0.0%", up: true },
  { sym: "BNB", price: "$582", change: "-0.6%", up: false },
  { sym: "SOL", price: "$178", change: "+4.1%", up: true },
  { sym: "USDC", price: "$1.00", change: "0.0%", up: true },
  { sym: "XRP", price: "$0.62", change: "+1.2%", up: true },
  { sym: "DOGE", price: "$0.18", change: "-1.4%", up: false },
];

function formatTickerPrice(usd: number): string {
  if (usd >= 1000)
    return `$${usd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (usd >= 1) return `$${usd.toFixed(2)}`;
  return `$${usd.toFixed(4)}`;
}

function formatTickerChange(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

async function fetchTickerRates(force = false): Promise<TickerCoin[]> {
  const quotes = force ? await refreshQuotes() : await fetchQuotes();

  return TICKER_SYMBOLS.map((sym) => {
    const q = quotes[sym];
    const fallback = FALLBACK_TICKER.find((c) => c.sym === sym)!;
    if (!q) return fallback;
    const pct = q.change24h;
    return {
      sym,
      price: formatTickerPrice(q.price),
      change: formatTickerChange(pct),
      up: pct >= 0,
    };
  });
}

// Duplicate coins so the ticker scrolls seamlessly
function buildTickerItems(coins: TickerCoin[]) {
  return [...coins, ...coins];
}

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

// ── Component ─────────────────────────────────────────────────────────────
export default function Hero() {
  const [tickerCoins, setTickerCoins] = useState<TickerCoin[]>(FALLBACK_TICKER);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadTicker = useCallback(async (force = false) => {
    try {
      const live = await fetchTickerRates(force);
      setTickerCoins(live);
    } catch {
      // silently keep last known values
    }
  }, []);

  // Fetch immediately on mount, then every 10 minutes.
  // FALLBACK_TICKER is shown until the first response lands.
  useEffect(() => {
    loadTicker();
    intervalRef.current = setInterval(() => loadTicker(true), REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadTicker]);

  const tickerItems = buildTickerItems(tickerCoins);

  return (
    <section className="hero">
      {/* Background effects */}
      <div className="hero__bg">
        <div className="hero__glow hero__glow--1" />
        <div className="hero__glow hero__glow--2" />
        <div className="hero__grid" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            <span>Crypto spending, built for Africa</span>
          </div>

          <h1 className="hero__title">
            Powering modern
            <br />
            <span className="hero__title-accent">banking and crypto</span>
            <br />
            in one place.
          </h1>

          <p className="hero__subtitle">
            PloutosLabs is the crypto fintech powerhouse bridging digital assets
            and everyday life — from the $PLTL token to KaviPay, your crypto
            virtual and physical card for global spending.
          </p>

          <div className="hero__actions">
            <Link to="/token" className="btn btn--primary btn--lg hero__cta">
              Buy $PLTL Token
              <ArrowRight size={18} />
            </Link>
            <Link to="/kavipay" className="btn btn--ghost btn--lg">
              Explore Kavipay
            </Link>
          </div>

          <div className="hero__trust">
            <div className="hero__trust-item">
              <Shield size={15} className="hero__trust-icon" />
              <span>Bank-grade security</span>
            </div>
            <div className="hero__trust-divider" />
            <div className="hero__trust-item">
              <Zap size={15} className="hero__trust-icon" />
              <span>Instant card issuance</span>
            </div>
            <div className="hero__trust-divider" />
            <div className="hero__trust-item">
              <Star size={15} className="hero__trust-icon" />
              <span>Audited by Cyberscope.io</span>
            </div>
          </div>
        </div>

        {/* Card Visual */}
        <div className="hero__visual">
          <div className="hero__card-scene">
            {/* KaviPay card image */}
            <img
              src={TokenCoin}
              alt="Ploutos coin"
              className="kavi-card-img animate-float"
            />

            {/* Floating notification — card top-up */}
            <div className="hero__notif hero__notif--1">
              <div className="hero__notif-icon">✅</div>
              <div>
                <div className="hero__notif-title">
                  $PLTL Transaction Confirmed
                </div>
                <div className="hero__notif-sub">
                  Approved •••• 4821 · just now
                </div>
              </div>
              <div className="hero__notif-badge hero__notif-badge--green">
                200 USDT
              </div>
            </div>

            {/* Floating notification — ATM withdrawal */}
            <div className="hero__notif hero__notif--2">
              <div className="hero__notif-icon hero__notif-icon--blue">✅</div>
              <div>
                <div className="hero__notif-title">
                  $PLTL Withdrawal Approved
                </div>
                <div className="hero__notif-sub">Approved · •••• 4821</div>
              </div>
              <div className="hero__notif-badge hero__notif-badge--red">
                -$200
              </div>
            </div>

            {/* Stats pill */}
            <div className="hero__stat-pill">
              <div className="hero__stat-pill-dot" />
              <span>$PLTL — launching soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Crypto ticker ── */}
      <div className="hero__ticker">
        <div className="hero__ticker-track">
          {tickerItems.map((coin, i) => (
            <div key={i} className="hero__ticker-item">
              <span className="hero__ticker-sym">{coin.sym}</span>
              <span className="hero__ticker-price">{coin.price}</span>
              <span
                className={`hero__ticker-change ${
                  coin.up
                    ? "hero__ticker-change--up"
                    : "hero__ticker-change--down"
                }`}>
                {coin.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// vartech_store_v1