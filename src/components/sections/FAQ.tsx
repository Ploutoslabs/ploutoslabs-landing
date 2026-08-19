import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import './FAQ.css';

const faqs = [
  {
    question: 'How do I fund my KaviPay card with crypto?',
    answer: 'Log in to your KaviPay account, go to "Fund Wallet", and select your preferred cryptocurrency (BTC, ETH, USDT, BNB, etc.). You\'ll receive a unique wallet address. Send crypto to that address and it will be converted to USD and credited to your card balance instantly.',
  },
  {
    question: 'Can I fund with Nigerian Naira (NGN)?',
    answer: 'Yes! You can fund your KaviPay wallet via bank transfer in Naira. The amount will be converted to USD at the current exchange rate and added to your card balance. We support all major Nigerian banks.',
  },
  {
    question: 'What types of bills can I pay on KaviPay?',
    answer: 'You can pay electricity (all DISCOs), cable TV (DSTV, GOtv, Startimes), airtime and data (MTN, Airtel, Glo, 9mobile), internet subscriptions, and school fees — all from within the app.',
  },
  {
    question: 'Is KaviPay safe and secure?',
    answer: 'Absolutely. KaviPay uses 256-bit encryption, two-factor authentication, and real-time fraud monitoring. You can freeze your card instantly from the app if you notice any suspicious activity. Every account is protected by strict KYC verification and AML monitoring.',
  },
  {
    question: 'How long does KYC verification take?',
    answer: 'KYC verification is typically completed within a few minutes. In some cases it may take up to a few hours. You\'ll need a valid government-issued ID (NIN, BVN, International Passport, or Driver\'s License) and a selfie.',
  },
  {
    question: 'Are there any fees for using the virtual card?',
    answer: 'KaviPay offers transparent pricing with no hidden fees. There is a small transaction fee for crypto conversions and a monthly card maintenance fee. Bill payments are free. Full fee schedule is available in the app.',
  },
  {
    question: 'What happens if my card is declined?',
    answer: 'Card declines can happen due to insufficient balance, merchant restrictions, or security flags. Ensure your balance covers the transaction including any foreign transaction fees. You can also contact our 24/7 support team for assistance.',
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
      <button className="faq-item__question" onClick={onToggle}>
        <span>{question}</span>
        <ChevronDown size={18} className="faq-item__chevron" />
      </button>
      <div className="faq-item__answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="faq" id="faq" ref={ref}>
      <div className="container">
        <div className={`section-header ${isVisible ? 'section-header--visible' : ''}`}>
          <div className="section-badge">FAQ</div>
          <h2 className="section-title">
            Got questions?
            <br />
            <span className="section-title-accent">We've got answers</span>
          </h2>
          <p className="section-subtitle">
            Can't find what you're looking for? Reach out to our support team anytime.
          </p>
        </div>

        <div className={`faq__list ${isVisible ? 'faq__list--visible' : ''}`}>
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <div className={`faq__support ${isVisible ? 'faq__support--visible' : ''}`}>
          <p>Still have questions?</p>
          <a href="mailto:support@kavipay.io" className="btn btn--ghost">
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}