import React from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import "./WhoWeAre.css";

const pillars = [
  {
    num: "01",
    title: "Innovation",
    desc:
      "From Telegram-native wallets to crypto debit cards — we're building tools that make crypto genuinely usable, not just tradeable.",
  },
  {
    num: "02",
    title: "Transparency",
    desc:
      "Smart contracts fully audited by Cyberscope.io. KYC-verified team. $PLTL supply released gradually over 8 years for long-term stability.",
  },
  {
    num: "03",
    title: "Utility",
    desc:
      "E-commerce, bill payments, crypto cards, remote work — every product we build drives practical, everyday adoption of crypto.",
  },
];

const trustBadges = [
  { dot: "#00D16C", label: "Audited by Cyberscope.io" },
  { dot: "#3B82F6", label: "KYC Verified Team" },
  { dot: "#F59E0B", label: "BASE Layer-2 Network" },
];

const tableRows = [
  { key: "Network", value: "BASE (Layer 2 EVM)", accent: true },
  { key: "Smart Contract Audit", value: "Cyberscope.io ✓", accent: true },
  { key: "KYC Status", value: "Verified ✓", accent: true },
  { key: "Token Symbol", value: "$PLTL", accent: true },
];

export default function WhoWeAre() {
  const { ref: sectionRef, isVisible: sectionVisible } =
    useIntersectionObserver({ threshold: 0.05 });

  return (
    <section className="wwa" id="about">
      {/* Background glows */}
      <div className="wwa__bg">
        <div className="wwa__bg-glow wwa__bg-glow--1" />
        <div className="wwa__bg-glow wwa__bg-glow--2" />
      </div>

      <div className="container">
        {/* ── Two-column About layout ── */}
        <div
          className={`wwa__grid ${sectionVisible ? "wwa__grid--visible" : ""}`}
          ref={sectionRef as React.RefObject<HTMLDivElement>}
        >
          {/* LEFT COLUMN */}
          <div className="wwa__left">
            <div className="wwa__eyebrow">
              <span className="wwa__eyebrow-line" />
              ABOUT PLOUTOSLABS
            </div>

            <h2 className="wwa__headline">
              Built to Make
              <br />
              <span className="wwa__headline-accent">Crypto Work</span>
              <br />
              for Everyone
            </h2>

            <p className="wwa__tagline">
              PloutosLabs is a crypto fintech company on a mission to bridge the
              gap between digital assets and real-world financial utility —
              built on innovation, transparency, and purpose.
            </p>

            {/* Numbered pillars */}
            <div className="wwa__pillars">
              {pillars.map((p, i) => (
                <div
                  key={i}
                  className="wwa__pillar"
                  style={{ "--delay": `${i * 120}ms` } as React.CSSProperties}
                >
                  <span className="wwa__pillar-num">{p.num}</span>
                  <div className="wwa__pillar-body">
                    <div className="wwa__pillar-title">{p.title}</div>
                    <p className="wwa__pillar-desc">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="wwa__right">
            <div className="wwa__mission-card">
              <h3 className="wwa__mission-title">Our Mission &amp; Story</h3>

              <p className="wwa__mission-text">
                PloutosLabs was founded on a simple conviction: cryptocurrency
                should work in the real world, not just on paper. Too many
                projects chase speculation. We chase adoption.
              </p>
              <p className="wwa__mission-text">
                Our team — a group of fintech builders, blockchain engineers,
                and finance professionals — set out to create a complete
                ecosystem: a token with a stable release schedule, real utility
                services, and a card product that lets anyone, anywhere, spend
                crypto like cash.
              </p>
              <p className="wwa__mission-text">
                KaviPay is that card. And it's just the beginning.
              </p>

              {/* Trust badges */}
              <div className="wwa__badges">
                {trustBadges.map((b, i) => (
                  <span key={i} className="wwa__badge">
                    <span
                      className="wwa__badge-dot"
                      style={{ background: b.dot }}
                    />
                    {b.label}
                  </span>
                ))}
              </div>

              {/* Privacy note */}
              <div className="wwa__privacy-note">
                <span className="wwa__privacy-label">On team privacy:</span>{" "}
                The PloutosLabs team operates with privacy while maintaining
                full accountability through KYC verification with
                Cyberscope.io — ensuring trust without compromising security.
              </div>

              {/* Stats table */}
              <div className="wwa__table">
                {tableRows.map((row, i) => (
                  <div key={i} className="wwa__table-row">
                    <span className="wwa__table-key">{row.key}</span>
                    <span className="wwa__table-val">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}