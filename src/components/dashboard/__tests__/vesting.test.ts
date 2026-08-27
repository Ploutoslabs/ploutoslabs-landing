import { describe, expect, it } from "vitest";
import { claimableAmount, periodsUnlocked, VESTING_PERIOD_S } from "../vesting";
import type { Allocation } from "../../../hooks/useBlockchain";

const E9 = 1_000_000_000n;
const alloc = (total: bigint, claimed: bigint, next: bigint): Allocation => ({
  index: 0,
  totalAmount: total,
  claimedAmount: claimed,
  nextClaimTime: next,
});
const ms = (sec: number | bigint) => Number(sec) * 1000;

describe("periodsUnlocked", () => {
  it("is 0 before nextClaimTime", () => {
    expect(periodsUnlocked(alloc(100n * E9, 0n, 1_000n), ms(999))).toBe(0);
  });
  it("is 1 exactly at nextClaimTime (inclusive)", () => {
    expect(periodsUnlocked(alloc(100n * E9, 0n, 1_000n), ms(1_000))).toBe(1);
  });
  it("adds one per full 30-day period elapsed", () => {
    const next = 1_000n;
    expect(periodsUnlocked(alloc(100n * E9, 0n, next), ms(next + VESTING_PERIOD_S - 1n))).toBe(1);
    expect(periodsUnlocked(alloc(100n * E9, 0n, next), ms(next + VESTING_PERIOD_S))).toBe(2);
  });
});

describe("claimableAmount (fork-verified data points)", () => {
  it("fresh 100 PLTL batch at its unlock time pays 1% — fork paid 1 PLTL", () => {
    expect(claimableAmount(alloc(100n * E9, 0n, 1_787_797_881n), ms(1_787_797_881n))).toBe(1n * E9);
  });
  it("1,000,000 PLTL unlocked since 2024-06-26, read on 2026-08-27 → 27% = 270,000 (fork paid 270,000)", () => {
    expect(claimableAmount(alloc(1_000_000n * E9, 0n, 1_719_412_649n), ms(1_787_826_754))).toBe(270_000n * E9);
  });
  it("locked holder 0xa2A8… batch #1 → 0", () => {
    expect(claimableAmount(alloc(69_600n * E9, 18_792n * E9, 1_789_395_517n), ms(1_787_826_754))).toBe(0n);
  });
  it("caps at the remaining balance after 150 periods — fork paid the full remainder", () => {
    expect(claimableAmount(alloc(100n * E9, 0n, 0n), ms(150n * VESTING_PERIOD_S))).toBe(100n * E9);
  });
  it("caps at remainder when partly claimed", () => {
    expect(claimableAmount(alloc(100n * E9, 95n * E9, 0n), ms(10n * VESTING_PERIOD_S))).toBe(5n * E9);
  });
  it("is 0 once fully claimed even if periods have elapsed", () => {
    expect(claimableAmount(alloc(100n * E9, 100n * E9, 0n), ms(5n * VESTING_PERIOD_S))).toBe(0n);
  });
  it("stays exact above 2^53 raw units", () => {
    const huge = 50_000_000n * E9; // 5e16 raw
    expect(claimableAmount(alloc(huge, 0n, 0n), ms(VESTING_PERIOD_S))).toBe(huge * 2n / 100n);
  });
});
