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

import { lazy, Suspense } from "react";

//  Import React Router
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Import Pages for src/pages
import About from "./pages/About";
import KaviPay from "./pages/KaviPay";
import Token from "./pages/TokenPage";
import FAQPage from "./pages/FAQPage";
import OurEcosystem from "./pages/Ecosystem";
import NotFound from "./pages/NotFound";

// The wallet dashboard pulls in ethers, so it is code-split away from the marketing pages.
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const ClaimAirdrop = lazy(() => import("./pages/dashboard/Claim"));

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

function Shell() {
  // The token dashboard ships its own header, like the original standalone app.
  const { pathname } = useLocation();
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  return (
    <>
      <ScrollToTop />
      {!isDashboard && <Navbar />}

      <Suspense fallback={<div aria-busy="true" style={{ minHeight: "60vh" }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/kavipay" element={<KaviPay />} />
          <Route path="/token" element={<Token />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/ecosystem" element={<OurEcosystem />} />

          {/* $PLTL presale + allocation claiming (wallet-connected) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="claim" element={<ClaimAirdrop />} />
          </Route>

          {/* Anything else lands on the coming-soon page, never a blank shell */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!isDashboard && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
