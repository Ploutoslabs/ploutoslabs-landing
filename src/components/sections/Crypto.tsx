import React, { useEffect, useState, useCallback, useRef } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { fetchQuotes, refreshQuotes } from "../../lib/cryptoRates";
import "./Crypto.css";

const COIN_META: Record<string, { name: string; color: string; abbr: string }> =
  {
    BTC: { name: "Bitcoin", color: "#F7931A", abbr: "₿" },
    ETH: { name: "Ethereum", color: "#627EEA", abbr: "Ξ" },
    USDT: { name: "Tether", color: "#26A17B", abbr: "₮" },
    BNB: { name: "BNB", color: "#F3BA2F", abbr: "B" },
    SOL: { name: "Solana", color: "#9945FF", abbr: "◎" },
    USDC: { name: "USD Coin", color: "#2775CA", abbr: "$" },
    XRP: { name: "XRP", color: "#00AAE4", abbr: "X" },
    ADA: { name: "Cardano", color: "#0033AD", abbr: "₳" },
    DOGE: { name: "Dogecoin", color: "#C2A633", abbr: "Ð" },
    AVAX: { name: "Avalanche", color: "#E84142", abbr: "A" },
  };

const COIN_SYMBOLS = Object.keys(COIN_META);


interface CoinData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  up: boolean;
  color: string;
  abbr: string;
  /** Logo URL from CoinGecko; falls back to a coloured initial if it fails. */
  logo: string;
}

const FALLBACK_COINS: CoinData[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$64,455.00",
    change: "+0.50%",
    up: true,
    color: "#F7931A",
    abbr: "₿",
    logo: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$1,923.24",
    change: "+1.30%",
    up: true,
    color: "#627EEA",
    abbr: "Ξ",
    logo: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    symbol: "USDT",
    name: "Tether",
    price: "$0.999267",
    change: "+0.00%",
    up: true,
    color: "#26A17B",
    abbr: "₮",
    logo: "https://coin-images.coingecko.com/coins/images/325/large/Tether.png",
  },
  {
    symbol: "BNB",
    name: "BNB",
    price: "$602.1000",
    change: "+0.30%",
    up: true,
    color: "#F3BA2F",
    abbr: "B",
    logo: "https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: "$77.4900",
    change: "+1.90%",
    up: true,
    color: "#9945FF",
    abbr: "◎",
    logo: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    price: "$0.999659",
    change: "+0.00%",
    up: true,
    color: "#2775CA",
    abbr: "$",
    logo: "https://coin-images.coingecko.com/coins/images/6319/large/USDC.png",
  },
  {
    symbol: "XRP",
    name: "XRP",
    price: "$1.0060",
    change: "+1.00%",
    up: true,
    color: "#00AAE4",
    abbr: "X",
    logo: "https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
  },
  {
    symbol: "ADA",
    name: "Cardano",
    price: "$0.174627",
    change: "+0.60%",
    up: true,
    color: "#0033AD",
    abbr: "₳",
    logo: "https://coin-images.coingecko.com/coins/images/975/large/cardano.png",
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    price: "$0.070138",
    change: "+0.30%",
    up: true,
    color: "#C2A633",
    abbr: "Ð",
    logo: "https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png",
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    price: "$6.3300",
    change: "+0.30%",
    up: true,
    color: "#E84142",
    abbr: "A",
    logo: "https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
  },
];

function formatPrice(usd: number): string {
  if (usd >= 1000)
    return `$${usd.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  if (usd >= 1) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(6)}`;
}

