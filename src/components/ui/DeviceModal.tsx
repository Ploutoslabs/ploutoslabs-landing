import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { APP_STORE_URL, PLAY_STORE_URL } from "../../lib/appLinks";
import iosPhone from "../../assets/IOS.png";
import androidPhone from "../../assets/Android.png";
import "./DeviceModal.css";

interface DeviceModalProps {
  open: boolean;
  onClose: () => void;
}

const devices = [
  {
    key: "ios",
    image: iosPhone,
    alt: "iPhone",
    name: "iPhone",
    store: "Download on the App Store",
    url: APP_STORE_URL,
    // Apple logo
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    key: "android",
    image: androidPhone,
    alt: "Android phone",
    name: "Android",
    store: "Get it on Google Play",
    url: PLAY_STORE_URL,
    // Android robot
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.6 9.48l1.84-3.18a.4.4 0 0 0-.7-.4l-1.87 3.23a11.4 11.4 0 0 0-9.74 0L5.26 5.9a.4.4 0 1 0-.7.4L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52M7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5m10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5" />
      </svg>
    ),
  },
];

/**
 * Device picker shown before sending someone to a store.
 * iPhone → App Store, Android → Google Play.
 */
export default function DeviceModal({ open, onClose }: DeviceModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close on Escape, and lock background scrolling while open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="dm__overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dm-title"
        ref={dialogRef}
      >
        <button
          className="dm__close"
          onClick={onClose}
          aria-label="Close"
          ref={closeBtnRef}
        >
          <X size={18} />
        </button>

        <div className="dm__header">
          <h2 className="dm__title" id="dm-title">
            Get your KaviPay card
          </h2>
          <p className="dm__sub">
            Choose your device and we'll take you to the right store.
          </p>
        </div>

        <div className="dm__grid">
          {devices.map((d) => (
            <a
              key={d.key}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`dm__card dm__card--${d.key}`}
              onClick={onClose}
            >
              <div className="dm__phone-wrap">
                <img
                  src={d.image}
                  alt={d.alt}
                  className={`dm__phone dm__phone--${d.key}`}
                />
                <span className="dm__phone-logo">{d.logo}</span>
              </div>

              <div className="dm__card-body">
                <span className="dm__card-name">{d.name}</span>
                <span className="dm__card-store">{d.store}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
