
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-cream-200 h-16 flex items-center px-6 gap-4">
      <button
        onClick={() => navigate('/')}
        className="font-display font-bold text-xl text-mint-700 tracking-tight"
      >
        Traveloop 🌍
      </button>

      <div className="flex-1" />

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-cream-500 hidden sm:block">
            {user.name}
          </span>
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-mint-100 border-2 border-mint-300 flex items-center justify-center text-mint-700 font-semibold text-sm hover:bg-mint-200 transition-colors"
          >
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name?.[0]?.toUpperCase()
            )}
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-cream-400 hover:text-blush-500 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}