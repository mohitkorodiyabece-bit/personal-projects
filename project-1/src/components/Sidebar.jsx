import { motion } from "framer-motion";
import {
  Table2,
  Monitor,
  Keyboard,
  Mouse,
  Lamp,
  Flower2,
  Speaker
} from "lucide-react";
import { COMPONENTS_LIST, ENVIRONMENT_LIST, ENVIRONMENTS } from "../data/config.js";

// Maps the icon name strings stored in config.js to actual lucide-react
// components, since JSON-like data can't hold component references.
const ICON_MAP = {
  Table2,
  Monitor,
  Keyboard,
  Mouse,
  Lamp,
  Flower2,
  Speaker
};

/**
 * Sidebar
 * Left-hand components list + environment picker. Purely presentational —
 * all selection state lives in App.jsx and flows in as props.
 */
export default function Sidebar({
  selectedObject,
  onSelectObject,
  environment,
  onEnvironmentChange
}) {
  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -32, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <h2 className="sidebar-section-title">Components</h2>
      <div className="sidebar-list">
        {COMPONENTS_LIST.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive = selectedObject === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-item${isActive ? " active" : ""}`}
              onClick={() => onSelectObject(item.id)}
              aria-pressed={isActive}
              aria-label={`Select ${item.label}`}
            >
              <span className="sidebar-item-icon" aria-hidden="true">
                <Icon size={17} strokeWidth={2} />
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      <h2 className="sidebar-section-title">Environment</h2>
      <div className="sidebar-env-list">
        {ENVIRONMENT_LIST.map((env) => {
          const isActive = environment === env.id;
          const accent = ENVIRONMENTS[env.id]?.accent || "#8b5cf6";
          return (
            <button
              key={env.id}
              className={`sidebar-env-item${isActive ? " active" : ""}`}
              onClick={() => onEnvironmentChange(env.id)}
              aria-pressed={isActive}
            >
              {env.label}
              <span
                className="sidebar-env-dot"
                style={{ background: accent, boxShadow: isActive ? `0 0 8px ${accent}` : "none" }}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </motion.aside>
  );
}