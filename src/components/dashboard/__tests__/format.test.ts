import { describe, expect, it } from "vitest";
import { countdown, formatPltl, parsePresaleAmount, revertReason, shortAddress, toPltl } from "../format";

describe("parsePresaleAmount", () => {
  it("accepts plain decimals", () => {
    expect(parsePresaleAmount("0.05")).toBe(50_000_000_000_000_000n);
    expect(parsePresaleAmount("1")).toBe(10n ** 18n);
    expect(parsePresaleAmount(".5")).toBe(5n * 10n ** 17n);
    expect(parsePresaleAmount(" 0.5 ")).toBe(5n * 10n ** 17n);
  });
  it("rejects everything Number() would have let through to parseEther", () => {
    for (const bad of ["1e-3", "0x10", "Infinity", "-1", "+1", "0,5", "1_000", "", "   ", "abc", "0.0000000000000000001"]) {
      expect(parsePresaleAmount(bad), bad).toBeNull();
    }
  });
  it("rejects zero", () => {
    expect(parsePresaleAmount("0")).toBeNull();
    expect(parsePresaleAmount("0.0")).toBeNull();
  });
});

describe("PLTL formatting", () => {
  it("converts 9-decimal raw units", () => {
    expect(toPltl(1_000_000_000n)).toBe(1);
    expect(formatPltl(270_000n * 1_000_000_000n)).toBe("270,000");
    expect(formatPltl(1_234_560_000n)).toBe("1.23");
  });
  it("shortens addresses", () => {
    expect(shortAddress("0x87C2422Be9a11B71a5C530Ecd156134d3B04E3Ce")).toBe("0x87C2…E3Ce");
  });
});

describe("countdown", () => {
  const now = 1_000_000_000;
  it("is empty once the time has passed", () => {
    expect(countdown(now, now)).toBe("");
    expect(countdown(now - 1, now)).toBe("");
  });
  it("picks the two most significant units", () => {
    expect(countdown(now + (2 * 86_400 + 5 * 3600) * 1000, now)).toBe("02d 05h");
    expect(countdown(now + (5 * 3600 + 12 * 60) * 1000, now)).toBe("05h 12m");
    expect(countdown(now + (12 * 60 + 30) * 1000, now)).toBe("12m 30s");
    expect(countdown(now + 30 * 1000, now)).toBe("30s");
  });
});

describe("revertReason", () => {
  it("maps user rejection", () => {
    expect(revertReason({ code: 4001 })).toMatch(/dismissed/);
    expect(revertReason({ code: "ACTION_REJECTED" })).toMatch(/dismissed/);
  });
  it("strips the 'execution reverted:' prefix and keeps the contract's message", () => {
    expect(revertReason({ reason: "Claim not yet available" })).toBe("Claim not yet available.");
    expect(revertReason({ message: "execution reverted: Invalid index\nmore" })).toBe("Invalid index.");
  });
  it("falls back to a safe sentence", () => {
    expect(revertReason(undefined)).toMatch(/Nothing was sent/);
  });
});
