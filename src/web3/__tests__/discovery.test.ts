// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { discoverWallets } from "../discovery";

const provider = (flags: Record<string, boolean> = {}) => ({ request: vi.fn(), ...flags });
const announce = (rdns: string, name: string) =>
  window.dispatchEvent(
    new CustomEvent("eip6963:announceProvider", { detail: { info: { uuid: rdns + "-uuid", rdns, name, icon: "" }, provider: provider() } }),
  );

afterEach(() => {
  delete (window as { ethereum?: unknown }).ethereum;
});

describe("discoverWallets", () => {
  it("falls back to window.ethereum when nothing announces, naming it by its flags", () => {
    (window as { ethereum?: unknown }).ethereum = provider({ isRabby: true });
    const onChange = vi.fn();
    discoverWallets(onChange)();
    expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ id: "legacy:window.ethereum", name: "Rabby" })]);
  });
  it("replaces the legacy entry with announced wallets, de-duplicates by rdns, and prefers MetaMask", () => {
    (window as { ethereum?: unknown }).ethereum = provider({ isMetaMask: true });
    const onChange = vi.fn();
    const stop = discoverWallets(onChange);
    announce("io.rabby", "Rabby Wallet");
    announce("io.metamask", "MetaMask");
    announce("io.metamask", "MetaMask"); // second announcement of the same wallet
    const last = onChange.mock.calls.at(-1)![0] as { id: string }[];
    expect(last.map((w) => w.id)).toEqual(["io.metamask", "io.rabby"]);
    stop();
  });
  it("stops listening after cleanup", () => {
    const onChange = vi.fn();
    discoverWallets(onChange)();
    const before = onChange.mock.calls.length;
    announce("io.metamask", "MetaMask");
    expect(onChange.mock.calls.length).toBe(before);
  });
});
