import { useEffect, useState } from "react";
import type { Allocation } from "../../hooks/useBlockchain";

/**
 * PLTL vesting, as observed on the deployed contract (verified on a Base fork):
 * once `nextClaimTime` has passed, a claim releases 1% of the batch for every
 * 30-day period since then (inclusive), and pushes `nextClaimTime` forward by
 * that many periods. Nothing beyond the remaining balance can be released.
 */
export const VESTING_PERIOD_S = 2_592_000n; // 30 days
export const RELEASE_PER_PERIOD_BPS = 100n; // 1% per period (basis points of the batch)

export function periodsUnlocked(a: Allocation, nowMs: number): number {
  const now = BigInt(Math.floor(nowMs / 1000));
  if (now < a.nextClaimTime) return 0;
  return Number((now - a.nextClaimTime) / VESTING_PERIOD_S) + 1;
}

/** Raw (9-decimal) PLTL a claim would pay out right now. */
export function claimableAmount(a: Allocation, nowMs: number): bigint {
  const periods = periodsUnlocked(a, nowMs);
  if (periods === 0) return 0n;
  const remaining = a.totalAmount - a.claimedAmount;
  if (remaining <= 0n) return 0n;
  const released = (a.totalAmount * RELEASE_PER_PERIOD_BPS * BigInt(periods)) / 10_000n;
  return released < remaining ? released : remaining;
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
