import TokenSection from "../components/sections/Token";
import { usePageMeta } from "../hooks/usePageMeta";

export default function TokenPage() {
  usePageMeta(
    "$PLTL Token · Ploutos Labs",
    "$PLTL is PloutosLabs' native utility token on the BASE network — limited supply released gradually over 8 years, built for real-world spending.",
    "/token",
  );
  return (
    <main className="shered_components">
      <TokenSection />
    </main>
  );
}
