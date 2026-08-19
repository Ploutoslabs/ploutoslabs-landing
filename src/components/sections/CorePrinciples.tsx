import React from "react";
import { Shield, Eye, Users, Zap, Scale, Heart } from "lucide-react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import "./CorePrinciples.css";

const principles = [
  {
    icon: Shield,
    title: "Security First",
    description:
      "Every decision we make starts with one question: is this safe for our users? We employ bank-grade encryption, multi-layer authentication, and continuous monitoring — because trust is our foundation.",
    color: "#00D16C",
    number: "01",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Fully audited smart contracts (Cyberscope.io), KYC-verified team, and publicly documented tokenomics with clear milestone triggers.",
    color: "#3B82F6",
    number: "02",
  },
  {
    icon: Users,
    title: "Utility",
    description:
      "$PLTL designed for practical use—e-commerce payments, card rewards, MFB banking incentives, and cross-border transfers.",
    color: "#8B5CF6",
    number: "03",
  },
  {
    icon: Zap,
    title: "Speed & Reliability",
    description:
      "In finance, seconds matter. We architect our systems for 99.9% uptime and sub-second transaction speeds — because slow money is the same as no money.",
    color: "#F59E0B",
    number: "04",
  },
  {
    icon: Scale,
    title: "Regulatory Integrity",
    description:
      "We operate within the law — always. Rigorous KYC verification, AML monitoring, and a partner-first approach to regulators ensure that Ploutoslabs remains a platform you can trust for the long term.",
    color: "#EC4899",
    number: "05",
  },
  {
    icon: Heart,
    title: "Innovation",
    description:
      "Pioneering approaches including Telegram-based smart wallet integration, play-to-earn gaming, and milestone-based regulatory compliance.",
    color: "#00D16C",
    number: "06",
  },
];

export default function CorePrinciples() {
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver({
    threshold: 0.1,
  });
  const { ref: gridRef, isVisible: gridVisible } = useIntersectionObserver({
    threshold: 0.05,
  });
  const { ref: bottomRef, isVisible: bottomVisible } = useIntersectionObserver({
    threshold: 0.2,
  });

  return (
    <section className="cp" id="core-principles">
      <div className="container">
        {/* Header */}
        <div
          className={`section-header ${headerVisible ? "section-header--visible" : ""}`}
          ref={headerRef as React.RefObject<HTMLDivElement>}
        >
          <div className="section-badge">Core Principles</div>
          <h2 className="section-title">
            The values that
            <br />
            <span className="section-title-accent">guide everything we do</span>
          </h2>
          <p className="section-subtitle">
            Principles aren't posters on a wall. At Ploutoslabs, they're the
            framework every product decision, every line of code, and every
            interaction is measured against.
          </p>
        </div>

        {/* Principles grid */}
        <div
          className={`cp__grid ${gridVisible ? "cp__grid--visible" : ""}`}
          ref={gridRef as React.RefObject<HTMLDivElement>}
        >
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="cp__card"
                style={
                  {
                    "--p-color": p.color,
                    "--delay": `${i * 90}ms`,
                  } as React.CSSProperties
                }
              >
                <div className="cp__card-number">{p.number}</div>
                <div className="cp__card-body">
                  <div className="cp__icon-wrap">
                    <Icon size={22} />
                  </div>
                  <h3 className="cp__card-title">{p.title}</h3>
                  <p className="cp__card-desc">{p.description}</p>
                </div>
                <div className="cp__card-border-glow" />
              </div>
            );
          })}
        </div>

        {/* Bottom principle banner */}
        <div
          className={`cp__banner ${bottomVisible ? "cp__banner--visible" : ""}`}
          ref={bottomRef as React.RefObject<HTMLDivElement>}
        >
          <div className="cp__banner-glow" />
          <div className="cp__banner-grid" />
          <div className="cp__banner-content">
            <div className="cp__banner-icon">⚖️</div>
            <div>
              <h3 className="cp__banner-title">
                Principles over profit, always
              </h3>
              <p className="cp__banner-text">
                We've turned down shortcuts that would have grown our revenue
                but compromised our users. That's not a sacrifice — that's what
                it means to build something that lasts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
