import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import NotificationDropdown from './NotificationDropdown.jsx';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profilePath =
    user?.role === 'editor'
      ? '/editor/profile'
      : user?.role === 'admin'
      ? '/admin'
      : '/client/profile';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-text-muted hover:bg-surface-secondary hover:text-text-primary lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
            F
          </div>
          <span className="hidden text-base font-semibold text-text-primary sm:block">
            FrameSync
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationDropdown />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-secondary"
          >
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <span className="hidden text-sm font-medium text-text-primary sm:block">
              {user?.name}
            </span>
            <ChevronDown size={14} className="hidden text-text-muted sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-40 mt-2 w-52 rounded-2xl border border-border bg-surface p-1.5 shadow-soft">
              <div className="border-b border-border px-3 py-2">
                <p className="truncate text-sm font-medium text-text-primary">{user?.name}</p>
                <p className="truncate text-xs text-text-muted">{user?.email}</p>
              </div>
              <Link
                to={profilePath}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-surface-secondary"
              >
                <User size={15} /> Profile
              </Link>
              <Link
                to={profilePath}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-surface-secondary"
              >
                <Settings size={15} /> Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger/10"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;