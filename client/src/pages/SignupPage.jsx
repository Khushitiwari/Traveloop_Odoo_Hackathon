
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { BadgeCheck, User, Mail, Lock, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blush-300 via-blush-200 to-cream-200 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="relative text-center">
          <div className="text-7xl mb-6">✈️</div>
          <h1 className="text-4xl font-display font-bold text-blush-800 mb-4">Start Your Journey</h1>
          <p className="text-blush-700 text-lg leading-relaxed max-w-sm">
            Join thousands of travelers who plan smarter trips with Traveloop.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 text-left">
            {['✅ Multi-city itineraries', '💰 Budget tracking', '📋 Packing checklists', '🔗 Share with friends'].map(f => (
              <div key={f} className="bg-white/30 backdrop-blur text-blush-800 text-sm px-3 py-2 rounded-xl">{f}</div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-blush-800">
            <BadgeCheck size={16} />
            <span>Your account is ready in under a minute</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-cream-100 p-8">
        <div className="w-full max-w-md animate-slide-up bg-white rounded-3xl border border-cream-200 shadow-card p-7 sm:p-8">
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-mint-500 flex items-center justify-center text-white text-lg font-bold">T</div>
            <span className="text-2xl font-display font-semibold text-mint-800">Traveloop</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blush-50 text-blush-700 border border-blush-200">
              <Sparkles size={13} /> Free Forever
            </span>
          </div>

          <h2 className="text-3xl font-display font-semibold text-mint-900 mb-2">Create your account</h2>
          <p className="text-cream-700 mb-7">Free forever. No credit card required.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label flex items-center gap-2"><User size={14} />Full Name</label>
              <input type="text" className="input-field" placeholder="Jane Doe" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label flex items-center gap-2"><Mail size={14} />Email address</label>
              <input type="email" className="input-field" placeholder="jane@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label flex items-center gap-2"><Lock size={14} />Password</label>
              <input type="password" className="input-field" placeholder="Min. 6 characters" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div>
              <label className="label flex items-center gap-2"><Lock size={14} />Confirm Password</label>
              <input type="password" className="input-field" placeholder="Repeat your password" value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-cream-500">
            Already have an account?{' '}
            <Link to="/login" className="text-mint-600 font-medium hover:text-mint-800 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}