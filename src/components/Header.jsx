import { useState } from "react";
import { motion } from "framer-motion";
import { Box, RotateCcw, Save, Menu, X } from "lucide-react";

/**
 * Header
 * Sticky top bar: logo, primary nav, and Save/Reset actions. Includes a
 * mobile hamburger that reveals a simple dropdown nav on small screens
 * (the main sidebar/panel are hidden below 860px per the CSS breakpoints,
 * so this menu carries navigation-only items there).
 */
export default function Header({ onSave, onReset }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("configurator");

  const navItems = [
    { id: "configurator", label: "Configurator" },
    { id: "gallery", label: "Gallery" },
    { id: "about", label: "About" }
  ];

  return (
    <motion.header
      className="header glass"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="header-logo">
        <span className="header-logo-mark" aria-hidden="true">
          <Box size={18} color="#fff" strokeWidth={2.4} />
        </span>
        NEXUS DESK
      </div>

      <nav className="header-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`header-nav-item${activeNav === item.id ? " active" : ""}`}
            onClick={() => setActiveNav(item.id)}
            aria-current={activeNav === item.id ? "page" : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <button
          className="btn btn-ghost"
          onClick={onReset}
          aria-label="Reset setup to defaults"
        >
          <RotateCcw size={15} />
          <span>Reset</span>
        </button>
        <button
          className="btn btn-primary"
          onClick={onSave}
          aria-label="Save current setup"
        >
          <Save size={15} />
          <span>Save Setup</span>
        </button>

        <button
          className="btn btn-ghost header-mobile-toggle"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          style={{ display: "none" }}
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>
    </motion.header>
  );
}