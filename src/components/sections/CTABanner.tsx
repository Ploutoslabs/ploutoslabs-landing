import { Shield, Zap, CheckCircle2 } from "lucide-react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { APP_STORE_URL, PLAY_STORE_URL } from "../../lib/appLinks";
import kaviPayCard from "../../assets/kavipay-app2.jpeg";
import kaviPayDashboard from "../../assets/kavipay-app1.jpeg";
import kaviPayUtilities from "../../assets/kavipay-app3.jpeg";
import "./CTABanner.css";

/** Card, dashboard and bill payments — the lead phone sits in the middle. */
const screens = [
  {
    src: kaviPayCard,
    alt: "The KaviPay card screen showing a virtual card balance and spending analytics",
    side: true,
  },
  {
    src: kaviPayDashboard,
    alt: "The KaviPay app dashboard showing available balance and cards",
    side: false,
  },
  {
    src: kaviPayUtilities,
    alt: "The KaviPay utilities screen for paying airtime, data, electricity and TV bills",
    side: true,
  },
];

const trustPoints = [
  { icon: Shield, label: "Bank-grade security" },
  { icon: Zap, label: "Card ready in minutes" },
  { icon: CheckCircle2, label: "Fund with crypto or Naira" },
];

export default function CTABanner() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section className="cta-banner" ref={ref}>
      <div className="cta-banner__glow" />

      <div
        className={`container cta-banner__inner ${
          isVisible ? "cta-banner__inner--visible" : ""
        }`}>
        <div className="cta-banner__eyebrow">Start today — it's free</div>

        <h2 className="cta-banner__title">
          Your global payment card is{" "}
          <span className="cta-banner__title-accent">one tap away</span>
        </h2>

        <p className="cta-banner__sub">
          Join thousands across Africa using KaviPay to spend smarter, fund with
          crypto, and pay bills effortlessly.
        </p>

        <div className="cta-store-buttons">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-store-btn cta-store-btn--primary"
            aria-label="Download KaviPay on the App Store">
            <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span className="cta-store-btn__text">
              <span className="cta-store-btn__sub">Download on the</span>
              <span className="cta-store-btn__name">App Store</span>
            </span>
          </a>

          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-store-btn cta-store-btn--ghost"
            aria-label="Get KaviPay on Google Play">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
              width="24"
              height="24">
              <path d="M4 3l14 9-14 9V3z" />
              <path d="M4 3l10.5 10.5" />
            </svg>
            <span className="cta-store-btn__text">
              <span className="cta-store-btn__sub">Get it on</span>
              <span className="cta-store-btn__name">Google Play</span>
            </span>
          </a>
        </div>

        <div className="cta-trust">
          {trustPoints.map(({ icon: Icon, label }, i) => (
            <div key={label} className="cta-trust__item">
              {i > 0 && <span className="cta-trust__divider" aria-hidden="true" />}
              <Icon size={15} className="cta-trust__icon" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="cta-phones">
          {screens.map((s, i) => (
            <div
              key={i}
              className={`cta-phone ${s.side ? "cta-phone--side" : "cta-phone--lead"}`}>
              <img
                src={s.src}
                alt={s.alt}
                className="cta-phone__screen"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
