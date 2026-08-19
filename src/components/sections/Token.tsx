import React, { useState } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import tokenCoin from "../../assets/Token.png";
import "./Token.css";

const tokenDetails = [
  {
    emoji: "🔗",
    emojiBg: "#1e3a5f",
    title: "Network",
    desc: (
      <>
        BASE Layer-2 EVM —{" "}
        <span className="token__detail-highlight">
          ultra-fast, low-fee transactions
        </span>
      </>
    ),
  },
  {
    emoji: "📅",
    emojiBg: "#7f1d1d",
    title: "Release Schedule",
    desc: (
      <>
        Limited supply{" "}
        <span className="token__detail-highlight">
          unlocked gradually over 8 years
        </span>
      </>
    ),
  },
  {
    emoji: "🔒",
    emojiBg: "#713f12",
    title: "Total Supply",
    desc: (
      <>
        Audited contract ·{" "}
        <span className="token__detail-highlight">Fixed maximum supply</span>
      </>
    ),
    badge: true,
  },
  {
    emoji: "💳",
    emojiBg: "#1e3a5f",
    title: "Primary Utility",
    desc: (
      <>
        <span className="token__detail-highlight">Fund KaviPay cards</span>, pay
        in ecosystem,{" "}
        <span className="token__detail-highlight">store of value</span>
      </>
    ),
  },
];

export default function Token() {
  const [email, setEmail] = useState("");
  const [notifyStatus, setNotifyStatus] = useState<"idle" | "submitted">(
    "idle",
  );

  const { ref: heroRef, isVisible: heroVisible } = useIntersectionObserver({
    threshold: 0.05,
  });
  const { ref: detailsRef, isVisible: detailsVisible } =
    useIntersectionObserver({
      threshold: 0.05,
    });
  const { ref: notifyRef, isVisible: notifyVisible } = useIntersectionObserver({
    threshold: 0.05,
  });
  const { ref: coinRef, isVisible: coinVisible } = useIntersectionObserver({
    threshold: 0.05,
  });

  /**
   * The waitlist backend isn't live yet, so instead of silently discarding the
   * address we hand the visitor a channel that does work (Telegram / email)
   * and tell them the signup form itself is still coming.
   */
  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
    setNotifyStatus("submitted");
  };

  return (
    <section className="token" id="pltl-token">
      {/* Background */}
      <div className="token__bg">
        <div className="token__glow token__glow--1" />
        <div className="token__glow token__glow--2" />
      </div>

      <div className="container">
        <div className="token__layout">
          {/* ── LEFT COLUMN ── */}
          <div
            className={`token__left ${heroVisible ? "token__left--visible" : ""}`}
            ref={heroRef as React.RefObject<HTMLDivElement>}
          >
            {/* Eyebrow badge */}
            <div className="token__eyebrow">
              <span className="token__eyebrow-dot" />
              Launching Soon
            </div>

            {/* Headline */}
            <h2 className="token__headline">
              The <span className="token__headline-accent">$PLTL Token</span>
              <br />
              Is Coming
            </h2>

            {/* Description */}
            <p className="token__desc">
              $PLTL is PloutosLabs' native utility token — built on BASE network
              with a limited, gradually released supply over 8 years. Designed
              for stability, real-world spending, and ecosystem rewards.
            </p>

            {/* Detail rows */}
            <div
              className={`token__details ${detailsVisible ? "token__details--visible" : ""}`}
              ref={detailsRef as React.RefObject<HTMLDivElement>}
            >
              {tokenDetails.map((d, i) => (
                <div
                  key={i}
                  className="token__detail-row"
                  style={{ "--delay": `${i * 100}ms` } as React.CSSProperties}
                >
                  <div
                    className="token__detail-icon"
                    style={{ background: d.emojiBg }}
                  >
                    {d.emoji}
                  </div>
                  <div className="token__detail-body">
                    <div className="token__detail-title">{d.title}</div>
                    <div className="token__detail-desc">{d.desc}</div>
                  </div>
                  {d.badge && (
                    <div className="token__detail-badge-wrap">
                      <span
                        className="token__detail-badge"
                        aria-label="Redacted"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Notify panel */}
            <div
              className={`token__notify ${notifyVisible ? "token__notify--visible" : ""}`}
              ref={notifyRef as React.RefObject<HTMLDivElement>}
            >
              <div className="token__notify-title">🔔 Be the First to Know</div>
              <p className="token__notify-desc">
                Join the waitlist to get notified the moment $PLTL launches, and
                secure early access to presale pricing.
              </p>
              <form className="token__notify-form" onSubmit={handleNotify}>
                <input
                  className="token__notify-input"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="token__notify-btn" type="submit">
                  Notify Me
                </button>
              </form>

              {notifyStatus === "submitted" && (
                <p className="token__notify-note" role="status">
                  Our waitlist signup is coming soon. In the meantime, join{" "}
                  <a
                    href="https://t.me/ploutoslab"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    our Telegram
                  </a>{" "}
                  or email{" "}
                  <a href="mailto:support@kavipay.io">support@kavipay.io</a> and
                  we'll notify you the moment $PLTL launches.
                </p>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN — Coin visual ── */}
          <div
            className={`token__right ${coinVisible ? "token__right--visible" : ""}`}
            ref={coinRef as React.RefObject<HTMLDivElement>}
          >
            <div className="token__coin-scene">
              {/* Outer orbit ring */}
              <div className="token__orbit-ring token__orbit-ring--outer">
                <span className="token__orbit-dot" />
              </div>
              {/* Inner orbit ring */}
              <div className="token__orbit-ring token__orbit-ring--inner" />
              {/* Coin */}
              <div className="token__coin">
                <img src={tokenCoin} alt="" />
              </div>
              {/* Coming Soon badge */}
              <div className="token__coming-soon">COMING SOON</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div className="token__cta-banner">
        <div className="token__cta-banner-bg" />
        <div className="container">
          <div className="token__cta-inner">
            <div className="token__cta-eyebrow">
              <span className="token__cta-line" />
              GET STARTED TODAY
            </div>
            <h2 className="token__cta-headline">
              Ready to Spend
              <br />
              <span className="token__cta-headline-accent">
                Crypto in the Real World?
              </span>
            </h2>
            <p className="token__cta-desc">
              Join thousands already using PloutosLabs and KaviPay. Get your
              card, spend your crypto, and experience a financial system that
              actually works for you.
            </p>
            <div className="token__cta-btns">
              <a href="https://www.kavipay.io/" target="_blank" rel="noopener noreferrer" className="token__cta-btn token__cta-btn--primary">
                Get KaviPay Card
              </a>
              <a href="https://www.kavipay.io/app" target="_blank" rel="noopener noreferrer" className="token__cta-btn token__cta-btn--ghost">
                Launch App
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
