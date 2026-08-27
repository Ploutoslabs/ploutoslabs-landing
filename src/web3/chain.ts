/** Base mainnet — where the PLTL contract lives. */
export const BASE_CHAIN_ID = 8453n;
export const BASE_CHAIN_ID_HEX = "0x2105";

export const BASE_CHAIN_PARAMS = {
  chainId: BASE_CHAIN_ID_HEX,
  chainName: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

/** Overrides every PLTL transaction carries so the wallet itself rejects a chain mismatch. */
export const BASE_TX_OVERRIDES = { chainId: BASE_CHAIN_ID } as const;

export class WrongChainError extends Error {
  readonly chainIdHex: string;
  constructor(chainIdHex: string) {
    super(`Wallet is on chain ${chainIdHex}, not Base (${BASE_CHAIN_ID_HEX}).`);
    this.name = "WrongChainError";
    this.chainIdHex = chainIdHex;
  }
}

/** Parse an EIP-1193 eth_chainId result (hex string or number) and compare to Base. */
export function isBaseChainId(value: unknown): boolean {
  if (typeof value === "string") return BigInt(value) === BASE_CHAIN_ID;
  if (typeof value === "number" || typeof value === "bigint") return BigInt(value) === BASE_CHAIN_ID;
  return false;
}
