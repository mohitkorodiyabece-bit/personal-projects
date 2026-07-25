import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Menu, X } from 'lucide-react';

export default function Header({ onSave, onReset }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      className="header"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="logo">
        <div className="logo-dot">N</div>
        NEXUS DESK
      </div>

      <nav className="nav" aria-label="Primary">
        <a href="#configurator" className="active">Configurator</a>
        <a href="#gallery">Gallery</a>
        <a href="#about">About</a>
      </nav>

      <div className="header-actions">
        <button className="btn ghost" onClick={onReset} aria-label="Reset setup">
          <RotateCcw size={15} /> Reset
        </button>
        <button className="btn primary" onClick={onSave} aria-label="Save setup">
          <Save size={15} /> Save Setup
        </button>
        <button
          className="btn mobile-menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>
    </motion.header>
  );
}
