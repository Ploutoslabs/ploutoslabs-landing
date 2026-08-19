import React from 'react';
import { CreditCard, Bitcoin, Receipt, Globe, Lock, Zap } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import './Features.css';

const features = [
  {
    icon: CreditCard,
    title: 'Virtual Dollar Card',
    description: 'Get a virtual dollar card instantly — issued on Visa or Mastercard. Use it to pay on any website, app, or service that accepts cards worldwide.',
    color: '#00D16C',
    tag: 'Instant issuance',
  },
  {
    icon: Bitcoin,
    title: 'Fund with Crypto',
    description: 'Load your card using Bitcoin, Ethereum, USDT, BNB, and more. Real-time conversion at the best rates available.',
    color: '#F59E0B',
    tag: 'BTC · ETH · USDT · BNB',
  },
  {
    icon: Receipt,
    title: 'Pay Bills',
    description: 'Pay electricity, cable TV, internet, airtime, and data — all from one dashboard. Schedule recurring payments too.',
    color: '#3B82F6',
    tag: 'Airtime · Data · Cable · Power',
  },
  {
    icon: Globe,
    title: 'Global Acceptance',
    description: 'Spend anywhere Visa and Mastercard are accepted — over 200 countries and millions of merchants online and in-store.',
    color: '#8B5CF6',
    tag: '210+ countries',
  },
  {
    icon: Lock,
    title: 'Bank-Grade Security',
    description: 'End-to-end encryption, two-factor authentication, instant card freeze, and real-time transaction alerts.',
    color: '#EC4899',
    tag: '256-bit encryption',
  },
  {
    icon: Zap,
    title: 'Instant Transactions',
    description: 'Lightning-fast transfers and payments. Fund your card and start spending in under 60 seconds.',
    color: '#00D16C',
    tag: 'Under 60 seconds',
  },
];

export default function Features() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="features" id="features" ref={ref}>
      <div className="container">
        <div className={`section-header ${isVisible ? 'section-header--visible' : ''}`}>
          <div className="section-badge">Everything you need</div>
          <h2 className="section-title">
            One app for all your
            <br />
            <span className="section-title-accent">payment needs</span>
          </h2>
          <p className="section-subtitle">
            From crypto conversions to bill payments, KaviPay is the financial hub built for modern Africans living globally.
          </p>
        </div>

        <div className={`features__grid ${isVisible ? 'features__grid--visible' : ''}`}>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="feature-card"
                style={{ '--feature-color': feature.color, '--delay': `${i * 80}ms` } as React.CSSProperties}
              >
                <div className="feature-card__icon-wrap">
                  <Icon size={22} />
                </div>
                <div className="feature-card__tag">{feature.tag}</div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__desc">{feature.description}</p>
                <div className="feature-card__glow" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}