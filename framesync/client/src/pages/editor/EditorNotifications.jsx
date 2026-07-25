import React from 'react';
import { Bell, Trash2, Check } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import useNotifications from '../../hooks/useNotifications.js';
import { formatDateTime } from '../../utils/formatDate.js';

const EditorNotifications = () => {
  const { notifications, unreadCount, markOneAsRead, markAllRead, removeNotification, loading } =
    useNotifications();

  return (
    <DashboardLayout
      title="Notifications"
      subtitle={`${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}
      actions={
        unreadCount > 0 && (
          <button type="button" onClick={markAllRead} className="btn-secondary">
            <Check size={16} /> Mark all as read
          </button>
        )
      }
    >
      {!loading && notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" message="You're all caught up!" />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`card flex items-start justify-between gap-3 p-4 ${
                !n.isRead ? 'border-primary/30 bg-primary/5' : ''
              }`}
            >
              <div>
                <p className="text-sm font-medium text-text-primary">{n.title}</p>
                <p className="mt-1 text-sm text-text-muted">{n.message}</p>
                <p className="mt-1.5 text-xs text-text-muted">{formatDateTime(n.createdAt)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!n.isRead && (
                  <button
                    type="button"
                    onClick={() => markOneAsRead(n._id)}
                    className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-success"
                    aria-label="Mark as read"
                  >
                    <Check size={15} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeNotification(n._id)}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-danger"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default EditorNotifications;