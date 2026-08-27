import { createContext, useContext } from "react";
import type { Contract } from "ethers";
import type { WalletOption } from "../web3/discovery";

export interface Allocation {
  /** 0-based index used by claimAllocation(index). */
  index: number;
  totalAmount: bigint;
  claimedAmount: bigint;
  /** Unix seconds. */
  nextClaimTime: bigint;
}

export type WalletStatus =
  | "detecting" // waiting to see whether the browser injects a wallet
  | "none" // no injected wallet
  | "idle" // wallet present, not connected
  | "connecting" // eth_requestAccounts in flight
  | "connected";

export interface BlockchainState {
  /** Contract bound to the wallet signer — for transactions. */
  contractWriter?: Contract;
  /** Contract bound to the read-only provider. */
  contractReader?: Contract;
  walletAddress: string;
  balance: bigint;
  /** True once an injected wallet has granted account access. */
  active: boolean;
  /** No injected wallet (window.ethereum) in this browser. */
  noWallet: boolean;
  walletStatus: WalletStatus;
  /** Human-readable reason the last connect attempt failed, if any. */
  connectError: string | null;
  /** Non-error guidance while a connect request is taking unusually long (wallet popup hidden/locked). */
  connectHint: string | null;
  /** Wallet is connected but on a chain other than Base. */
  wrongChain: boolean;
  /** Wallets announced via EIP-6963 (or the legacy window.ethereum as a single entry). */
  wallets: WalletOption[];
  /** The wallet the current session is bound to. */
  selectedWallet: WalletOption | null;
  allocations: Allocation[];
  allocationsLoading: boolean;
  /** Set when the last allocation load failed (RPC error) — distinct from "no allocations". */
  allocationsError: string | null;
  /** Contract's presaleActive() flag; null until read (or if the read failed). */
  presaleActive: boolean | null;
  /** Connect to a specific wallet; with no id, the first (preferred) wallet is used. Always prompts if needed. */
  connectWallet: (walletId?: string) => Promise<void>;
  /** Ask the connected wallet to show its account picker. */
  switchAccount: () => Promise<void>;
  /** Stop waiting on a wallet prompt that isn't responding. */
  cancelConnect: () => void;
  disconnectWallet: () => void;
  switchToBase: () => Promise<void>;
  reloadAllocations: () => Promise<void>;
  /**
   * Confirms the connected wallet is on Base *right now* (fresh eth_chainId), for use
   * immediately before simulating or sending a transaction. Throws otherwise.
   */
  assertOnBase: () => Promise<void>;
}

export const BlockchainContext = createContext<BlockchainState | null>(null);

export function useBlockchain(): BlockchainState {
  const ctx = useContext(BlockchainContext);
  if (!ctx) {
    throw new Error("useBlockchain must be used inside <BlockchainProvider>");
  }
  return ctx;
}
