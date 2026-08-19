import { useEffect, useState } from "react";
import "./BackToTop.css";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollProgress(progress);
      setVisible(scrollTop > 300);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      className={`back-to-top ${visible ? "back-to-top--visible" : ""}`}
      onClick={handleClick}
      aria-label="Back to top"
    >
      <svg
        className="back-to-top__ring"
        width="48"
        height="48"
        viewBox="0 0 48 48"
      >
        <circle
          className="back-to-top__ring-track"
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          strokeWidth="2"
        />
        <circle
          className="back-to-top__ring-progress"
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
        />
      </svg>

      <svg
        className="back-to-top__arrow"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
