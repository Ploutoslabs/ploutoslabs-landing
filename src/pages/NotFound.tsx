import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./NotFound.css";

/**
 * Catch-all route. Anything that isn't a real page lands here instead of
 * rendering an empty shell between the navbar and footer.
 */
export default function NotFound() {
  return (
    <main className="shered_components">
      <section className="nf">
        <div className="nf__bg">
          <div className="nf__glow" />
        </div>

        <div className="container nf__inner">
          <div className="nf__badge">
            <span className="nf__badge-dot" />
            Coming soon
          </div>

          <h1 className="nf__title">
            This page isn't
            <br />
            <span className="nf__title-accent">live yet</span>
          </h1>

          <p className="nf__sub">
            We're still building this part of PloutosLabs. In the meantime,
            everything else is ready for you below.
          </p>

          <div className="nf__actions">
            <Link to="/" className="btn btn--primary btn--lg">
              Back to Home
              <ArrowRight size={18} />
            </Link>
            <Link to="/ecosystem" className="btn btn--ghost btn--lg">
              Explore the Ecosystem
            </Link>
          </div>

          <div className="nf__links">
            <Link to="/kavipay">KaviPay</Link>
            <span className="nf__links-sep" />
            <Link to="/token">$PLTL Token</Link>
            <span className="nf__links-sep" />
            <Link to="/about">About</Link>
            <span className="nf__links-sep" />
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
