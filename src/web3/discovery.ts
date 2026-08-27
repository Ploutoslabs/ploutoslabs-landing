import type { Eip6963ProviderDetail, InjectedProvider } from "../types/ethereum";

export interface WalletOption {
  id: string;
  name: string;
  icon?: string;
  provider: InjectedProvider;
}

/** Order of preference when we have to auto-pick without asking. */
const PREFERRED = ["io.metamask", "com.coinbase.wallet", "io.rabby", "app.phantom"];

const LEGACY_ID = "legacy:window.ethereum";

function legacyName(p: InjectedProvider): string {
  if (p.isRabby) return "Rabby";
  if (p.isPhantom) return "Phantom";
  if (p.isCoinbaseWallet) return "Coinbase Wallet";
  if (p.isBraveWallet) return "Brave Wallet";
  if (p.isMetaMask) return "MetaMask";
  return "Browser wallet";
}

/**
 * Listen for EIP-6963 announcements and hand back a de-duplicated, stable list.
 * Falls back to the legacy window.ethereum object when nothing announces.
 */
export function discoverWallets(onChange: (wallets: WalletOption[]) => void): () => void {
  const found = new Map<string, WalletOption>();

  const emit = () => {
    const list = [...found.values()];
    if (list.length === 0 && window.ethereum) {
      list.push({ id: LEGACY_ID, name: legacyName(window.ethereum), provider: window.ethereum });
    }
    onChange(sortPreferred(list));
  };

  const onAnnounce = (event: CustomEvent<Eip6963ProviderDetail>) => {
    const { info, provider } = event.detail;
    if (!info?.uuid || !provider) return;
    // Some wallets announce more than once; key on rdns so we show each wallet once.
    found.set(info.rdns || info.uuid, { id: info.rdns || info.uuid, name: info.name, icon: info.icon, provider });
    emit();
  };

  window.addEventListener("eip6963:announceProvider", onAnnounce);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  emit();

  return () => window.removeEventListener("eip6963:announceProvider", onAnnounce);
}

function sortPreferred(list: WalletOption[]): WalletOption[] {
  const rank = (w: WalletOption) => {
    const i = PREFERRED.indexOf(w.id);
    return i === -1 ? PREFERRED.length : i;
  };
  return [...list].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}
