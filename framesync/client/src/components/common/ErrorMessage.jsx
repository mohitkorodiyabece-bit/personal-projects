import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ message = 'Something went wrong. Please try again.', onRetry = null }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-danger/30 bg-danger/10 px-6 py-10 text-center">
      <AlertTriangle className="text-danger" size={28} />
      <p className="max-w-sm text-sm text-text-primary">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-1">
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;