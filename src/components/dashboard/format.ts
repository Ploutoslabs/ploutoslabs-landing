import { formatUnits, parseEther } from "ethers";

// PLTL has 9 decimals.
export const PLTL_DECIMALS = 9;

/** Display-only conversion (float). Use bigint for anything that feeds a transaction. */
export function toPltl(raw: bigint): number {
  return Number(formatUnits(raw, PLTL_DECIMALS));
}

export function formatPltl(raw: bigint): string {
  return toPltl(raw).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/**
 * Parse the presale ETH amount typed by the user. Accepts only a plain positive decimal
 * with at most 18 fractional digits — no exponents, hex, signs, whitespace or separators —
 * so the value we send is exactly the value the visitor sees.
 */
export function parsePresaleAmount(input: string): bigint | null {
  const text = input.trim();
  if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) return null;
  try {
    const value = parseEther(text);
    return value > 0n ? value : null;
  } catch {
    return null;
  }
}

export function shortAddress(address: string): string {
  return `${address.substring(0, 6)}…${address.substring(address.length - 4)}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "02d 05h", "05h 12m", "12m 30s", "30s" — or "" once the time has passed. */
export function countdown(untilMs: number, nowMs: number): string {
  const diff = untilMs - nowMs;
  if (diff <= 0) return "";
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86_400);
  const h = Math.floor((s % 86_400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d >= 1) return `${pad(d)}d ${pad(h)}h`;
  if (h >= 1) return `${pad(h)}h ${pad(m)}m`;
  if (m >= 1) return `${pad(m)}m ${pad(sec)}s`;
  return `${pad(sec)}s`;
}

export function txUrl(hash: string): string {
  return `https://basescan.org/tx/${hash}`;
}

/** Turn an ethers/wallet error into one short human sentence. */
export function revertReason(error: unknown): string {
  const e = error as { code?: string | number; reason?: string; shortMessage?: string; message?: string; info?: { error?: { message?: string } } } | undefined;
  if (e?.code === 4001 || e?.code === "ACTION_REJECTED") return "you dismissed it in the wallet. Nothing was sent.";
  if (e?.code === "INSUFFICIENT_FUNDS") return "not enough ETH on Base to cover it.";
  const raw = e?.reason ?? e?.info?.error?.message ?? e?.shortMessage ?? e?.message ?? "";
  const cleaned = raw.replace(/^execution reverted:?\s*/i, "").split("\n")[0].trim();
  return cleaned ? `${cleaned.slice(0, 140)}.` : "the contract rejected it. Nothing was sent.";
}
