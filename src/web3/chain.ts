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
