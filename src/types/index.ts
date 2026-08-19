export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  handle: string;
  avatar: string;
  text: string;
  rating: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CryptoTicker {
  symbol: string;
  name: string;
  price: string;
  change: string;
  positive: boolean;
}