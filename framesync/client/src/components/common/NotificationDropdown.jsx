import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Trash2 } from 'lucide-react';
import useNotifications from '../../hooks/useNotifications.js';
import useAuth from '../../hooks/useAuth.js';
import { formatDateTime } from '../../utils/formatDate.js';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, markOneAsRead, markAllRead, removeNotification } =
    useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notificationsPath =
    user?.role === 'editor' ? '/editor/notifications' : '/client/notifications';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-40 mt-2 w-80 max-w-[90vw] rounded-2xl border border-border bg-surface shadow-soft">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-text-muted">
                No notifications yet
              </p>
            ) : (
              notifications.slice(0, 8).map((n) => (
                <div
                  key={n._id}
                  className={`flex gap-2 border-b border-border px-4 py-3 last:border-b-0 ${
                    !n.isRead ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-text-primary">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">{n.message}</p>
                    <p className="mt-1 text-[11px] text-text-muted">
                      {formatDateTime(n.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={() => markOneAsRead(n._id)}
                        className="rounded-md p-1 text-text-muted hover:bg-surface-secondary hover:text-success"
                        aria-label="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeNotification(n._id)}
                      className="rounded-md p-1 text-text-muted hover:bg-surface-secondary hover:text-danger"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-border px-4 py-2.5">
            <Link
              to={notificationsPath}
              onClick={() => setIsOpen(false)}
              className="block text-center text-xs font-medium text-primary hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;