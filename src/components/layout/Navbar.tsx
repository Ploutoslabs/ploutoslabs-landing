import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  FileText,
  HelpCircle,
  Newspaper,
  Users,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useMobileMenu } from "../../hooks/useMobileMenu";
import DeviceModal from "../ui/DeviceModal";
import Logo from "../../assets/logo.png";
import "./Navbar.css";

/* ───────────────── NAV LINKS ───────────────── */
const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

/* ───────────────── RESOURCES DROPDOWN ───────────────── */
const resourcesDropdown = [
  {
    icon: FileText,
    label: "Whitepaper",
    desc: "Read detailed documentation about the project",
    link: "https://ploutoslabs.gitbook.io/ploutos-white-paper",
    external: true,
  },
  {
    icon: HelpCircle,
    label: "FAQs",
    desc: "Get answers to common questions",
    link: "/faq",
    external: false,
  },
  {
    icon: Newspaper,
    label: "Blog",
    desc: "Latest updates, insights, and announcements",
    link: "https://x.com/ploutoslabs",
    external: true,
  },
  {
    icon: Users,
    label: "Community",
    desc: "Join our growing global community",
    link: "https://t.me/ploutoslab",
    external: true,
  },
];

export default function Navbar() {
  const { isOpen, toggle, close } = useMobileMenu();
  const [scrolled, setScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);

  // ✅ FIXED: correct ref type
  const resourcesRef = useRef<HTMLDivElement | null>(null);

  /* scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* click outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        resourcesRef.current &&
        e.target instanceof Node &&
        !resourcesRef.current.contains(e.target)
      ) {
        setResourcesOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1] as any,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.98,
      transition: { duration: 0.15 },
    },
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <img src={Logo} alt="Ploutoslabs" className="footer__logo-img" />
          </Link>

          {/* Desktop nav */}
          <div className="navbar__desktop">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to} className="navbar__link">
                {link.label}
              </Link>
            ))}

            <Link to="/kavipay" className="navbar__link">
              KaviPay
            </Link>
            <Link to="/ecosystem" className="navbar__link">
              Our Ecosystem
            </Link>
            <Link to="/token" className="navbar__link">
              $PLTL Token
            </Link>
            {/* <Link to="/faq" className="navbar__link">
              FAQ
            </Link> */}

            {/* Resources dropdown */}
            <div ref={resourcesRef} style={{ position: "relative" }}>
              <button
                className="navbar__dropdown-trigger"
                onClick={() => setResourcesOpen((v) => !v)}>
                Resources
                <ChevronDown
                  size={16}
                  className={`chevron ${resourcesOpen ? "chevron--open" : ""}`}
                />
              </button>

              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    className="navbar__dropdown"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit">
                    {resourcesDropdown.map((item) => {
                      const Icon = item.icon;
                      const body = (
                        <>
                          <div className="navbar__dropdown-icon">
                            <Icon size={20} />
                          </div>
                          <div>
                            <div className="navbar__dropdown-label">
                              {item.label}
                            </div>
                            <div className="navbar__dropdown-desc">
                              {item.desc}
                            </div>
                          </div>
                        </>
                      );

                      return item.external ? (
                        <a
                          key={item.label}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="navbar__dropdown-item"
                          onClick={() => setResourcesOpen(false)}>
                          {body}
                        </a>
                      ) : (
                        <Link
                          key={item.label}
                          to={item.link}
                          className="navbar__dropdown-item"
                          onClick={() => setResourcesOpen(false)}>
                          {body}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop actions */}
          <div className="navbar__actions">
            {/* <Link to="/token" className="navbar__btn navbar__btn--outline">
              Buy $PLTL Token
            </Link> */}
            <button
              type="button"
              onClick={() => setDeviceModalOpen(true)}
              className="btn navbar__btn--filled">
              Get a Kavipay Card
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={toggle}
            aria-label="Toggle menu.">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="navbar__mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />

            <motion.div
              className="navbar__mobile"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}>
              <div className="navbar__mobile-header">
                <Link to="/" className="navbar__logo" onClick={close}>
                  <img
                    src={Logo}
                    alt="Ploutoslabs"
                    className="footer__logo-img"
                  />
                </Link>

                <button className="navbar__mobile-close" onClick={close}>
                  <X size={24} />
                </button>
              </div>

              <div className="navbar__mobile-links">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="navbar__mobile-link"
                    onClick={close}>
                    {link.label}
                  </Link>
                ))}

                <Link
                  to="/kavipay"
                  className="navbar__mobile-link"
                  onClick={close}>
                  Kavipay
                </Link>

                <Link
                  to="/ecosystem"
                  className="navbar__mobile-link"
                  onClick={close}>
                  Our Ecosystem
                </Link>

                <Link
                  to="/token"
                  className="navbar__mobile-link"
                  onClick={close}>
                  $PLTL Token
                </Link>

                <Link to="/faq" className="navbar__mobile-link" onClick={close}>
                  FAQs
                </Link>

                {/* Mobile Resources */}
                <button
                  className="navbar__mobile-dropdown-trigger"
                  onClick={() => setMobileResourcesOpen((v) => !v)}>
                  Resources
                  <ChevronDown
                    size={18}
                    className={`chevron ${
                      mobileResourcesOpen ? "chevron--open" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {mobileResourcesOpen && (
                    <motion.div
                      className="navbar__mobile-dropdown-items"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}>
                      {resourcesDropdown.map((item) => {
                        const Icon = item.icon;
                        return item.external ? (
                          <a
                            key={item.label}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="navbar__mobile-dropdown-item"
                            onClick={close}>
                            <Icon size={18} />
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            key={item.label}
                            to={item.link}
                            className="navbar__mobile-dropdown-item"
                            onClick={close}>
                            <Icon size={18} />
                            {item.label}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="navbar__mobile-actions">
                <Link
                  to="/token"
                  className="navbar__btn navbar__btn--outline"
                  onClick={close}>
                  Buy $PLTL Token
                </Link>

                <button
                  type="button"
                  className="navbar__btn navbar__btn--filled"
                  onClick={() => {
                    close();
                    setDeviceModalOpen(true);
                  }}>
                  Get Kavipay Card
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <DeviceModal
        open={deviceModalOpen}
        onClose={() => setDeviceModalOpen(false)}
      />
    </>
  );
}
