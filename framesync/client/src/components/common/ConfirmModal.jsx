import React from 'react';
import { X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1 text-text-muted hover:bg-surface-secondary hover:text-text-primary"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mb-6 text-sm text-text-muted">{message}</p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={danger ? 'btn-danger' : 'btn-primary'}
            disabled={loading}
          >
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;