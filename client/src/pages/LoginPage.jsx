
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ShieldCheck, Sparkles, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const adminMode = new URLSearchParams(location.search).get('admin') === '1';
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      if (loggedInUser?.role === 'ADMIN' || adminMode) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-mint-300 via-mint-200 to-cream-100 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #27625a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #b2ddd4 0%, transparent 50%)' }} />
        <div className="relative text-center">
          <div className="text-7xl mb-6">🌍</div>
          <h1 className="text-4xl font-display font-bold text-mint-900 mb-4">Plan Your Dream Trip</h1>
          <p className="text-mint-800 text-lg leading-relaxed max-w-sm">
            Traveloop makes multi-city travel planning effortless. Build itineraries, manage budgets, and share your adventures.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            {['🗼 Paris', '🗾 Tokyo', '🏛️ Rome', '🗽 New York'].map(city => (
              <span key={city} className="bg-white/60 backdrop-blur text-mint-900 text-sm px-3 py-1.5 rounded-full">{city}</span>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-mint-800">
            <ShieldCheck size={16} />
            <span>Secure sign-in with protected sessions</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-cream-100 p-8">
        <div className="w-full max-w-md animate-slide-up bg-white rounded-3xl border border-cream-200 shadow-card p-7 sm:p-8">
          {/* Logo */}
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-mint-500 flex items-center justify-center text-white text-lg font-bold">T</div>
            <span className="text-2xl font-display font-semibold text-mint-800">Traveloop</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-mint-50 text-mint-700 border border-mint-200">
              <Sparkles size={13} /> Easy Planning
            </span>
          </div>

          <h2 className="text-3xl font-display font-semibold text-mint-900 mb-2">
            {adminMode ? 'Admin sign in' : 'Welcome back'}
          </h2>
          <p className="text-cream-700 mb-7">
            {adminMode ? 'Use admin credentials to open the dashboard.' : 'Sign in to continue planning your adventures.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label flex items-center gap-2"><Mail size={14} />Email address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label flex items-center gap-2"><Lock size={14} />Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-cream-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-mint-600 font-medium hover:text-mint-800 transition-colors">
              Create one free
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-cream-500">
            Need admin access?{' '}
            <Link to="/login?admin=1" className="text-mint-700 font-medium hover:text-mint-900 transition-colors">
              Login as admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}