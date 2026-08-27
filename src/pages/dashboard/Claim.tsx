import AllocationLedger from "../../components/dashboard/AllocationLedger";
import Summary from "../../components/dashboard/Summary";
import { usePageMeta } from "../../hooks/usePageMeta";

export default function ClaimAirdrop() {
  usePageMeta(
    "Claim $PLTL – Ploutos Labs",
    "Claim your unlocked $PLTL allocations on Base.",
    "/dashboard/claim",
  );

  return (
    <>
      <div className="dash__intro">
        <span className="dash__eyebrow">
          <span className="dash__eyebrow-dot" />
          Claim
        </span>
        <h1 className="dash__title">
          What's <span className="dash__title-accent">unlocked</span>
        </h1>
        <p className="dash__lead">
          Batches marked <strong>Unlocked</strong> can be claimed now. Locked ones show exactly when they open.
        </p>
      </div>

      <Summary />

      <section className="dash__panel" aria-labelledby="claim-ledger-title">
        <div className="dash__panel-head">
          <h2 id="claim-ledger-title" className="dash__panel-title">Vesting ledger</h2>
        </div>
        <AllocationLedger />
      </section>
    </>
  );
}
