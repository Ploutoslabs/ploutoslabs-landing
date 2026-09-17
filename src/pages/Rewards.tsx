import { Check, LineChart, Coins, Crown } from "lucide-react";
import { usePageMeta } from "../hooks/usePageMeta";
import "./Rewards.css";

const UPGRADE_URL = "https://app.kavipay.io/account/status";

type Tier = {
  name: string;
  price: string;
  weight: number;
  featured?: boolean;
  perks: string[];
};

const tiers: Tier[] = [
  {
    name: "Essential",
    price: "$10",
    weight: 1,
    perks: [
      "Access to Caifu at launch",
      "Ploutos Rewards member — 1× weighting",
      "Paid once, never expires",
    ],
  },
  {
    name: "Plus",
    price: "$30",
    weight: 2,
    perks: [
      "Everything in Essential",
      "2× Ploutos Rewards weighting",
      "Priority support",
      "Paid once, never expires",
    ],
  },
  {
    name: "Premium",
    price: "$50",
    weight: 5,
    featured: true,
    perks: [
      "Everything in Plus",
      "5× Ploutos Rewards weighting — the largest share",
      "Founding member of the Ploutos community",
      "Paid once, never expires",
    ],
  },
];

const faqs = [
  {
    q: "Is this a subscription?",
    a: "No. Status is a one-off payment. It never expires and there is nothing to renew.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes. Moving up only charges the difference — going from Essential to Premium costs $40, not $50.",
  },
  {
    q: "When is my weighting counted?",
    a: "Each distribution uses the status you hold when it is calculated. Upgrading before then raises your share of that distribution.",
  },
  {
    q: "Where do I buy status?",
    a: "In the KaviPay web app under Account status. It can be paid from your dollar or naira wallet.",
  },
];

export default function Rewards() {
  usePageMeta(
    "KaviPay Status & Ploutos Rewards · Ploutos Labs",
    "KaviPay account status unlocks Caifu access and a weighted share of Ploutos Rewards, paid in $PLTL. One-off payment, never expires.",
    "/rewards",
  );

  return (
    <main className="shered_components rewards">
      <div className="rewards__bg" aria-hidden="true">
        <div className="rewards__glow rewards__glow--1" />
        <div className="rewards__glow rewards__glow--2" />
      </div>

      <section className="container rewards__hero">
        <span className="rewards__eyebrow">KaviPay Status</span>
        <h1 className="rewards__headline">
          Own a share of <span className="rewards__accent">Ploutos Rewards</span>
        </h1>
        <p className="rewards__lede">
          KaviPay account status is your ticket into the Ploutos ecosystem. Every status holder
          gets access to Caifu at launch and a share of the Ploutos Rewards pool, paid in $PLTL.
          The higher your status, the bigger your share.
        </p>
        <a className="rewards__cta" href={UPGRADE_URL} target="_blank" rel="noopener noreferrer">
          Upgrade on KaviPay
        </a>
      </section>

      <section className="container rewards__pillars">
        <article className="rewards__pillar">
          <Coins className="rewards__pillar-icon" size={22} aria-hidden="true" />
          <h2>Ploutos Rewards</h2>
          <p>
            A pool of $PLTL shared between status holders. Your status sets your weighting:
            Essential 1×, Plus 2×, Premium 5×.
          </p>
        </article>
        <article className="rewards__pillar">
          <LineChart className="rewards__pillar-icon" size={22} aria-hidden="true" />
          <h2>Caifu access</h2>
          <p>
            Caifu is the Ploutos Labs trading platform. Every status holder — Essential, Plus or
            Premium — gets in when it launches.
          </p>
        </article>
        <article className="rewards__pillar">
          <Crown className="rewards__pillar-icon" size={22} aria-hidden="true" />
          <h2>Pay once</h2>
          <p>
            No subscription, no renewal, no expiry. Move up any time and pay only the difference.
          </p>
        </article>
      </section>

      <section className="container rewards__tiers" aria-label="Status levels">
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className={`rewards__tier${tier.featured ? " rewards__tier--featured" : ""}`}
          >
            {tier.featured && <span className="rewards__badge">Largest share</span>}
            <h3 className="rewards__tier-name">{tier.name}</h3>
            <p className="rewards__tier-price">
              {tier.price}
              <span> one-off</span>
            </p>
            <p className="rewards__tier-weight">{tier.weight}× rewards weighting</p>
            <ul className="rewards__perks">
              {tier.perks.map((perk) => (
                <li key={perk}>
                  <Check size={16} aria-hidden="true" />
                  {perk}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="container rewards__faq">
        <h2>Questions</h2>
        {faqs.map((item) => (
          <details key={item.q} className="rewards__faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <section className="container rewards__closing">
        <h2>Get your status</h2>
        <p>Sign in to KaviPay, open Account status, and pick your level.</p>
        <a className="rewards__cta" href={UPGRADE_URL} target="_blank" rel="noopener noreferrer">
          Upgrade on KaviPay
        </a>
        <p className="rewards__disclaimer">
          $PLTL is a utility token for the Ploutos ecosystem. Ploutos Rewards are a loyalty
          programme, not an investment, and nothing on this page is financial advice. Token
          value can go down as well as up and may fall to zero. Programme terms, pool size and
          Caifu launch timing may change, and the programme is not available where prohibited
          by law.
        </p>
      </section>
    </main>
  );
}
