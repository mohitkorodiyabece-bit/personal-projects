import { AnimatePresence, motion } from "framer-motion";

/**
 * ConfirmModal
 * Custom confirmation dialog (replaces window.confirm) used for the
 * "Reset all options" flow. Fully controlled via props from App.jsx.
 */
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <motion.div
            className="modal-card glass"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title" id="confirm-modal-title">
              {title}
            </h3>
            <p className="modal-message">{message}</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={onCancel}>
                {cancelLabel}
              </button>
              <button className="btn btn-danger" onClick={onConfirm}>
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}