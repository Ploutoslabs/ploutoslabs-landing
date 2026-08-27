import { Outlet } from "react-router-dom";
import DashboardHeader from "../dashboard/DashboardHeader";
import BlockchainProvider from "../dashboard/BlockchainProvider";
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
          <span>PLTL · Base network</span>
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
