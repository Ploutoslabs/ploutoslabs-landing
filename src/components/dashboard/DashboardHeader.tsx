import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AlertTriangle, ChevronDown, LogOut, Wallet } from "lucide-react";
import Logo from "../../assets/logo.png";
import { useBlockchain } from "../../hooks/useBlockchain";
import { shortAddress } from "./format";
import WalletPicker from "./WalletPicker";

export default function DashboardHeader() {
  const {
    walletAddress,
    walletStatus,
    connectError,
    connectHint,
    wrongChain,
    wallets,
    selectedWallet,
    connectWallet,
    cancelConnect,
    disconnectWallet,
    switchToBase,
  } = useBlockchain();
  const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const connecting = walletStatus === "connecting";
  const connectLabel = connecting ? "Connecting…" : walletStatus === "none" ? "Get a wallet" : "Connect wallet";

  // Without an injected wallet the button becomes a link to install one, rather than a dead control.
  // With several wallets installed we ask which one, instead of guessing.
  const handleConnect = () => {
    // A click while "Connecting…" means the prompt isn't showing — stop waiting so they can retry.
    if (connecting) {
      cancelConnect();
      return;
    }
    if (walletStatus === "none") {
      window.open("https://metamask.io/download/", "_blank", "noopener,noreferrer");
      return;
    }
    if (wallets.length > 1) {
      setPickerOpen(true);
      return;
    }
    void connectWallet();
  };

  const pickWallet = (id: string) => {
    setPickerOpen(false);
    void connectWallet(id);
  };

  return (
    <header className="dash__header">
      <div className="dash__header-inner">
        <Link to="/" className="dash__logo" aria-label="Ploutoslabs home">
          <img src={Logo} alt="Ploutoslabs" />
        </Link>

        <nav className="dash__nav" aria-label="Dashboard">
          <NavLink to="/dashboard" end className="dash__nav-link">
            Overview
          </NavLink>
          <NavLink to="/dashboard/claim" className="dash__nav-link">
            Claim
          </NavLink>
        </nav>

        <div className="dash__header-right">
          {walletAddress && wrongChain ? (
            <button type="button" className="dash__network dash__network--wrong" onClick={() => void switchToBase()}>
              <AlertTriangle size={13} />
              Switch to Base
            </button>
          ) : (
            <span className="dash__network" title="PLTL lives on the Base network">
              <span className="dash__network-dot" />
              Base
            </span>
          )}

          {walletAddress ? (
            <div className="dash__wallet" ref={menuRef}>
              <button
                type="button"
                className="dash__wallet-btn"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}>
                <Wallet size={16} />
                <span>{shortAddress(walletAddress)}</span>
                <ChevronDown size={14} className={open ? "dash__chevron dash__chevron--open" : "dash__chevron"} />
              </button>
              {open && (
                <div className="dash__menu" role="menu">
                  {selectedWallet && <div className="dash__menu-label">{selectedWallet.name}</div>}
                  <button
                    type="button"
                    role="menuitem"
                    className="dash__menu-item"
                    onClick={() => {
                      setOpen(false);
                      void connectWallet(selectedWallet?.id);
                    }}>
                    <Wallet size={15} /> Switch account
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="dash__menu-item"
                    onClick={() => {
                      setOpen(false);
                      disconnectWallet();
                    }}>
                    <LogOut size={15} /> Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="btn dash__connect"
              onClick={handleConnect}
              aria-busy={connecting}
              disabled={walletStatus === "detecting"}>
              <Wallet size={16} />
              <span className="dash__connect-long">{connectLabel}</span>
              <span className="dash__connect-short">{connecting ? "…" : "Connect"}</span>
            </button>
          )}
        </div>
      </div>

      {connecting && connectHint && (
        <div className="dash__notice dash__notice--hint" role="status">
          <AlertTriangle size={14} />
          <span>{connectHint}</span>
          <button type="button" className="dash__notice-action" onClick={cancelConnect}>
            Cancel
          </button>
        </div>
      )}

      {connectError && (
        <div className="dash__notice" role="alert">
          <AlertTriangle size={14} />
          <span>{connectError}</span>
          {wallets.length > 1 && (
            <button type="button" className="dash__notice-action" onClick={() => setPickerOpen(true)}>
              Try another wallet
            </button>
          )}
        </div>
      )}

      {pickerOpen && <WalletPicker wallets={wallets} onPick={pickWallet} onClose={() => setPickerOpen(false)} />}
    </header>
  );
}
