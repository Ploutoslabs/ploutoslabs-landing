import type { Eip1193Provider } from "ethers";

type EthereumEvents = "accountsChanged" | "chainChanged" | "disconnect";

export interface InjectedProvider extends Eip1193Provider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isRabby?: boolean;
  isPhantom?: boolean;
  isBraveWallet?: boolean;
  on?: (event: EthereumEvents, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: EthereumEvents, handler: (...args: unknown[]) => void) => void;
}

/** EIP-6963: wallets announce themselves so dapps don't have to fight over window.ethereum. */
export interface Eip6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface Eip6963ProviderDetail {
  info: Eip6963ProviderInfo;
  provider: InjectedProvider;
}

declare global {
  interface Window {
    ethereum?: InjectedProvider;
  }

  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent<Eip6963ProviderDetail>;
  }
}

export {};
