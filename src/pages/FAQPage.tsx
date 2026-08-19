import FAQ from "../components/sections/FAQ";
import { usePageMeta } from "../hooks/usePageMeta";

export default function FAQPage() {
  usePageMeta(
    "FAQ · Ploutos Labs",
    "Answers to common questions about KaviPay cards, crypto and Naira funding, bill payments, KYC, fees, and security.",
    "/faq",
  );
  return (
    <main className="shered_components">
        <FAQ />
    </main>
  );
}
