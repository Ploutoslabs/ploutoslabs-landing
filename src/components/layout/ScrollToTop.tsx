import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router keeps the window scroll position across route changes, so
 * navigating from the bottom of one page drops you mid-way down the next.
 * This resets to the top on every navigation (but honours #hash targets).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