function formatChange(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

/* Live prices from CoinGecko — see src/lib/cryptoRates.ts */
async function fetchLiveRates(force = false): Promise<CoinData[]> {
  const quotes = force ? await refreshQuotes() : await fetchQuotes();

  return COIN_SYMBOLS.map((sym) => {
    const q = quotes[sym];
    const meta = COIN_META[sym];
    const fallback = FALLBACK_COINS.find((c) => c.symbol === sym)!;

    if (!q) return fallback;

    return {
      symbol: sym,
      name: meta.name,
      price: formatPrice(q.price),
      change: formatChange(q.change24h),
      up: q.change24h >= 0,
      color: meta.color,
      abbr: meta.abbr,
      logo: q.image || fallback.logo,
    };
  });
}

type FetchStatus = "idle" | "loading" | "success" | "error";

function CoinAvatar({ coin }: { coin: CoinData }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed) {
    return (
      <div className="crypto__coin-avatar crypto__coin-avatar--img">
        <img
          src={coin.logo}
          alt={coin.name}
          width={36}
          height={36}
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="crypto__coin-avatar"
      style={{ background: `${coin.color}18`, color: coin.color }}>
      {coin.abbr}
    </div>
  );
}

// Auto-refresh interval: 10 minutes (600,000 ms)
const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export default function Crypto() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  const [coins, setCoins] = useState<CoinData[]>(FALLBACK_COINS);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [btcRate, setBtcRate] = useState<string>("$67,421.00");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadRates = useCallback(async (force = false) => {
    setStatus("loading");
    try {
      const live = await fetchLiveRates(force);
      setCoins(live);
      const btc = live.find((c) => c.symbol === "BTC");
      if (btc) setBtcRate(btc.price);
      setLastUpdated(new Date().toLocaleTimeString());
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  // Auto-load immediately when the component mounts.
  // FALLBACK_COINS are shown until the first response lands.
  useEffect(() => {
    loadRates();
  }, [loadRates]);

  // Start/restart the 10-minute auto-refresh when the section scrolls into view
  useEffect(() => {
    if (!isVisible) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => loadRates(true), REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isVisible, loadRates]);

  return (
    <section className="crypto" ref={ref}>
      <div className="container">
        <div className="crypto__inner">
          {/* ── Coin list panel ── */}
          <div
            className={`crypto__panel ${isVisible ? "crypto__panel--visible" : ""}`}>
            <div className="crypto__panel-header">
              <span className="crypto__panel-title">Supported Crypto</span>
              <button
                className={`crypto__panel-live ${status === "loading" ? "crypto__panel-live--spinning" : ""}`}
                onClick={() => loadRates(true)}
                disabled={status === "loading"}
                title="Refresh rates">
                <RefreshCw size={20} />
                <span>
                  {status === "loading"
                    ? "Updating Rate…"
                    : status === "error"
                      ? "Refresh Rate"
                      : lastUpdated
                        ? `Updated ${lastUpdated}`
                        : "Live rates"}
                </span>
              </button>
            </div>

            <div className="crypto__coin-list">
              {coins.map((coin, i) => (
                <div
                  key={coin.symbol}
                  className={`crypto__coin ${status === "loading" ? "crypto__coin--loading" : ""}`}
                  style={
                    {
                      "--delay": `${i * 50}ms`,
                      "--coin-color": coin.color,
                    } as React.CSSProperties
                  }>
                  <CoinAvatar coin={coin} />
                  <div className="crypto__coin-info">
                    <div className="crypto__coin-symbol">{coin.symbol}</div>
                    <div className="crypto__coin-name">{coin.name}</div>
                  </div>
                  <div className="crypto__coin-right">
                    <div className="crypto__coin-price">{coin.price}</div>
                    <div
                      className={`crypto__coin-change ${coin.up ? "crypto__coin-change--up" : "crypto__coin-change--down"}`}>
                      {coin.up ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {coin.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="crypto__panel-footer">
              {status === "error"
                ? "Showing last known crypto rates. Try refreshing again."
                : "40+ more crypto currencies supported"}
            </div>
          </div>

          {/* ── Content ── */}
          <div
            className={`crypto__content ${isVisible ? "crypto__content--visible" : ""}`}>
            <div className="section-badge">Crypto Funding</div>
            <h2 className="section-title" style={{ textAlign: "left" }}>
              Fund your card
              <br />
              <span className="section-title-accent">with any crypto</span>
            </h2>
            <p
              className="section-subtitle"
              style={{ textAlign: "left", maxWidth: "420px" }}>
              Send crypto to your KaviPay wallet and it converts instantly to
              USD — ready to spend on your virtual card with zero hidden fees.
            </p>

            <div className="crypto__steps">
              {[
                { step: "1", text: "Copy your unique crypto wallet address" },
                {
                  step: "2",
                  text: "Send any supported crypto to that address",
                },
                {
                  step: "3",
                  text: "Funds convert to USD and load your card instantly",
                },
              ].map((s, i) => (
                <div key={i} className="crypto__step">
                  <div className="crypto__step-num">{s.step}</div>
                  <p className="crypto__step-text">{s.text}</p>
                </div>
              ))}
            </div>

            <div className="crypto__rate-card">
              <div className="crypto__rate-label">Today's BTC → USD Rate</div>
              <div className="crypto__rate-value">1 BTC = {btcRate}</div>
              <div className="crypto__rate-badge">
                <div
                  className={`crypto__rate-dot ${status === "loading" ? "" : "crypto__rate-dot--active"}`}
                />
                {status === "loading"
                  ? "Fetching live rate…"
                  : "Best market rate guaranteed"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
