
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/trips', label: 'My Trips', icon: '🗺️' },
  { to: '/trips/new', label: 'New Trip', icon: '✈️' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

const ADMIN_ITEMS = [{ to: '/admin', label: 'Admin', icon: '⚙️' }];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-mint-100 text-mint-800 border border-mint-200'
        : 'text-cream-600 hover:bg-cream-100 hover:text-mint-700'
    }`;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-cream-200 z-40 p-4">
        {/* Logo */}
        <div className="mb-8 px-2 pt-2">
          <span className="font-display font-bold text-xl text-mint-700 tracking-tight">
            Traveloop 🌍
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          {user?.role === 'ADMIN' &&
            ADMIN_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-cream-200 pt-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-mint-100 border-2 border-mint-300 flex items-center justify-center text-mint-700 font-semibold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-mint-900 truncate">{user?.name}</p>
            <p className="text-xs text-cream-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-cream-400 hover:text-blush-500 transition-colors text-lg"
          >
            ↩
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 z-40 flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
                isActive ? 'text-mint-600' : 'text-cream-400'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}