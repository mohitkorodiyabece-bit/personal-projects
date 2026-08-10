import React from 'react';
import { Check } from 'lucide-react';

const stages = [
  { key: 'created', label: 'Created' },
  { key: 'files_submitted', label: 'Files Submitted' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'editing', label: 'Editing' },
  { key: 'preview_ready', label: 'Preview Ready' },
  { key: 'client_review', label: 'Client Review' },
  { key: 'final_ready', label: 'Final Ready' },
  { key: 'completed', label: 'Completed' },
];

const ProjectProgress = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
        This project has been cancelled.
      </div>
    );
  }

  let currentIndex = stages.findIndex((s) => s.key === status);
  if (currentIndex === -1) {
    if (status === 'revision_requested') currentIndex = stages.findIndex((s) => s.key === 'client_review');
    else if (status === 'approved') currentIndex = stages.findIndex((s) => s.key === 'completed');
    else currentIndex = 0;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[640px] items-center">
        {stages.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={stage.key}>
              <div className="flex flex-col items-center gap-2 text-center">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                    isDone
                      ? 'border-success bg-success text-white'
                      : isCurrent
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border bg-surface text-text-muted'
                  }`}
                >
                  {isDone ? <Check size={14} /> : idx + 1}
                </div>
                <span
                  className={`w-20 text-[11px] leading-tight ${
                    isCurrent ? 'font-medium text-text-primary' : 'text-text-muted'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
              {idx < stages.length - 1 && (
                <div
                  className={`mx-1 h-0.5 flex-1 rounded-full ${
                    idx < currentIndex ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectProgress;