import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { WalletOption } from "../../web3/discovery";

interface Props {
  wallets: WalletOption[];
  onPick: (id: string) => void;
  onClose: () => void;
}

/**
 * Shown only when more than one wallet extension is installed. Portaled to <body>:
 * the sticky header's backdrop-filter would otherwise become the containing block
 * for this fixed overlay and pin it to the header.
 */
export default function WalletPicker({ wallets, onPick, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="dash__picker-backdrop" onClick={onClose}>
      <div
        className="dash__picker"
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        onClick={(e) => e.stopPropagation()}>
        <div className="dash__picker-head">
          <h2 id="picker-title" className="dash__picker-title">Choose a wallet</h2>
          <button type="button" className="dash__picker-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <p className="dash__picker-sub">
          Several wallet extensions are installed. Pick the one that holds your PLTL allocations.
        </p>
        <div className="dash__picker-list">
          {wallets.map((w) => (
            <button key={w.id} type="button" className="dash__picker-item" onClick={() => onPick(w.id)}>
              {w.icon?.startsWith("data:image/") ? (
                <img src={w.icon} alt="" />
              ) : (
                <span className="dash__picker-fallback" />
              )}
              <span>{w.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
