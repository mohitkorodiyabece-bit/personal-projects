import React from 'react';

const priorityConfig = {
  low: { label: 'Low', className: 'bg-surface-secondary text-text-muted' },
  medium: { label: 'Medium', className: 'bg-secondary/15 text-secondary' },
  high: { label: 'High', className: 'bg-warning/15 text-warning' },
  urgent: { label: 'Urgent', className: 'bg-danger/15 text-danger' },
};

const PriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default PriorityBadge;