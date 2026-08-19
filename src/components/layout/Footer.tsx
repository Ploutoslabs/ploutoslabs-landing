import { Link } from "react-router-dom";
import "./Footer.css";
import BackToTop from "./BackToTop";
import Logo from "../../assets/logo.png";

/**
 * Footer links.
 *  - `to`       → internal route (react-router)
 *  - `href`     → external URL / mailto
 *  - neither    → not built yet, rendered as a "Soon" pill instead of a dead link
 */
const KAVIPAY = "https://www.kavipay.io";

type FooterLink = { label: string; to?: string; href?: string };

const footerLinks: Record<string, FooterLink[]> = {
  Product: [
    { label: "Virtual Cards", to: "/kavipay" },
    { label: "Crypto Funding", to: "/kavipay" },
    { label: "Bill Payments", to: "/kavipay" },
    { label: "Naira Wallet", to: "/ecosystem" },
  ],
  Company: [
    { label: "About Us", to: "/about" },
    { label: "Blog", href: "https://x.com/ploutoslabs" },
    {
      label: "Whitepaper",
      href: "https://ploutoslabs.gitbook.io/ploutos-white-paper",
    },
  ],
  Support: [
    { label: "Help Center", to: "/faq" },
    { label: "Contact Us", href: "mailto:support@kavipay.io" },
    { label: "Community", href: "https://t.me/ploutoslab" },
    {
      label: "Report Fraud",
      href: "mailto:support@kavipay.io?subject=Fraud%20Report",
    },
    { label: "Status Page", href: `${KAVIPAY}/status` },
  ],
  // Legal documents are maintained on kavipay.io — link out rather than
  // duplicating them here. Verified live: /privacy-policy, /terms, /cookies.
  Legal: [
    { label: "Privacy Policy", href: `${KAVIPAY}/privacy-policy` },
    { label: "Terms of Service", href: `${KAVIPAY}/terms` },
    { label: "Cookie Policy", href: `${KAVIPAY}/cookies` },
  ],
};

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (link.to) {
    return (
      <Link to={link.to} className="footer__link">
        {link.label}
      </Link>
    );
  }

  if (link.href) {
    const isExternal = link.href.startsWith("http");
    return (
      <a
        href={link.href}
        className="footer__link"
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {link.label}
      </a>
    );
  }

  return (
    <span className="footer__link footer__link--soon" title="Coming soon">
      {link.label}
      <span className="footer__soon">Soon</span>
    </span>
  );
}

const socials = [
  {
    label: "Twitter / X",
    link: "https://x.com/ploutoslabs",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.849L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    link: "https://www.youtube.com/watch?v=aJ8brnDIORI&list=PLmPCN46454gblPximWmWzHkohyjxZflxX",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Telegram",
    link: "https://t.me/ploutoslab",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div className="footer__brand">
              <Link to="/" className="footer__logo">
                <img
                  src={Logo}
                  alt="Ploutoslabs"
                  className="footer__logo-img"
                />
              </Link>
              <p className="footer__tagline">
                Spend anywhere. Fund with crypto or Naira. Pay bills. The
                financial super-app built for Africa — and the world.
              </p>
              <div className="footer__socials">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.link}
                    className="footer__social"
                    aria-label={s.label}
                    title={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.svg}
                  </a>
                ))}
              </div>
            </div>

            <div className="footer__links">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category} className="footer__col">
                  <h4 className="footer__col-title">{category}</h4>
                  <ul className="footer__col-links">
                    {links.map((link) => (
                      <li key={link.label}>
                        <FooterLinkItem link={link} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="footer__bottom">
            <p className="footer__copyright">
              © {new Date().getFullYear()} Ploutoslabs Technologies Ltd. All
              rights reserved.
            </p>
            <div className="footer__compliance">
              <span className="footer__badge">🔒 256-bit SSL</span>
              <span className="footer__badge">✓ KYC Verified</span>
            </div>
          </div>
        </div>
      </footer>

      <BackToTop />
    </>
  );
}
