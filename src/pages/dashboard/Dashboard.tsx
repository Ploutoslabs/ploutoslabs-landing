import AllocationLedger from "../../components/dashboard/AllocationLedger";
import PresalePanel from "../../components/dashboard/PresalePanel";
import Summary from "../../components/dashboard/Summary";
import { usePageMeta } from "../../hooks/usePageMeta";

export default function Dashboard() {
  usePageMeta(
    "$PLTL Dashboard – Ploutos Labs",
    "Buy the $PLTL presale and claim your token allocations on Base.",
    "/dashboard",
  );

  return (
    <>
      <div className="dash__intro">
        <span className="dash__eyebrow">
          <span className="dash__eyebrow-dot" />
          $PLTL holder dashboard
        </span>
        <h1 className="dash__title">
          Your <span className="dash__title-accent">allocations</span>
        </h1>
      </div>

      <Summary />

      <div className="dash__grid">
        <section className="dash__panel" aria-labelledby="ledger-title">
          <div className="dash__panel-head">
            <h2 id="ledger-title" className="dash__panel-title">Vesting ledger</h2>
          </div>
          <AllocationLedger />
        </section>
        <PresalePanel />
      </div>
    </>
  );
}
