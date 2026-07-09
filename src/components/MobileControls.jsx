import { AnimatePresence, motion } from "framer-motion";
import {
  Table2,
  Monitor,
  Keyboard,
  Mouse,
  Lamp,
  Flower2,
  Speaker,
  X
} from "lucide-react";
import CustomizationPanel from "./CustomizationPanel.jsx";
import { COMPONENTS_LIST } from "../data/config.js";

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
 * MobileControls
 * Mobile-only layout: a horizontally scrollable component strip at the
 * bottom of the screen, plus a slide-up drawer (reusing
 * CustomizationPanel's content) for editing the selected object. This
 * replaces the desktop Sidebar + CustomizationPanel entirely below the
 * 860px breakpoint.
 */
export default function MobileControls({
  selectedObject,
  onSelectObject,
  config,
  updateConfig,
  drawerOpen,
  onCloseDrawer,
  onOpenDrawer
}) {
  return (
    <>
      <div className="mobile-bottom-bar glass">
        {COMPONENTS_LIST.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive = selectedObject === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-bottom-item${isActive ? " active" : ""}`}
              onClick={() => {
                onSelectObject(item.id);
                onOpenDrawer();
              }}
              aria-pressed={isActive}
              aria-label={`Select ${item.label}`}
            >
              <Icon size={18} strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="mobile-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseDrawer}
            />
            <motion.div
              className="mobile-drawer glass"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Customize selected component"
            >
              <div className="mobile-drawer-handle" onClick={onCloseDrawer} />
              <button
                className="btn btn-ghost"
                onClick={onCloseDrawer}
                aria-label="Close customization drawer"
                style={{ position: "absolute", top: 14, right: 16, padding: 8 }}
              >
                <X size={16} />
              </button>
              <CustomizationPanel
                selectedObject={selectedObject}
                config={config}
                updateConfig={updateConfig}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}