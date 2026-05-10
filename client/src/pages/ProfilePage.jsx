import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/common/Sidebar';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'fr', label: '🇫🇷 French' },
  { code: 'de', label: '🇩🇪 German' },
  { code: 'es', label: '🇪🇸 Spanish' },
  { code: 'ja', label: '🇯🇵 Japanese' },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    language: user?.language || 'en',
    photo: user?.photo || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // In a real app, call PUT /api/auth/profile
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    toast.success('Profile updated!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content max-w-2xl">
          <div className="mb-8">
            <h1 className="page-title">Profile & Settings</h1>
            <p className="page-subtitle">Manage your account and preferences.</p>
          </div>

          {/* Avatar */}
          <div className="bg-white rounded-2xl shadow-card p-6 mb-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-mint-200 flex items-center justify-center text-mint-700 text-2xl font-bold flex-shrink-0">
              {form.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="font-display font-semibold text-mint-800 text-xl">{form.name}</h2>
              <p className="text-cream-500 text-sm">{form.email}</p>
              <span className="badge-mint text-xs mt-1">{user?.role}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-card p-6 mb-6 space-y-5">
            <h2 className="section-heading">Account Details</h2>
            <div>
              <label className="label">Full Name</label>
              <input type="text" className="input-field" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input-field" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Profile Photo URL <span className="text-cream-400 font-normal">(optional)</span></label>
              <input type="url" className="input-field" placeholder="https://..." value={form.photo}
                onChange={e => setForm({ ...form, photo: e.target.value })} />
            </div>
            <div>
              <label className="label">Preferred Language</label>
              <select className="input-field" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              Save Changes
            </button>
          </form>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl shadow-card p-6 border border-blush-200">
            <h2 className="font-display font-semibold text-blush-700 mb-4">Account Actions</h2>
            <div className="space-y-3">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-cream-200 hover:border-blush-200 hover:bg-blush-50 text-cream-600 hover:text-blush-700 transition-all text-sm font-medium">
                🚪 Sign Out
              </button>
              <button
                onClick={() => { if (confirm('Are you sure you want to delete your account? This cannot be undone.')) toast.error('Contact support to delete your account.'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-blush-200 hover:bg-blush-50 text-blush-600 transition-all text-sm font-medium"
              >
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}