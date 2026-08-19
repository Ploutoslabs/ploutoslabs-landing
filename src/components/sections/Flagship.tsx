import React, { useState } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import DeviceModal from "../ui/DeviceModal";
import "./Flagship.css";

const physicalFeatures = [
  "ATM cash withdrawals",
  "In-store chip & PIN",
  "Global Visa network",
  "Instant crypto funding",
];

const virtualFeatures = [
  "Instant activation",
  "Online & app payments",
  "Secure transactions",
  "Fund with $PLTL",
];

const billTags = [
  { emoji: "⚡", label: "Electricity" },
  { emoji: "📶", label: "Data" },
  { emoji: "📺", label: "TV" },
  { emoji: "📞", label: "Airtime" },
];

const leftFeatures = [
  {
    emoji: "🌍",
    title: "Global Acceptance",
    desc: "Use anywhere Visa is accepted — online stores, restaurants, ATMs worldwide.",
  },
  {
    emoji: "⚡",
    title: "Instant Virtual Card Activation",
    desc: "Your virtual card is ready in minutes. Physical card shipped directly to you.",
  },
  {
    emoji: "🔄",
    title: "Real-Time Crypto Conversion",
    desc: "$PLTL and other tokens are converted to fiat automatically at the point of purchase.",
  },
  {
    emoji: "₦",
    title: "Fund with Naira or Crypto",
    desc: "Maximum flexibility — top up your card using Nigerian Naira or supported cryptocurrencies.",
  },
];

const howItWorksSteps = [
  {
    number: "01",
    title: "Sign Up",
    desc: "Create your KaviPay account in minutes with basic KYC verification — no bank visit required.",
    color: "gold",
  },
  {
    number: "02",
    title: "Choose Your Card",
    desc: "Select a virtual card for instant use, or order a physical card to be delivered to your address.",
    color: "cyan",
  },
  {
    number: "03",
    title: "Fund It",
    desc: "Top up your KaviPay card using crypto (including $PLTL) or Nigerian Naira instantly.",
    color: "gold",
  },
  {
    number: "04",
    title: "Spend Freely",
    desc: "Use your card online, in stores, at ATMs, or for bill payments — anywhere Visa is accepted.",
    color: "cyan",
  },
];

const africaCountries = [
  { flag: "🇳🇬", name: "Nigeria", highlighted: true },
  { flag: "🇬🇭", name: "Ghana", highlighted: true },
  { flag: "🇰🇪", name: "Kenya", highlighted: false },
  { flag: "🇿🇦", name: "South Africa", highlighted: false },
  { flag: "🇪🇹", name: "Ethiopia", highlighted: false },
  { flag: "🇹🇿", name: "Tanzania", highlighted: false },
];

