import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 24, fullScreen = false, label = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="animate-spin text-primary" size={size} />
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 py-10">
      <Loader2 className="animate-spin text-primary" size={size} />
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  );
};

export default LoadingSpinner;