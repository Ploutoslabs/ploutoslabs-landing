import { Outlet } from "react-router-dom";
import DashboardHeader from "../dashboard/DashboardHeader";
import BlockchainProvider from "../dashboard/BlockchainProvider";
import { PLTL } from "../../web3/contracts";
import { shortAddress } from "../dashboard/format";
import "../dashboard/dashboard.css";

export default function DashboardLayout() {
  return (
    <BlockchainProvider>
      <div className="dash">
        <div className="dash__bg" aria-hidden="true">
          <div className="dash__glow dash__glow--gold" />
          <div className="dash__glow dash__glow--cyan" />
        </div>
        <DashboardHeader />
        <main className="dash__main container">
          <Outlet />
        </main>
        <footer className="dash__footer">
          {/* Always visible so holders can check the contract they're signing for against Basescan. */}
          <a
            href={`https://basescan.org/address/${PLTL}`}
            target="_blank"
            rel="noopener noreferrer"
            title={PLTL}
            className="dash__footer-contract">
            PLTL contract <code>{shortAddress(PLTL)}</code> · Base
          </a>
          <a href="https://ploutoslabs.gitbook.io/ploutos-white-paper" target="_blank" rel="noopener noreferrer">
            Whitepaper
          </a>
          <a href="https://t.me/ploutoslab" target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        </footer>
      </div>
    </BlockchainProvider>
  );
}
