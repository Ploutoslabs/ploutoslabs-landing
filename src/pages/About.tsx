import WhoWeAre from "../components/sections/WhoWeAre";
import MissionStatement from "../components/sections/MissionStatement";
import CorePrinciples from "../components/sections/CorePrinciples";
import { usePageMeta } from "../hooks/usePageMeta";

export default function About() {
  usePageMeta(
    "About Us · Ploutos Labs",
    "PloutosLabs is a crypto fintech company bridging digital assets and real-world financial utility — from the $PLTL token to the KaviPay card.",
    "/about",
  );
  return (
    <main className="shered_components">
      <WhoWeAre />
      <MissionStatement />
      <CorePrinciples />
    </main>
  );
}
