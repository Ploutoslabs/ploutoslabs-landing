import { useBlockchain } from "../../hooks/useBlockchain";
import { isClaimable, useNow } from "./vesting";
import { toPltl } from "./format";

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });

/** Real totals from the wallet's allocations, replacing the old hardcoded cards. */
export default function Summary() {
  const { allocations, active, wrongChain } = useBlockchain();
  const ready = active && !wrongChain;
  const now = useNow(15_000);

  let total = 0;
  let claimed = 0;
  let claimable = 0;
  for (const a of allocations) {
    total += toPltl(a.totalAmount);
    claimed += toPltl(a.claimedAmount);
    if (isClaimable(a, now)) claimable += toPltl(a.totalAmount - a.claimedAmount);
  }

  const stats = [
    { label: "Total allocated", value: total, unit: "PLTL" },
    { label: "Claimed so far", value: claimed, unit: "PLTL" },
    { label: "Unlocked now", value: claimable, unit: "PLTL", accent: claimable > 0 },
  ];

  return (
    <div className="dash__summary">
      {stats.map((s) => (
        <div key={s.label} className={`dash__stat ${s.accent ? "dash__stat--accent" : ""}`}>
          <span className="dash__stat-label">{s.label}</span>
          <span className="dash__stat-value">
            {ready ? fmt(s.value) : "—"} <small>{s.unit}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
