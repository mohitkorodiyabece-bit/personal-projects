import React from 'react';

const StatCard = ({ icon: Icon, label, value, accent = 'primary' }) => {
  const accentClasses = {
    primary: 'bg-primary/15 text-primary',
    secondary: 'bg-secondary/15 text-secondary',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    danger: 'bg-danger/15 text-danger',
  };

  return (
    <div className="card flex items-center gap-4 p-5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          accentClasses[accent] || accentClasses.primary
        }`}
      >
        <Icon size={20} />
      </div>
      <div className="overflow-hidden">
        <p className="truncate text-xs font-medium text-text-muted">{label}</p>
        <p className="text-xl font-semibold text-text-primary">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;