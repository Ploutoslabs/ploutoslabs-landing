import { useState } from "react";
import { parseEther } from "ethers";
import { useBlockchain } from "../../hooks/useBlockchain";
import { revertReason, txUrl } from "./format";

type Status = { kind: "pending" | "done" | "error"; message: string; hash?: string } | null;

export default function PresalePanel() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const { contractWriter, active, noWallet, wrongChain, presaleActive, reloadAllocations } = useBlockchain();

  const closed = active && !wrongChain && presaleActive === false;
  const disabled = !active || wrongChain || closed || status?.kind === "pending";

  const buyPresale = async () => {
    if (!active || !contractWriter) {
      setStatus({ kind: "error", message: "Connect a wallet first." });
      return;
    }
    const value = Number(amount);
    if (!amount.trim() || isNaN(value) || value <= 0) {
      setStatus({ kind: "error", message: "Enter the ETH amount as a number, e.g. 0.05." });
      return;
    }

    const buy = contractWriter.getFunction("buyPresale");
    const overrides = { value: parseEther(amount) };
    setStatus({ kind: "pending", message: "Checking the purchase…" });
    try {
      // Simulate first: catches "presale closed" / insufficient ETH before the wallet prompt.
      await buy.staticCall(overrides);
    } catch (error) {
      console.error("[dashboard] presale preflight reverted", error);
      setStatus({ kind: "error", message: `The purchase would fail: ${revertReason(error)}` });
      return;
    }
    try {
      setStatus({ kind: "pending", message: "Confirm the purchase in your wallet…" });
      const tx = await buy(overrides);
      setStatus({ kind: "pending", message: "Purchase submitted — waiting for Base to confirm…", hash: tx.hash });
      await tx.wait();
      setStatus({ kind: "done", message: `Done. ${amount} ETH sent — your new allocation is below.`, hash: tx.hash });
      setAmount("");
      await reloadAllocations();
    } catch (error) {
      console.error("[dashboard] presale failed", error);
      setStatus({ kind: "error", message: `The purchase didn't go through: ${revertReason(error)}` });
    }
  };

  return (
    <section className="dash__panel dash__presale" aria-labelledby="presale-title">
      <div className="dash__panel-head">
        <h2 id="presale-title" className="dash__panel-title">Buy presale</h2>
        <p className="dash__panel-sub">Send ETH on Base; PLTL is added to your allocations and unlocks on the release schedule.</p>
      </div>

      <form
        className="dash__presale-form"
        onSubmit={(e) => {
          e.preventDefault();
          void buyPresale();
        }}>
        <label className="dash__field">
          <span className="dash__field-label">Amount</span>
          <span className="dash__field-input">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              disabled={!active || closed}
              aria-describedby="presale-status"
            />
            <span className="dash__field-unit">ETH</span>
          </span>
        </label>
        <button type="submit" className="btn dash__presale-btn" disabled={disabled}>
          {status?.kind === "pending" ? "Confirming…" : closed ? "Presale closed" : "Buy presale"}
        </button>
      </form>

      <p id="presale-status" className={`dash__status ${status ? `dash__status--${status.kind}` : ""}`} role="status">
        {status?.hash && (
          <a href={txUrl(status.hash)} target="_blank" rel="noopener noreferrer" className="dash__status-link">
            View on Basescan
          </a>
        )}
        {status?.message ??
          (noWallet
            ? "Needs a wallet-enabled browser."
            : !active
              ? "Connect a wallet to buy."
              : wrongChain
                ? "Switch your wallet to Base to buy."
                : closed
                  ? "The presale is closed right now. Existing allocations still unlock on schedule."
                  : "")}
      </p>
    </section>
  );
}
