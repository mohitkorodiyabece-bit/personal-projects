import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Bell,
  User,
  Users,
  ShieldCheck,
  X,
  ClipboardList,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';

const navConfig = {
  client: [
    { to: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/client/projects', label: 'My Projects', icon: FolderKanban },
    { to: '/client/projects/new', label: 'Create Project', icon: PlusCircle },
    { to: '/client/notifications', label: 'Notifications', icon: Bell },
    { to: '/client/profile', label: 'Profile', icon: User },
  ],
  editor: [
    { to: '/editor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/editor/projects', label: 'Assigned Projects', icon: ClipboardList },
    { to: '/editor/notifications', label: 'Notifications', icon: Bell },
    { to: '/editor/profile', label: 'Profile', icon: User },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/projects', label: 'Project Management', icon: FolderKanban },
    { to: '/admin/assign', label: 'Editor Assignment', icon: ShieldCheck },
  ],
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const links = navConfig[user?.role] || [];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r border-border bg-surface transition-transform duration-200 lg:sticky lg:top-0 lg:z-0 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5 lg:hidden">
          <span className="text-base font-semibold text-text-primary">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-surface-secondary"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to.endsWith('dashboard')}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-text-muted hover:bg-surface-secondary hover:text-text-primary'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;