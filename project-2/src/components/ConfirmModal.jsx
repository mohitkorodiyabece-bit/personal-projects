import { motion } from 'framer-motion';

export default function ConfirmModal({ title, description, confirmLabel = 'Confirm', onCancel, onConfirm }) {
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
      role="dialog" aria-modal="true"
    >
      <motion.div
        className="modal"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className="btn danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
