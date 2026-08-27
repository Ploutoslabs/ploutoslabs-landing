import { useEffect, useState } from "react";
import type { Allocation } from "../../hooks/useBlockchain";

export function isClaimable(a: Allocation, nowMs: number) {
  return Number(a.nextClaimTime) * 1000 <= nowMs && a.claimedAmount < a.totalAmount;
}

/** Ticking clock so countdown chips stay live. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
