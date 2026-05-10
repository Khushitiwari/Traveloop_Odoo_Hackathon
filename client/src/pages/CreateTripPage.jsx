
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Sidebar from '../components/common/Sidebar';
import toast from 'react-hot-toast';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    isPublic: false,
    coverPhoto: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error('End date must be after start date');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/trips', form);
      toast.success('Trip created! 🎉');
      navigate(`/trips/${res.data.id}/builder`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content max-w-2xl">
          <button onClick={() => navigate(-1)} className="text-cream-500 hover:text-cream-700 text-sm font-medium mb-6 flex items-center gap-1.5 transition-colors">
            ← Back
          </button>

          <div className="mb-8">
            <h1 className="page-title">Plan a New Trip</h1>
            <p className="page-subtitle">Set the basics and we'll build the rest together.</p>
          </div>

          {/* Preview card */}
          <div className="bg-gradient-to-br from-mint-200 to-mint-100 rounded-2xl p-6 mb-8 flex items-center gap-4">
            <div className="text-4xl">✈️</div>
            <div>
              <p className="font-display font-semibold text-mint-800 text-lg">{form.name || 'Your Trip Name'}</p>
              <p className="text-mint-600 text-sm">
                {form.startDate && form.endDate
                  ? `${new Date(form.startDate).toLocaleDateString()} → ${new Date(form.endDate).toLocaleDateString()}`
                  : 'Set your travel dates below'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 space-y-5">
            <div>
              <label className="label">Trip Name *</label>
              <input type="text" className="input-field" placeholder="e.g. European Summer 2025"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea className="input-field resize-none" rows={3} placeholder="What's this trip about? Add a note..."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date *</label>
                <input type="date" className="input-field" value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })} required />
              </div>
              <div>
                <label className="label">End Date *</label>
                <input type="date" className="input-field" value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })} required />
              </div>
            </div>

            <div>
              <label className="label">Cover Photo URL <span className="text-cream-400 font-normal">(optional)</span></label>
              <input type="url" className="input-field" placeholder="https://..."
                value={form.coverPhoto} onChange={e => setForm({ ...form, coverPhoto: e.target.value })} />
            </div>

            <div className="flex items-center gap-3 py-3 px-4 bg-cream-50 rounded-xl border border-cream-200">
              <button
                type="button"
                onClick={() => setForm({ ...form, isPublic: !form.isPublic })}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${form.isPublic ? 'bg-mint-500' : 'bg-cream-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <div>
                <p className="text-sm font-medium text-cream-800">Make trip public</p>
                <p className="text-xs text-cream-500">Anyone with the link can view your itinerary</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</> : 'Create Trip →'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}