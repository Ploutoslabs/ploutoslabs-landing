import React from "react";
import { Target, Compass, TrendingUp } from "lucide-react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import "./MissionStatement.css";

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    statement:
      "To democratize access to global financial infrastructure for every African — by bridging crypto, fiat, and everyday payments into one seamless, borderless experience.",
    color: "#00D16C",
    label: "Mission",
  },
  {
    icon: Compass,
    title: "Our Vision",
    statement:
      "A world where geography is no longer a barrier to financial opportunity. Where a developer in Enugu, a trader in Kano, and a student in Accra all have the same financial tools as anyone in New York or London.",
    color: "#3B82F6",
    label: "Vision",
  },
  {
    icon: TrendingUp,
    title: "Our Goal",
    statement:
      "To reach 10 million users across Africa by 2027 — empowering them to earn, spend, save, and grow their wealth freely, without the friction that has held African finance back for decades.",
    color: "#8B5CF6",
    label: "Goal",
  },
];

const commitments = [
  { emoji: "🌍", text: "Build for Africa, scale for the world" },
  { emoji: "⚡", text: "Ship fast, iterate faster" },
  { emoji: "🤝", text: "Partner with regulators, not against them" },
  { emoji: "🔒", text: "Never compromise on user security" },
  { emoji: "💡", text: "Listen to users, always" },
  { emoji: "📈", text: "Grow sustainably and responsibly" },
];

export default function MissionStatement() {
  const { ref: heroRef, isVisible: heroVisible } = useIntersectionObserver({
    threshold: 0.1,
  });
  const { ref: pillarsRef, isVisible: pillarsVisible } =
    useIntersectionObserver({ threshold: 0.05 });
  const { ref: commitRef, isVisible: commitVisible } = useIntersectionObserver({
    threshold: 0.1,
  });

  return (
    <section className="ms" id="mission">
      {/* Full-bleed dark hero strip */}
      <div
        className="ms__hero"
        ref={heroRef as React.RefObject<HTMLDivElement>}
      >
        <div className="ms__hero-bg">
          <div className="ms__hero-glow ms__hero-glow--1" />
          <div className="ms__hero-glow ms__hero-glow--2" />
          <div className="ms__hero-grid" />
        </div>
        <div className="container">
          <div
            className={`ms__hero-content ${heroVisible ? "ms__hero-content--visible" : ""}`}
          >
            <div className="section-badge" style={{ margin: "0 auto 24px" }}>
              Mission Statement
            </div>
            <h2 className="ms__hero-title">
              We exist to make
              <br />
              <span className="ms__hero-accent">African money move freely</span>
            </h2>
            <p className="ms__hero-sub">
              The global financial system was not built with Africa in mind.
              We're changing that — one transaction at a time.
            </p>

            {/* Central mission quote */}
            <div className="ms__quote">
              <div className="ms__quote-mark">"</div>
              <blockquote className="ms__quote-text">
              To support people and businesses through reliable and accessible financial and crypto services that create everyday utility and lasting impact.
              </blockquote>
              <div className="ms__quote-author">
                <div className="ms__quote-avatar">PL</div>
                <div>
                  <div className="ms__quote-name">The PloutosLabs Team</div>
                  <div className="ms__quote-role">
                    Building for Africa, since day one
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission / Vision / Goal pillars */}
      <div className="container">
        <div
          className={`ms__pillars ${pillarsVisible ? "ms__pillars--visible" : ""}`}
          ref={pillarsRef as React.RefObject<HTMLDivElement>}
        >
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="ms__pillar"
                style={
                  {
                    "--p-color": p.color,
                    "--delay": `${i * 120}ms`,
                  } as React.CSSProperties
                }
              >
                <div className="ms__pillar-top">
                  <div className="ms__pillar-icon">
                    <Icon size={22} />
                  </div>
                  <span className="ms__pillar-label">{p.label}</span>
                </div>
                <h3 className="ms__pillar-title">{p.title}</h3>
                <p className="ms__pillar-text">{p.statement}</p>
                <div className="ms__pillar-line" />
              </div>
            );
          })}
        </div>

        {/* Commitments grid */}
        <div
          className={`ms__commitments ${commitVisible ? "ms__commitments--visible" : ""}`}
          ref={commitRef as React.RefObject<HTMLDivElement>}
        >
          <div className="ms__commit-header">
            <h3 className="ms__commit-title">What we commit to, every day</h3>
          </div>
          <div className="ms__commit-grid">
            {commitments.map((c, i) => (
              <div
                key={i}
                className="ms__commit-item"
                style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}
              >
                <span className="ms__commit-emoji">{c.emoji}</span>
                <span className="ms__commit-text">{c.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div
          className={`ms__final-cta ${commitVisible ? "ms__final-cta--visible" : ""}`}
        >
          <h3 className="ms__final-title">Be part of the movement</h3>
          <p className="ms__final-sub">
            Join the Africans choosing to move their money freely.
          </p>
          <div className="ms__final-actions">
            <a href="https://www.kavipay.io/" target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--lg">
              Create Free Account
            </a>
            <a href="#about" className="btn btn--ghost btn--lg">
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
