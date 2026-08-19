import Flagship from "../components/sections/Flagship";
import { usePageMeta } from "../hooks/usePageMeta";

export default function KaviPay() {
  usePageMeta(
    "KaviPay Card · Ploutos Labs",
    "KaviPay is your crypto-powered card — virtual and physical. Fund with crypto or Naira, pay bills, shop online, and spend globally.",
    "/kavipay",
  );
  return (
    <main className="shered_components">
      <Flagship />
    </main>
  );
}
