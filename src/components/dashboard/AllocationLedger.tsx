import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { useBlockchain } from "../../hooks/useBlockchain";
import { countdown, formatPltl, revertReason, txUrl } from "./format";
import { claimableAmount, periodsUnlocked, useNow } from "./vesting";
import { BASE_TX_OVERRIDES } from "../../web3/chain";

type Status = { kind: "pending" | "done" | "error"; index: number; message: string; hash?: string } | null;

export default function AllocationLedger() {
  const {
    contractWriter,
    active,
    noWallet,
    walletStatus,
    wrongChain,
    allocations,
    allocationsLoading,
    allocationsError,
    reloadAllocations,
    connectWallet,
    switchToBase,
    assertOnBase,
  } = useBlockchain();
  // Keyed by allocation index so claims on different rows don't overwrite each other's status.
  const [statuses, setStatuses] = useState<Record<number, Status>>({});
  const setStatus = (st: NonNullable<Status>) => setStatuses((prev) => ({ ...prev, [st.index]: st }));
  const now = useNow();

  const claimAllocation = async (index: number) => {
    if (!contractWriter) return;
    const claim = contractWriter.getFunction("claimAllocation");
    setStatus({ kind: "pending", index, message: "Checking the claim…" });
    try {
      // The chain is re-read from the wallet right now — a React flag can be stale — and the
      // transaction itself carries chainId so the wallet rejects any mismatch. Then simulate:
      // a revert here costs nothing and never reaches the wallet prompt.
      await assertOnBase();
      await claim.staticCall(index, BASE_TX_OVERRIDES);
    } catch (error) {
      console.error("[dashboard] claim preflight reverted", error);
      setStatus({ kind: "error", index, message: `This batch can't be claimed right now: ${revertReason(error)}` });
      return;
    }
    try {
      setStatus({ kind: "pending", index, message: "Confirm the claim in your wallet…" });
      const tx = await claim(index, BASE_TX_OVERRIDES);
      setStatus({ kind: "pending", index, message: "Claim submitted — waiting for Base to confirm…", hash: tx.hash });
      await tx.wait();
      setStatus({ kind: "done", index, message: "Claimed. Your PLTL is in your wallet.", hash: tx.hash });
      await reloadAllocations();
    } catch (error) {
      console.error("[dashboard] claim failed", error);
      setStatus({ kind: "error", index, message: `The claim didn't go through: ${revertReason(error)}` });
    }
  };

  if (active && wrongChain) {
    return (
      <div className="dash__empty">
        <Lock size={22} className="dash__empty-icon" />
        <h3 className="dash__empty-title">Wrong network</h3>
        <p className="dash__empty-text">
          Your wallet is connected, but PLTL lives on Base. Switch networks to load your allocations.
        </p>
        <button type="button" className="btn" onClick={() => void switchToBase()}>
          Switch to Base
        </button>
      </div>
    );
  }

  if (!active) {
    const connecting = walletStatus === "connecting";
    return (
      <div className="dash__empty">
        <Lock size={22} className="dash__empty-icon" />
        <h3 className="dash__empty-title">{noWallet ? "No wallet detected" : "Connect your wallet"}</h3>
        <p className="dash__empty-text">
          {noWallet
            ? "Open this page in a wallet-enabled browser (MetaMask, Coinbase Wallet, Trust) to see and claim your PLTL allocations."
            : "Your allocations are tied to the wallet that received them. Connect it to see what's unlocked."}
        </p>
        {!noWallet && (
          <button type="button" className="btn" onClick={() => void connectWallet()} disabled={connecting}>
            {connecting ? "Waiting for your wallet…" : "Connect wallet"}
          </button>
        )}
      </div>
    );
  }

  if (allocationsError) {
    return (
      <div className="dash__empty">
        <h3 className="dash__empty-title">Couldn't load your allocations</h3>
        <p className="dash__empty-text">{allocationsError}</p>
        <button type="button" className="btn" onClick={() => void reloadAllocations()} disabled={allocationsLoading}>
          {allocationsLoading ? "Loading…" : "Try again"}
        </button>
      </div>
    );
  }

  if (allocationsLoading && allocations.length === 0) {
    return (
      <div className="dash__ledger" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="dash__row dash__row--skeleton" />
        ))}
      </div>
    );
  }

  if (allocations.length === 0) {
    return (
      <div className="dash__empty">
        <h3 className="dash__empty-title">No allocations on this wallet yet</h3>
        <p className="dash__empty-text">
          Allocations appear here once PLTL has been assigned to your address — from the presale or an airdrop.
        </p>
      </div>
    );
  }

  return (
    <div className="dash__ledger">
      <div className="dash__ledger-head" aria-hidden="true">
        <span>Allocation</span>
        <span>Progress</span>
        <span>Next unlock</span>
        <span />
      </div>

      {allocations.map((a, i) => {
        // Percentages in bigint so amounts beyond 2^53 raw units stay exact.
        const pct = a.totalAmount > 0n ? Number((a.claimedAmount * 10_000n) / a.totalAmount) / 100 : 0;
        const fullyClaimed = a.totalAmount > 0n && a.claimedAmount >= a.totalAmount;
        const claimableRaw = claimableAmount(a, now);
        const claimable = claimableRaw > 0n;
        const periods = Math.min(100, periodsUnlocked(a, now));
        const left = countdown(Number(a.nextClaimTime) * 1000, now);
        const rowStatus = statuses[a.index] ?? null;

        return (
          <div
            key={a.index}
            className={[
              "dash__row",
              claimable ? "dash__row--claimable" : "",
              fullyClaimed ? "dash__row--done" : "",
            ].join(" ")}
            style={{ "--delay": `${i * 70}ms` } as React.CSSProperties}>
            <div className="dash__row-id">
              <span className="dash__row-num">#{String(a.index + 1).padStart(2, "0")}</span>
              <span className="dash__row-total">
                {formatPltl(a.totalAmount)} <small>PLTL</small>
              </span>
            </div>

            <div className="dash__row-progress">
              <div className="dash__track" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
                <div className="dash__track-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="dash__row-claimed">
                {formatPltl(a.claimedAmount)} claimed · {Math.round(pct)}%
              </span>
            </div>

            <div className="dash__row-next">
              {fullyClaimed ? (
                <span className="dash__chip dash__chip--done">Fully claimed</span>
              ) : claimable ? (
                <span className="dash__chip dash__chip--now" title={`${periods} of 100 monthly releases available`}>
                  <Unlock size={13} /> {periods}% unlocked
                </span>
              ) : (
                <span className="dash__chip">
                  <Lock size={13} /> {left}
                </span>
              )}
            </div>

            <div className="dash__row-action">
              {claimable && (
                <button
                  type="button"
                  className="dash__claim"
                  disabled={rowStatus?.kind === "pending"}
                  onClick={() => claimAllocation(a.index)}>
                  {rowStatus?.kind === "pending" ? "Claiming…" : `Claim ${formatPltl(claimableRaw)}`}
                </button>
              )}
            </div>

            {rowStatus && (
              <p className={`dash__row-status dash__row-status--${rowStatus.kind}`} role="status">
                {rowStatus.message}
                {rowStatus.hash && (
                  <>
                    {" "}
                    <a href={txUrl(rowStatus.hash)} target="_blank" rel="noopener noreferrer">
                      View on Basescan
                    </a>
                  </>
                )}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
