// Import  Component Layout (Navbar and Footer)
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";

// Import Component Sections
import Hero from "./components/sections/Hero";
import WhoWeAre from "./components/sections/WhoWeAre";
import Crypto from "./components/sections/Crypto";
import FAQ from "./components/sections/FAQ";
import CTABanner from "./components/sections/CTABanner";

//  Import React Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Pages for src/pages
import About from "./pages/About";
import KaviPay from "./pages/KaviPay";
import Token from "./pages/TokenPage";
import FAQPage from "./pages/FAQPage";
import OurEcosystem from "./pages/Ecosystem";
import NotFound from "./pages/NotFound";

import { usePageMeta } from "./hooks/usePageMeta";

//  Return Home Component Sections
function Home() {
  usePageMeta(
    "Ploutos Labs – Web3 Payments & Financial Infrastructure",
    "Ploutos Labs is building the future of Web3 payments with KaviPay, digital assets, and financial infrastructure for global users.",
    "/",
  );
  return (
    <>
      <Hero />
      <WhoWeAre />
      <Crypto />
      <FAQ />
      <CTABanner />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/kavipay" element={<KaviPay />} />
        <Route path="/token" element={<Token />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/ecosystem" element={<OurEcosystem />} />

        {/* Anything else lands on the coming-soon page, never a blank shell */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
