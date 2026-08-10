import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDate, daysUntil, isOverdue } from '../../utils/formatDate.js';

const DeadlineDisplay = ({ deadline, status }) => {
  const overdue = isOverdue(deadline) && !['completed', 'cancelled'].includes(status);
  const days = daysUntil(deadline);

  let helperText = '';
  if (status === 'completed' || status === 'cancelled') {
    helperText = '';
  } else if (overdue) {
    helperText = `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`;
  } else if (days === 0) {
    helperText = 'Due today';
  } else if (days > 0) {
    helperText = `${days} day${days === 1 ? '' : 's'} left`;
  }

  return (
    <div className="flex items-center gap-2">
      <Calendar size={14} className={overdue ? 'text-danger' : 'text-text-muted'} />
      <div>
        <p className={`text-sm ${overdue ? 'text-danger' : 'text-text-primary'}`}>
          {formatDate(deadline)}
        </p>
        {helperText && (
          <p className={`text-xs ${overdue ? 'text-danger' : 'text-text-muted'}`}>
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
};

export default DeadlineDisplay;