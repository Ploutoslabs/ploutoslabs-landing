import OurEcosystem from "../components/sections/OurEcosystem";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Ecosystem() {
  usePageMeta(
    "Our Ecosystem · Ploutos Labs",
    "One ecosystem for buying, selling, swapping, spending, and earning — virtual dollar cards, bill payments, smart wallets, and more.",
    "/ecosystem",
  );
  return (
    <main className="shered_components">
      <OurEcosystem />
    </main>
  );
}
