import React from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import "./OurEcosystem.css";

const ecosystemProducts = [
  {
    emoji: "💰",
    emojiBg: "#92400e",
    title: "Buy & Sell Crypto",
    desc: "Trade digital assets with support for 40+ fiat currencies and competitive market rates, in at real-time through our Telegram bot.",
    comingSoon: false,
  },
  {
    emoji: "🔄",
    emojiBg: "#1e3a5f",
    title: "Swap Crypto",
    desc: "Exchange between 300+ cryptocurrencies across various networks — all from your Ploutos wallet on Telegram.",
    comingSoon: false,
  },
  {
    emoji: "🔒",
    emojiBg: "#713f12",
    title: "Smart Wallet",
    desc: "Store assets securely on BASE Network with our Coinbase smart wallet integration, directly in your Telegram chat.",
    comingSoon: false,
  },
  {
    emoji: "📱",
    emojiBg: "#1e3a5f",
    title: "Recharge & Pay Bills",
    desc: "Purchase data bundles, pay electricity bills, and TV subscriptions airtime, data, and school fees across all major Nigerian providers — instantly.",
    comingSoon: false,
  },
  {
    emoji: "🌍",
    emojiBg: "#1e3a5f",
    title: "Global Acceptance",
    desc: "Spend anywhere. Our Mastercard is accepted in over 210 countries and millions of merchants online and in-store.",
    comingSoon: false,
  },
  {
    emoji: "💳",
    emojiBg: "#713f12",
    title: "Virtual Dollar Card",
    desc: "Get a Mastercard virtual dollar card instantly. Use it to pay on any website, app, or service that accepts cards worldwide.",
    comingSoon: false,
  },
  {
    emoji: "⚡",
    emojiBg: "#1e3a5f",
    title: "Instant Transactions",
    desc: "Lightning-fast transfers and payments. Fund your card and start spending in under 60 seconds.",
    comingSoon: false,
  },
  {
    emoji: "🔒",
    emojiBg: "#713f12",
    title: "Bank-Grade Security",
    desc: "End-to-end encryption, two-factor authentication, instant card freeze, and real-time transaction alerts.",
    comingSoon: false,
  },
  {
    emoji: "📊",
    emojiBg: "#1e3a5f",
    title: "Spending Analytics",
    desc: "Visual breakdowns of your spending, transaction history, and budget tools — all inside the app.",
    comingSoon: false,
  },
  {
    emoji: "🛒",
    emojiBg: "#1e3a5f",
    title: "E-Commerce",
    desc: "Shop online with your $PLTL and crypto balances at our upcoming digital marketplace.",
    comingSoon: true,
  },
  {
    emoji: "🌐",
    emojiBg: "#0f4c75",
    title: "Remote Workspace",
    desc: "A decentralized platform connecting remote workers and businesses globally, powered by blockchain.",
    comingSoon: true,
  },
];

export default function Ecosystem() {
  const { ref: ecoRef, isVisible: ecoVisible } = useIntersectionObserver({
    threshold: 0.05,
  });

  return (
    <section className="ecosystem" id="Ecosystem">
      <div className="container">
        <div
          className={`ecosystem__wrap ${ecoVisible ? "ecosystem__wrap--visible" : ""}`}
          ref={ecoRef as React.RefObject<HTMLDivElement>}>
          <div className="ecosystem__header">
            <div className="ecosystem__left">
              <div className="ecosystem__eyebrow">
                <span className="ecosystem__eyebrow-line" />
                PLOUTOSLABS ECOSYSTEM
              </div>
              <h2 className="ecosystem__headline">
                Everything You <br />
                <span className="ecosystem__headline-accent">
                  Need with PloutosLabs
                </span>
              </h2>
            </div>
            <p className="ecosystem__desc">
              One ecosystem for buying, selling, swapping, spending, and earning
              all with PloutosLabs.
            </p>
          </div>

          <div className="ecosystem__grid">
            {ecosystemProducts.map((p, i) => (
              <div
                key={i}
                className="ecosystem__card"
                style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}>
                <div
                  className="ecosystem__icon"
                  style={{ background: p.emojiBg }}>
                  {p.emoji}
                </div>
                <h4 className="ecosystem__card-title">{p.title}</h4>
                <p className="ecosystem__card-desc">{p.desc}</p>
                {p.comingSoon && (
                  <span className="ecosystem__coming-soon">COMING SOON</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
