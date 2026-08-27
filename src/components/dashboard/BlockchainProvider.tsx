import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BrowserProvider, Contract } from "ethers";
import abi from "../../web3/abi";
import { PLTL } from "../../web3/contracts";
import { BASE_CHAIN_ID, BASE_CHAIN_ID_HEX, BASE_CHAIN_PARAMS } from "../../web3/chain";
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
 */
export default function BlockchainProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<WalletOption[]>([]);
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
  const [presaleActive, setPresaleActive] = useState<boolean | null>(null);
  /** Increments per attempt so a stale (cancelled) request can't clobber newer state. */
  const attemptRef = useRef(0);
  const restoredRef = useRef(false);

  const bind = useCallback(async (wallet: WalletOption, account: string) => {
    const provider = new BrowserProvider(wallet.provider);
    const network = await provider.getNetwork();
    setWrongChain(network.chainId !== BASE_CHAIN_ID);

    // getSigner(address) re-checks eth_accounts and throws "invalid account" if a wallet
    // reports the address differently (case, ordering) — fall back to the default signer.
    const signer = await provider.getSigner(account).catch(() => provider.getSigner());
    const signerAddress = await signer.getAddress();
    setContractWriter(new Contract(PLTL, abi, signer));
    setContractReader(new Contract(PLTL, abi, provider));
    setWalletAddress(signerAddress);
    // Balance is informational only; never let it block the session.
    setBalance(await provider.getBalance(signerAddress).catch(() => 0n));
    setSelectedWallet(wallet);
    setWalletStatus("connected");
    setConnectError(null);
    setConnectHint(null);
    rememberWallet(wallet.id);
  }, []);

  const clearSession = useCallback(() => {
    setContractWriter(undefined);
    setContractReader(undefined);
    setWalletAddress("");
    setBalance(0n);
    setWrongChain(false);
    setAllocations([]);
    setSelectedWallet(null);
    setWalletStatus((s) => (s === "none" ? "none" : "idle"));
    rememberWallet(null);
  }, []);

  const connectWallet = useCallback(
    async (walletId?: string) => {
      const wallet = (walletId ? wallets.find((w) => w.id === walletId) : undefined) ?? wallets[0];
      if (!wallet) {
        setWalletStatus("none");
        setConnectError("No wallet found in this browser.");
        return;
      }
      const attempt = ++attemptRef.current;
      const isCurrent = () => attemptRef.current === attempt;
      setWalletStatus("connecting");
      setConnectError(null);
      setConnectHint(null);

      // MetaMask's eth_requestAccounts can hang forever when its popup is hidden or it is
      // locked and the unlock window was closed — it neither resolves nor rejects. After a
      // while, tell the visitor where to look instead of spinning silently.
      const slowTimer = window.setTimeout(() => {
        if (isCurrent()) {
          setConnectHint(
            `${wallet.name} hasn't responded. Click the ${wallet.name} icon in your browser toolbar — the connection request (or the unlock screen) is waiting there.`,
          );
        }
      }, SLOW_CONNECT_MS);

      try {
        // Fast path: if this site is already approved, skip the popup entirely.
        let accounts = ((await wallet.provider.request({ method: "eth_accounts" }).catch(() => [])) as string[]) ?? [];
        if (accounts.length === 0) {
          accounts = (await wallet.provider.request({ method: "eth_requestAccounts" })) as string[];
        }
        const account = accounts[0];
        if (!account) throw new Error("No account returned");
        // Even if the visitor cancelled the wait, a late approval is still a valid session.
        await bind(wallet, account);
      } catch (error) {
        if (!isCurrent()) return;
        console.error(`[dashboard] ${wallet.name} connect failed`, error);
        setWalletStatus("idle");
        setConnectError(describeConnectError(error, wallet.name));
      } finally {
        window.clearTimeout(slowTimer);
        if (isCurrent()) setConnectHint(null);
      }
    },
    [wallets, bind],
  );

  const cancelConnect = useCallback(() => {
    attemptRef.current++;
    setConnectHint(null);
    setWalletStatus((s) => (s === "connecting" ? "idle" : s));
  }, []);

  const disconnectWallet = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const switchToBase = useCallback(async () => {
    const eth = selectedWallet?.provider;
    if (!eth) return;
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: BASE_CHAIN_ID_HEX }] });
    } catch (error) {
      // 4902: chain not added to the wallet yet
      if ((error as { code?: number })?.code === 4902) {
        await eth.request({ method: "wallet_addEthereumChain", params: [BASE_CHAIN_PARAMS] }).catch(console.log);
      } else {
        console.log(error);
      }
    }
  }, [selectedWallet]);

  const reloadAllocations = useCallback(async () => {
    if (!contractReader || !walletAddress || wrongChain) return;
    setAllocationsLoading(true);
    try {
      contractReader
        .getFunction("presaleActive")()
        .then((v: boolean) => setPresaleActive(Boolean(v)))
        .catch(() => setPresaleActive(null));
      const count = Number(await contractReader.getFunction("allocationLen")(walletAddress));
      const rows: Allocation[] = [];
      for (let i = 0; i < count; i++) {
        const info = await contractReader.getFunction("allocationInfo")(walletAddress, i);
        rows.push({
          index: i,
          totalAmount: info[0] as bigint,
          claimedAmount: info[1] as bigint,
          nextClaimTime: info[2] as bigint,
        });
      }
      setAllocations(rows);
    } catch (error) {
      console.log(error);
    } finally {
      setAllocationsLoading(false);
    }
  }, [contractReader, walletAddress, wrongChain]);

  // 1. Discover wallets (EIP-6963 + legacy). Give extensions a moment to announce before declaring "none".
  useEffect(() => {
    const stop = discoverWallets(setWallets);
    const timeout = window.setTimeout(() => {
      setWalletStatus((s) => (s === "detecting" ? "none" : s));
    }, DETECT_TIMEOUT_MS);
    return () => {
      stop();
      window.clearTimeout(timeout);
    };
  }, []);

  // 2. Once wallets appear: leave "detecting", and silently restore a previously-approved session.
  useEffect(() => {
    if (wallets.length === 0) return;
    setWalletStatus((s) => (s === "detecting" || s === "none" ? "idle" : s));

    if (restoredRef.current) return;
    restoredRef.current = true;
    const remembered = recallWallet();
    const wallet = wallets.find((w) => w.id === remembered) ?? (wallets.length === 1 ? wallets[0] : undefined);
    if (!wallet) return;

    let cancelled = false;
    (async () => {
      try {
        const accounts = (await wallet.provider.request({ method: "eth_accounts" })) as string[];
        if (!cancelled && accounts[0]) await bind(wallet, accounts[0]);
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [wallets, bind]);

  // 3. Follow the connected wallet: account switches, chain switches, disconnects.
  useEffect(() => {
    const wallet = selectedWallet;
    const eth = wallet?.provider;
    if (!wallet || !eth?.on || !eth.removeListener) return;

    const onAccounts = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts[0]) void bind(wallet, accounts[0]);
      else clearSession();
    };
    const onChain = () => {
      if (walletAddress) void bind(wallet, walletAddress);
    };
    const onDisconnect = () => clearSession();

    eth.on("accountsChanged", onAccounts);
    eth.on("chainChanged", onChain);
    eth.on("disconnect", onDisconnect);
    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
      eth.removeListener?.("disconnect", onDisconnect);
    };
  }, [selectedWallet, bind, clearSession, walletAddress]);

  // 4. Load allocations whenever the bound account/chain changes.
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
      presaleActive,
      connectWallet,
      cancelConnect,
      disconnectWallet,
      switchToBase,
      reloadAllocations,
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
      presaleActive,
      connectWallet,
      cancelConnect,
      disconnectWallet,
      switchToBase,
      reloadAllocations,
    ],
  );

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>;
}
