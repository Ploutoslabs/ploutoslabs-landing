import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BrowserProvider, Contract } from "ethers";
import abi from "../../web3/abi";
import { PLTL } from "../../web3/contracts";
import { BASE_CHAIN_ID, BASE_CHAIN_ID_HEX, BASE_CHAIN_PARAMS, WrongChainError, isBaseChainId } from "../../web3/chain";
import { discoverWallets, type WalletOption } from "../../web3/discovery";
import {
  BlockchainContext,
  type Allocation,
  type BlockchainState,
  type WalletStatus,
} from "../../hooks/useBlockchain";

/** How long to keep waiting for a wallet extension to announce/inject itself. */
const DETECT_TIMEOUT_MS = 1500;
/** After this long without an answer from the wallet popup, tell the visitor where to look. */
const SLOW_CONNECT_MS = 10_000;
/** Remember which wallet the visitor used so we can restore the session silently. */
const LAST_WALLET_KEY = "pltl.dashboard.wallet";
/** allocationInfo calls per parallel batch when loading a wallet's allocations. */
const ALLOCATION_BATCH = 10;

function describeConnectError(error: unknown, walletName: string): string {
  const e = error as { code?: number | string; message?: string; shortMessage?: string } | undefined;
  if (e?.code === 4001 || e?.code === "ACTION_REJECTED") return `Connection request was dismissed in ${walletName}.`;
  if (e?.code === -32002) return `A connection request is already open — check the ${walletName} extension.`;
  // Surface the wallet's own words: a generic fallback hides the real cause.
  const detail = (e?.shortMessage ?? e?.message ?? "").split("\n")[0].slice(0, 160);
  if (!detail) return `Couldn't connect to ${walletName}. Reload the page and try again.`;
  return `${walletName}: ${detail}${e?.code !== undefined ? ` (code ${String(e.code)})` : ""}`;
}

function rememberWallet(id: string | null) {
  try {
    if (id) localStorage.setItem(LAST_WALLET_KEY, id);
    else localStorage.removeItem(LAST_WALLET_KEY);
  } catch {
    /* storage may be unavailable (private mode) — it's only a convenience */
  }
}

function recallWallet(): string | null {
  try {
    return localStorage.getItem(LAST_WALLET_KEY);
  } catch {
    return null;
  }
}

/**
 * Wallet session + PLTL contract bindings for the dashboard.
 *
 * Wallets are discovered via EIP-6963 announcements (with legacy
 * `window.ethereum` as a fallback) so a page with several extensions installed
 * talks to the one the visitor picks, not whichever won the injection race.
 * Connecting only happens on an explicit click — prompting on mount leaves a
 * pending request that makes later clicks fail. A wallet that already approved
 * this site is restored silently via `eth_accounts`.
 *
 * Every state commit that follows an `await` is guarded by a generation counter
 * so an older bind/connect/load can never overwrite a newer one; the chain is
 * additionally re-checked at transaction time (see `assertOnBase`).
 */
