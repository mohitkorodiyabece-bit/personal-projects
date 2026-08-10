import React from 'react';

const statusConfig = {
  created: { label: 'Created', className: 'bg-secondary/15 text-secondary' },
  files_submitted: { label: 'Files Submitted', className: 'bg-secondary/15 text-secondary' },
  assigned: { label: 'Assigned', className: 'bg-primary/15 text-primary' },
  editing: { label: 'Editing', className: 'bg-primary/15 text-primary' },
  preview_ready: { label: 'Preview Ready', className: 'bg-warning/15 text-warning' },
  client_review: { label: 'Client Review', className: 'bg-warning/15 text-warning' },
  revision_requested: { label: 'Revision Requested', className: 'bg-danger/15 text-danger' },
  final_ready: { label: 'Final Ready', className: 'bg-success/15 text-success' },
  approved: { label: 'Approved', className: 'bg-success/15 text-success' },
  completed: { label: 'Completed', className: 'bg-success/15 text-success' },
  cancelled: { label: 'Cancelled', className: 'bg-danger/15 text-danger' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    className: 'bg-surface-secondary text-text-muted',
  };

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;