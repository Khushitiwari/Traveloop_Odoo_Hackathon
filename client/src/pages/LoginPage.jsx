
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-mint-400 via-mint-300 to-mint-200 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #27625a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #b2ddd4 0%, transparent 50%)' }} />
        <div className="relative text-center">
          <div className="text-7xl mb-6">🌍</div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">Plan Your Dream Trip</h1>
          <p className="text-mint-100 text-lg leading-relaxed max-w-sm">
            Traveloop makes multi-city travel planning effortless. Build itineraries, manage budgets, and share your adventures.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            {['🗼 Paris', '🗾 Tokyo', '🏛️ Rome', '🗽 New York'].map(city => (
              <span key={city} className="bg-white/20 backdrop-blur text-white text-sm px-3 py-1.5 rounded-full">{city}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-cream-100 p-8">
        <div className="w-full max-w-md animate-slide-up">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-mint-500 flex items-center justify-center text-white text-lg font-bold">T</div>
            <span className="text-2xl font-display font-semibold text-mint-800">Traveloop</span>
          </div>

          <h2 className="text-3xl font-display font-semibold text-mint-900 mb-2">Welcome back</h2>
          <p className="text-cream-500 mb-8">Sign in to continue planning your adventures.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
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
              <label className="label">Password</label>
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
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-cream-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-mint-600 font-medium hover:text-mint-800 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}