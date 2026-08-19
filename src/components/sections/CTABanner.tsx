import {
  Wallet,
  ArrowLeftRight,
  Bell,
  ShieldCheck,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { APP_STORE_URL, PLAY_STORE_URL } from "../../lib/appLinks";
import kaviPayApp from "../../assets/kavipay-app.jpeg";
import "./CTABanner.css";

const features = [
  {
    icon: <Wallet size={28} color="#fff" />,
    title: "Secure Digital Wallet",
    desc: "Store and manage your funds securely on your mobile device.",
  },
  {
    icon: <ArrowLeftRight size={28} color="#fff" />,
    title: "Instant Trading",
    desc: "Buy, sell, and swap cryptocurrencies instantly with competitive rates.",
  },
  {
    icon: <Bell size={28} color="#fff" />,
    title: "Real-time Alerts",
    desc: "Stay updated with price movements and market notifications.",
  },
];

function PhoneMockup() {
  return (
    <div className="cta-phone-wrap">
      {/* Floating animated bubbles */}
      <div className="cta-bubble cta-bubble--shield">
        <ShieldCheck size={22} color="#fff" />
      </div>
      <div className="cta-bubble cta-bubble--zap">
        <Zap size={22} color="#fff" />
      </div>
      <div className="cta-bubble cta-bubble--chart">
        <TrendingUp size={22} color="#fff" />
      </div>

      {/* Phone frame — real KaviPay app screenshot */}
      <div className="cta-phone">
        <img
          src={kaviPayApp}
          alt="The KaviPay app dashboard showing available balance, cards and recent activity"
          className="cta-phone__screen"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

export default function CTABanner() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section className="cta-banner" ref={ref}>
      <div className="container">
        <div
          className={`cta-banner__card ${isVisible ? "cta-banner__card--visible" : ""}`}
        >
          <div className="cta-banner__glow" />
          <div className="cta-banner__grid" />

          <div className="cta-banner__content">
            {/* Top text block */}
            <div className="cta-banner__text-block">
              <div className="section-badge" style={{ margin: "0 auto 20px" }}>
                Start today — it's free
              </div>
              <h2 className="cta-banner__title">
                Your global payment
                <br />
                card is one tap away
              </h2>
              <p className="cta-banner__sub">
                Join the Africans using KaviPay to spend smarter, fund with
                crypto, and pay bills effortlessly.
              </p>
            </div>

            {/* Two-column: features + phone */}
            <div className="cta-banner__split">
              {/* Left: feature cards + store buttons */}
              <div className="cta-banner__features">
                {features.map((f) => (
                  <div key={f.title} className="cta-feature-card">
                    <div className="cta-feature-card__icon">{f.icon}</div>
                    <div className="cta-feature-card__body">
                      <h3 className="cta-feature-card__title">{f.title}</h3>
                      <p className="cta-feature-card__desc">{f.desc}</p>
                    </div>
                  </div>
                ))}

                {/* Store download buttons */}
                <div className="cta-store-buttons">
                  {/* App Store */}
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-store-btn cta-store-btn--apple"
                    aria-label="Download KaviPay on the App Store"
                  >
                    <div className="cta-store-btn__inner">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="30"
                        height="30"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      <div className="cta-store-btn__text">
                        <span className="cta-store-btn__sub">
                          Download on the
                        </span>
                        <span className="cta-store-btn__name">App Store</span>
                      </div>
                    </div>
                  </a>

                  {/* Google Play */}
                  <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-store-btn cta-store-btn--google"
                    aria-label="Get KaviPay on Google Play"
                  >
                    <div className="cta-store-btn__inner">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="30"
                        height="30"
                      >
                        <path d="M3.18 23.76c.3.17.65.19.97.07l12.59-7.33-2.68-2.68-10.88 9.94zM.94 1.15C.36 1.69 0 2.54 0 3.67v16.56c0 1.13.36 1.98.94 2.52l.13.12L13.76 11.2v-.27L1.07 1.03l-.13.12zM20.54 8.73l-2.79-1.62-2.97 2.97 2.97 2.97 2.8-1.63c.8-.46.8-1.22-.01-1.69zM3.18.14l12.59 7.33-2.68 2.68L2.21.21c.32-.12.67-.1.97.07v-.14z" />
                      </svg>
                      <div className="cta-store-btn__text">
                        <span className="cta-store-btn__sub">GET IT ON</span>
                        <span className="cta-store-btn__name">Google Play</span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right: phone mockup */}
              <PhoneMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
