import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const routeTitles = {
  '/dashboard': 'Dashboard Overview',
  '/subscriptions': 'Subscriptions Management',
  '/analytics': 'Expense Analytics & Trends',
  '/budget': 'Budget & Spending Limits',
  '/renewals': 'Upcoming Renewals & Schedule',
  '/insights': 'Smart Insights & Cost Optimization',
  '/settings': 'Account Settings',
};

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const currentTitle = routeTitles[location.pathname] || 'SubSense Dashboard';

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Upcoming renewal',
      desc: 'Netflix Standard renews in 3 days ($15.99)',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Budget notice',
      desc: 'You have reached 68% of your monthly budget',
      time: '1 day ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side: Hamburger button + Dynamic Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white md:hidden transition-colors"
          aria-label="Open mobile navigation menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">{currentTitle}</h1>
        </div>
      </div>

      {/* Right side: Notifications + User profile + Logout */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors focus:outline-none"
            aria-label="View notifications"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-md z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-1">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Notifications</span>
                <span className="text-[10px] text-cyan-400 font-medium">1 unread</span>
              </div>
              <div className="mt-2 space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`rounded-lg p-2.5 text-xs transition-colors ${
                      notif.unread ? 'bg-cyan-950/30 border border-cyan-900/40' : 'bg-slate-950/40'
                    }`}
                  >
                    <p className="font-semibold text-slate-200">{notif.title}</p>
                    <p className="mt-0.5 text-slate-400">{notif.desc}</p>
                    <span className="mt-1 block text-[10px] text-slate-400">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile with logout button */}
        <div className="relative flex items-center gap-2" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/60 py-1.5 pl-2 pr-3 text-left hover:border-slate-700 transition-all focus:outline-none"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-cyan-300">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-none">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5 max-w-[110px] truncate">{user?.email}</p>
            </div>
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 mt-1 w-48 rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-md z-50">
              <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
                Signed in as <span className="font-semibold text-white truncate block">{user?.email}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