export default function BlockchainProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<WalletOption[]>([]);
  const [detectTimedOut, setDetectTimedOut] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(null);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>("detecting");
  const [connectError, setConnectError] = useState<string | null>(null);
  const [connectHint, setConnectHint] = useState<string | null>(null);
  const [contractWriter, setContractWriter] = useState<Contract>();
  const [contractReader, setContractReader] = useState<Contract>();
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(0n);
  const [wrongChain, setWrongChain] = useState(false);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [allocationsLoading, setAllocationsLoading] = useState(false);
  const [allocationsError, setAllocationsError] = useState<string | null>(null);
  const [presaleActive, setPresaleActive] = useState<boolean | null>(null);

  /** Bumped by every bind/connect/cancel; a stale async path must not commit state. */
  const sessionGen = useRef(0);
  /** Bumped by every allocation load; a stale load must not commit rows. */
  const loadGen = useRef(0);
  /** Mirrors selectedWallet for use inside async code without stale closures. */
  const selectedRef = useRef<WalletOption | null>(null);
  /** Set by an explicit Disconnect so the next Connect always prompts. */
  const disconnectedByUser = useRef(false);

  /**
   * Bind the session to `wallet`/`account`. Returns false if superseded while awaiting.
   * All state commits happen only if this bind is still the newest.
   */
  const bind = useCallback(async (wallet: WalletOption, account: string): Promise<boolean> => {
    const gen = ++sessionGen.current;
    const current = () => sessionGen.current === gen;

    const provider = new BrowserProvider(wallet.provider);
    const network = await provider.getNetwork();
    if (!current()) return false;
    const onBase = network.chainId === BASE_CHAIN_ID;

    const signer = await provider.getSigner(account);
    const signerAddress = await signer.getAddress();
    const bal = await provider.getBalance(signerAddress).catch(() => 0n);
    if (!current()) return false;

    // Commit atomically (React batches these), with the previous wallet's rows cleared
    // so nothing from another account or chain is ever shown under this address.
    selectedRef.current = wallet;
    setSelectedWallet(wallet);
    setWrongChain(!onBase);
    setContractWriter(new Contract(PLTL, abi, signer));
    setContractReader(new Contract(PLTL, abi, provider));
    setWalletAddress(signerAddress);
    setBalance(bal);
    setAllocations([]);
    setAllocationsError(null);
    setWalletStatus("connected");
    setConnectError(null);
    setConnectHint(null);
    rememberWallet(wallet.id);
    return true;
  }, []);

  const clearSession = useCallback((opts: { forget: boolean }) => {
    sessionGen.current++;
    loadGen.current++;
    selectedRef.current = null;
    setSelectedWallet(null);
    setContractWriter(undefined);
    setContractReader(undefined);
    setWalletAddress("");
    setBalance(0n);
    setWrongChain(false);
    setAllocations([]);
    setAllocationsError(null);
    setAllocationsLoading(false);
    setConnectHint(null);
    setWalletStatus((s) => (s === "none" ? "none" : "idle"));
    if (opts.forget) rememberWallet(null);
  }, []);

  const connectWallet = useCallback(
    async (walletId?: string) => {
      const wallet = (walletId ? wallets.find((w) => w.id === walletId) : undefined) ?? wallets[0];
      if (!wallet) {
        setWalletStatus("none");
        setConnectError("No wallet found in this browser.");
        return;
      }
      const gen = ++sessionGen.current;
      const current = () => sessionGen.current === gen;
      const previousStatus = walletStatus;
      setWalletStatus("connecting");
      setConnectError(null);
      setConnectHint(null);

      // MetaMask's eth_requestAccounts can hang forever when its popup is hidden or it is
      // locked and the unlock window was closed — it neither resolves nor rejects. After a
      // while, tell the visitor where to look instead of spinning silently.
      const slowTimer = window.setTimeout(() => {
        if (current()) {
          setConnectHint(
            `${wallet.name} hasn't responded. Click the ${wallet.name} icon in your browser toolbar — the connection request (or the unlock screen) is waiting there.`,
          );
        }
      }, SLOW_CONNECT_MS);

      try {
        // eth_requestAccounts resolves immediately (no popup) when the site is already approved,
        // and prompts otherwise — so an explicit Connect always does the right thing.
        const accounts = (await wallet.provider.request({ method: "eth_requestAccounts" })) as string[];
        if (!current()) return; // cancelled or superseded: ignore this answer
        const account = accounts[0];
        if (!account) throw new Error("No account returned");
        disconnectedByUser.current = false;
        // bind bumps the generation itself; that's fine — nothing after this uses `current()`.
        await bind(wallet, account);
      } catch (error) {
        if (!current()) return;
        console.error(`[dashboard] ${wallet.name} connect failed`, error);
        // A failed re-connect must not strand a still-valid session in "not connected".
        setWalletStatus(previousStatus === "connected" && selectedRef.current ? "connected" : "idle");
        setConnectError(describeConnectError(error, wallet.name));
      } finally {
        window.clearTimeout(slowTimer);
        if (current()) setConnectHint(null);
      }
    },
    [wallets, bind, walletStatus],
  );

  const switchAccount = useCallback(async () => {
    const wallet = selectedRef.current;
    if (!wallet) return;
    try {
      // Forces the wallet's account picker even when the site is already approved.
      await wallet.provider.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
      const accounts = (await wallet.provider.request({ method: "eth_accounts" })) as string[];
      if (accounts[0]) await bind(wallet, accounts[0]);
    } catch (error) {
      const code = (error as { code?: number })?.code;
      if (code !== 4001) console.error("[dashboard] switch account failed", error);
      // Wallets without wallet_requestPermissions: the user can switch inside the extension;
      // accountsChanged keeps us in sync.
    }
  }, [bind]);

  const cancelConnect = useCallback(() => {
    sessionGen.current++; // any late approval from the abandoned request is ignored
    setConnectHint(null);
    setWalletStatus((s) => (s === "connecting" ? (selectedRef.current ? "connected" : "idle") : s));
  }, []);

  const disconnectWallet = useCallback(() => {
    disconnectedByUser.current = true;
    clearSession({ forget: true });
  }, [clearSession]);

  const switchToBase = useCallback(async () => {
    const eth = selectedRef.current?.provider;
    if (!eth) return;
    const switchChain = () =>
      eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: BASE_CHAIN_ID_HEX }] });
    try {
      await switchChain();
    } catch (error) {
      const code = (error as { code?: number })?.code;
      if (code === 4902) {
        // Chain not added to the wallet yet: add it, then switch (adding doesn't always switch).
        try {
          await eth.request({ method: "wallet_addEthereumChain", params: [BASE_CHAIN_PARAMS] });
          await switchChain();
        } catch (addError) {
          if ((addError as { code?: number })?.code !== 4001) console.error("[dashboard] add Base failed", addError);
        }
      } else if (code !== 4001) {
        console.error("[dashboard] switch to Base failed", error);
      }
    }
  }, []);

  const assertOnBase = useCallback(async () => {
    const wallet = selectedRef.current;
    if (!wallet) throw new Error("No wallet connected");
    const chainId = await wallet.provider.request({ method: "eth_chainId" });
    if (!isBaseChainId(chainId)) {
      setWrongChain(true);
      throw new WrongChainError(String(chainId));
    }
  }, []);

  const reloadAllocations = useCallback(async () => {
    if (!contractReader || !walletAddress || wrongChain) return;
    const gen = ++loadGen.current;
    const current = () => loadGen.current === gen;
    setAllocationsLoading(true);
    setAllocationsError(null);
    try {
      const [count, presale] = await Promise.all([
        contractReader.getFunction("allocationLen")(walletAddress).then((n: bigint) => Number(n)),
        contractReader
          .getFunction("presaleActive")()
          .then((v: boolean) => Boolean(v))
          .catch(() => null),
      ]);
      const rows: Allocation[] = [];
      for (let start = 0; start < count; start += ALLOCATION_BATCH) {
        const indexes = Array.from({ length: Math.min(ALLOCATION_BATCH, count - start) }, (_, k) => start + k);
        const infos = await Promise.all(indexes.map((i) => contractReader.getFunction("allocationInfo")(walletAddress, i)));
        if (!current()) return;
        infos.forEach((info, k) => {
          rows.push({
            index: indexes[k],
            totalAmount: info[0] as bigint,
            claimedAmount: info[1] as bigint,
            nextClaimTime: info[2] as bigint,
          });
        });
      }
      if (!current()) return;
      setPresaleActive(presale);
      setAllocations(rows);
    } catch (error) {
      if (!current()) return;
      console.error("[dashboard] loading allocations failed", error);
      setAllocationsError("Couldn't load your allocations from Base. Check your connection and try again.");
    } finally {
      if (current()) setAllocationsLoading(false);
    }
  }, [contractReader, walletAddress, wrongChain]);

  // 1. Discover wallets (EIP-6963 + legacy). Give extensions a moment to announce before declaring "none".
  useEffect(() => {
    const stop = discoverWallets(setWallets);
    const timeout = window.setTimeout(() => {
      setDetectTimedOut(true);
      setWalletStatus((s) => (s === "detecting" ? "none" : s));
    }, DETECT_TIMEOUT_MS);
    return () => {
      stop();
      window.clearTimeout(timeout);
    };
  }, []);

  // 2. Once wallets appear, leave "detecting". Silently restore a previously-approved session:
  //    the remembered wallet as soon as it announces; a lone wallet only once discovery has settled
  //    (announcement order is arbitrary, so "the only wallet so far" isn't "the only wallet").
  //    Idempotent, so React StrictMode's double invoke and re-runs on each announcement are harmless.
  useEffect(() => {
    if (wallets.length === 0) return;
    setWalletStatus((s) => (s === "detecting" || s === "none" ? "idle" : s));
    if (selectedRef.current || disconnectedByUser.current) return;

    const remembered = recallWallet();
    const wallet =
      wallets.find((w) => w.id === remembered) ?? (detectTimedOut && wallets.length === 1 ? wallets[0] : undefined);
    if (!wallet) return;

    let cancelled = false;
    (async () => {
      try {
        const accounts = (await wallet.provider.request({ method: "eth_accounts" })) as string[];
        if (cancelled || selectedRef.current || !accounts[0]) return;
        await bind(wallet, accounts[0]);
      } catch (error) {
        console.error("[dashboard] session restore failed", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [wallets, detectTimedOut, bind]);

  // 3. Follow the connected wallet: account switches, chain switches, disconnects.
  useEffect(() => {
    const wallet = selectedWallet;
    const eth = wallet?.provider;
    if (!wallet || !eth?.on || !eth.removeListener) return;

    const onAccounts = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts[0]) void bind(wallet, accounts[0]);
      else clearSession({ forget: true });
    };
    const onChain = () => {
      if (walletAddress) void bind(wallet, walletAddress);
    };
    // MetaMask also emits `disconnect` on RPC connectivity loss, not only on user action —
    // drop the session but keep the remembered wallet so the next visit restores it.
    const onDisconnect = () => clearSession({ forget: false });

    eth.on("accountsChanged", onAccounts);
    eth.on("chainChanged", onChain);
    eth.on("disconnect", onDisconnect);
    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
      eth.removeListener?.("disconnect", onDisconnect);
    };
  }, [selectedWallet, bind, clearSession, walletAddress]);

  // 4. Load allocations whenever the bound account/chain changes. Each call bumps loadGen, and
  //    bind/clearSession bump it too, so a superseded load never commits its rows.
  useEffect(() => {
    if (walletStatus === "connected") void reloadAllocations();
  }, [walletStatus, reloadAllocations]);

  const active = walletStatus === "connected";
  const noWallet = walletStatus === "none";

  const value = useMemo<BlockchainState>(
    () => ({
      contractWriter,
      contractReader,
      walletAddress,
      balance,
      active,
      noWallet,
      walletStatus,
      connectError,
      connectHint,
      wrongChain,
      wallets,
      selectedWallet,
      allocations,
      allocationsLoading,
      allocationsError,
      presaleActive,
      connectWallet,
      switchAccount,
      cancelConnect,
      disconnectWallet,
      switchToBase,
      reloadAllocations,
      assertOnBase,
    }),
    [
      contractWriter,
      contractReader,
      walletAddress,
      balance,
      active,
      noWallet,
      walletStatus,
      connectError,
      connectHint,
      wrongChain,
      wallets,
      selectedWallet,
      allocations,
      allocationsLoading,
      allocationsError,
      presaleActive,
      connectWallet,
      switchAccount,
      cancelConnect,
      disconnectWallet,
      switchToBase,
      reloadAllocations,
      assertOnBase,
    ],
  );

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>;
}
