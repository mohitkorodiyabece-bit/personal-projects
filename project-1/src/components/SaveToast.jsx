import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * SaveToast
 * Bottom-right confirmation toast, shown after Save or Reset. Purely
 * driven by the `visible` prop — App.jsx owns the show/hide timing.
 */
export default function SaveToast({ visible, message }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="toast glass"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className="toast-icon" aria-hidden="true">
            <Check size={12} color="#fff" strokeWidth={3} />
          </span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}