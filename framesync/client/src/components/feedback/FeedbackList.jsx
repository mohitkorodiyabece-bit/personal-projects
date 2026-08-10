import React from 'react';
import { CheckCircle2, Circle, User } from 'lucide-react';
import { formatTime } from '../../utils/formatTime.js';
import { formatDateTime } from '../../utils/formatDate.js';

const FeedbackList = ({ feedback, onSeek, onResolve, currentUserId, canResolve }) => {
  if (!feedback || feedback.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted">
        No feedback yet on this version. Watch the video and leave a comment above.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {feedback.map((item) => (
        <div
          key={item._id}
          className={`rounded-xl border p-3.5 transition-colors ${
            item.resolved ? 'border-border bg-surface/50' : 'border-border bg-surface'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <User size={13} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">
                    {item.author?.name || 'Unknown user'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSeek(item.timestamp)}
                    className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/25"
                  >
                    {formatTime(item.timestamp)}
                  </button>
                </div>
                <p
                  className={`mt-1 text-sm ${
                    item.resolved ? 'text-text-muted line-through' : 'text-text-primary'
                  }`}
                >
                  {item.message}
                </p>
                <p className="mt-1 text-[11px] text-text-muted">
                  {formatDateTime(item.createdAt)}
                  {item.resolved && item.resolvedBy && ` · Resolved by ${item.resolvedBy.name}`}
                </p>
              </div>
            </div>

            {canResolve && !item.resolved && (
              <button
                type="button"
                onClick={() => onResolve(item._id)}
                className="flex shrink-0 items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text-muted hover:border-success/40 hover:text-success"
              >
                <Circle size={13} /> Resolve
              </button>
            )}
            {item.resolved && (
              <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-success">
                <CheckCircle2 size={14} /> Resolved
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;