const europeAmericasCountries = [
  { flag: "🇬🇧", name: "United Kingdom" },
  { flag: "🇺🇸", name: "United States" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇫🇷", name: "France" },
];

const asiaCountries = [
  { flag: "🇦🇪", name: "UAE" },
  { flag: "🇸🇬", name: "Singapore" },
  { flag: "🇮🇳", name: "India" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "", name: "+ Many more", isMore: true },
];

export default function Flagship() {
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);

  const { ref: heroRef, isVisible: heroVisible } = useIntersectionObserver({
    threshold: 0.05,
  });
  const { ref: cardsRef, isVisible: cardsVisible } = useIntersectionObserver({
    threshold: 0.05,
  });
  const { ref: featRef, isVisible: featVisible } = useIntersectionObserver({
    threshold: 0.05,
  });
  const { ref: howRef, isVisible: howVisible } = useIntersectionObserver({
    threshold: 0.05,
  });
  const { ref: whereRef, isVisible: whereVisible } = useIntersectionObserver({
    threshold: 0.05,
  });

  return (
    <section className="flagship" id="kavipay">
      {/* Background glows */}
      <div className="flagship__bg">
        <div className="flagship__glow flagship__glow--1" />
        <div className="flagship__glow flagship__glow--2" />
        <div className="flagship__glow flagship__glow--3" />
      </div>

      <div className="container">
        {/* ── Top two-column layout ── */}
        <div
          className={`flagship__grid ${heroVisible ? "flagship__grid--visible" : ""}`}
          ref={heroRef as React.RefObject<HTMLDivElement>}>
          {/* LEFT — headline + feature list + CTAs */}
          <div className="flagship__left">
            {/* Eyebrow badge */}
            <div className="flagship__eyebrow">
              OUR FLAGSHIP PRODUCT BY PLOUTOSLABS
            </div>

            {/* Logo row */}
            <div className="flagship__logo-row">
              <div className="flagship__logo-icon">K</div>
              <span className="flagship__logo-text">
                Kavi<span className="flagship__logo-accent">Pay</span>
              </span>
            </div>

            {/* Hero headline */}
            <h2 className="flagship__headline">
              Spend
              <br />
              Anywhere.
              <br />
              Fund with
              <br />
              <span className="flagship__headline-accent">Crypto</span>
              <br />
              or Naira.
            </h2>

            {/* Description */}
            <p className="flagship__desc">
              KaviPay is your crypto-powered Visa card — virtual and physical —
              built for Africans and global users who want to spend digital
              assets in the real world. Top up with crypto or Naira, pay bills,
              shop online, and withdraw globally.
            </p>

            {/* Feature tiles */}
            <div
              className={`flagship__features ${featVisible ? "flagship__features--visible" : ""}`}
              ref={featRef as React.RefObject<HTMLDivElement>}>
              {leftFeatures.map((f, i) => (
                <div
                  key={i}
                  className="flagship__feat-tile"
                  style={{ "--delay": `${i * 100}ms` } as React.CSSProperties}>
                  <div className="flagship__feat-icon">{f.emoji}</div>
                  <div className="flagship__feat-body">
                    <div className="flagship__feat-title">{f.title}</div>
                    <p className="flagship__feat-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flagship__ctas">
              <button
                type="button"
                onClick={() => setDeviceModalOpen(true)}
                className="flagship__btn flagship__btn--primary">
                Get Your KaviPay Card
              </button>
              <a
                href="https://www.kavipay.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="flagship__btn flagship__btn--ghost">
                Visit kavipay.io
              </a>
            </div>
          </div>

          {/* RIGHT — card panels + bills panel */}
          <div
            className={`flagship__right ${cardsVisible ? "flagship__right--visible" : ""}`}
            ref={cardsRef as React.RefObject<HTMLDivElement>}>
            {/* Physical + Virtual cards row */}
            <div className="flagship__cards-row">
              {/* Physical Card */}
              <div className="flagship__card-panel flagship__card-panel--physical">
                <div className="flagship__card-icon-wrap flagship__card-icon-wrap--gold">
                  <span className="flagship__card-icon">💳</span>
                </div>
                <h4 className="flagship__card-title flagship__card-title--gold">
                  Physical Card
                </h4>
                <p className="flagship__card-sub">
                  A real card delivered to your door. Use it in stores, at ATMs,
                  globally.
                </p>
                <ul className="flagship__card-list">
                  {physicalFeatures.map((f, i) => (
                    <li key={i} className="flagship__card-item">
                      <span className="flagship__check flagship__check--gold">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Virtual Card */}
              <div className="flagship__card-panel flagship__card-panel--virtual">
                <div className="flagship__card-icon-wrap flagship__card-icon-wrap--blue">
                  <span className="flagship__card-icon">📱</span>
                </div>
                <h4 className="flagship__card-title flagship__card-title--blue">
                  Virtual Card
                </h4>
                <p className="flagship__card-sub">
                  Instant digital card for online shopping, subscriptions, and
                  payments.
                </p>
                <ul className="flagship__card-list">
                  {virtualFeatures.map((f, i) => (
                    <li key={i} className="flagship__card-item">
                      <span className="flagship__check flagship__check--blue">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pay Bills panel */}
            <div className="flagship__bills-panel">
              <h4 className="flagship__bills-title">Pay Bills Effortlessly</h4>
              <p className="flagship__bills-sub">
                Electricity, cable subscriptions, data, and airtime — all
                payable with crypto or Naira.
              </p>
              <div className="flagship__bill-tags">
                {billTags.map((b, i) => (
                  <span key={i} className="flagship__bill-tag">
                    {b.emoji} {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────
        HOW IT WORKS
        ──────────────────────────────────────── */}
        <div
          className={`flagship__how ${howVisible ? "flagship__how--visible" : ""}`}
          ref={howRef as React.RefObject<HTMLDivElement>}>
          <div className="flagship__section-eyebrow flagship__section-eyebrow--cyan">
            <span className="flagship__section-line" />
            HOW IT WORKS
          </div>
          <h2 className="flagship__how-headline">
            Get Your Card in <br />
            <span className="flagship__how-headline-accent">
              4 Simple Steps
            </span>
          </h2>

          {/* Steps timeline */}
          <div className="flagship__steps">
            <div className="flagship__steps-line" />
            {howItWorksSteps.map((step, i) => (
              <div
                key={i}
                className="flagship__step"
                style={{ "--delay": `${i * 120}ms` } as React.CSSProperties}>
                <div
                  className={`flagship__step-circle flagship__step-circle--${step.color}`}>
                  {step.number}
                </div>
                <h4 className="flagship__step-title">{step.title}</h4>
                <p className="flagship__step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ────────────────────────────────────────
        WHERE YOU CAN USE KAVIPAY
        ──────────────────────────────────────── */}
        <div
          className={`flagship__where ${whereVisible ? "flagship__where--visible" : ""}`}
          ref={whereRef as React.RefObject<HTMLDivElement>}>
          <div className="flagship__where-inner">
            <div className="flagship__where-header">
              <h3 className="flagship__where-title">
                Where You Can Use{" "}
                <span className="flagship__where-title-accent">KaviPay</span>
              </h3>
              <div className="flagship__where-badge">🌍 Globally Accepted</div>
            </div>

            <div className="flagship__where-regions">
              {/* Africa */}
              <div className="flagship__where-region">
                <div className="flagship__where-region-label">
                  AFRICA (PRIORITY MARKETS)
                </div>
                <div className="flagship__where-country-grid">
                  {africaCountries.map((c, i) => (
                    <span
                      key={i}
                      className={`flagship__country-tag ${c.highlighted ? "flagship__country-tag--highlighted" : ""}`}>
                      {c.flag} {c.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Europe & Americas */}
              <div className="flagship__where-region">
                <div className="flagship__where-region-label">
                  EUROPE & AMERICAS
                </div>
                <div className="flagship__where-country-grid">
                  {europeAmericasCountries.map((c, i) => (
                    <span key={i} className="flagship__country-tag">
                      {c.flag} {c.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Asia & Rest */}
              <div className="flagship__where-region">
                <div className="flagship__where-region-label">
                  ASIA & REST OF WORLD
                </div>
                <div className="flagship__where-country-grid">
                  {asiaCountries.map((c, i) => (
                    <span key={i} className="flagship__country-tag">
                      {c.flag} {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flagship__where-note">
              <span className="flagship__where-note-label">
                Visa network coverage:
              </span>{" "}
              KaviPay is accepted wherever Visa is accepted — over 200 countries
              and territories worldwide. Card availability and features may vary
              by region.
            </div>
          </div>
        </div>
      </div>

      <DeviceModal
        open={deviceModalOpen}
        onClose={() => setDeviceModalOpen(false)}
      />
    </section>
  );
}
