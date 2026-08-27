import { describe, expect, it } from "vitest";
import { BASE_TX_OVERRIDES, isBaseChainId } from "../chain";

describe("isBaseChainId", () => {
  it("accepts Base in every EIP-1193 encoding", () => {
    expect(isBaseChainId("0x2105")).toBe(true);
    expect(isBaseChainId(8453)).toBe(true);
    expect(isBaseChainId(8453n)).toBe(true);
  });
  it("rejects other chains and junk", () => {
    expect(isBaseChainId("0x1")).toBe(false);
    expect(isBaseChainId("0xa4b1")).toBe(false);
    expect(isBaseChainId(undefined)).toBe(false);
    expect(isBaseChainId(null)).toBe(false);
  });
  it("pins transactions to Base", () => {
    expect(BASE_TX_OVERRIDES.chainId).toBe(8453n);
  });
});
