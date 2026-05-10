import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Sidebar from '../components/common/Sidebar';
import ChecklistItem from '../components/checklist/ChecklistItem';
import toast from 'react-hot-toast';

const CATEGORIES = ['clothing', 'documents', 'electronics', 'misc'];
const CAT_ICONS = { clothing: '👕', documents: '📄', electronics: '🔋', misc: '📦' };

const PRESETS = {
  clothing: ['T-shirts', 'Pants', 'Underwear', 'Socks', 'Jacket', 'Shoes', 'Swimwear'],
  documents: ['Passport', 'Visa', 'Travel Insurance', 'Hotel Reservations', 'Flight Tickets', 'ID Card'],
  electronics: ['Phone Charger', 'Power Bank', 'Adapter', 'Earphones', 'Camera', 'Laptop'],
  misc: ['Sunscreen', 'Medications', 'Toothbrush', 'Cash', 'Backpack', 'Water Bottle'],
};

export default function PackingChecklistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ label: '', category: 'clothing' });
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchItems = () => api.get(`/trips/${id}/checklist`).then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchItems(); }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) return;
    setAdding(true);
    try {
      await api.post(`/trips/${id}/checklist`, form);
      setForm({ ...form, label: '' });
      fetchItems();
    } catch {
      toast.error('Failed to add item');
    } finally {
      setAdding(false);
    }
  };

  const addPreset = async (label, category) => {
    try {
      await api.post(`/trips/${id}/checklist`, { label, category });
      fetchItems();
    } catch {
      toast.error('Already exists or failed');
    }
  };

  const filtered = activeTab === 'all' ? items : items.filter(i => i.category === activeTab);
  const packedCount = items.filter(i => i.isPacked).length;
  const progress = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content">
          <button onClick={() => navigate(`/trips/${id}/builder`)} className="text-cream-500 hover:text-cream-700 text-sm font-medium mb-4 flex items-center gap-1.5">
            ← Back to Builder
          </button>
          <div className="mb-6">
            <h1 className="page-title">Packing Checklist</h1>
            <p className="page-subtitle">Make sure you don't forget anything essential.</p>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-display font-semibold text-mint-800">{packedCount} of {items.length} items packed</p>
                <p className="text-cream-500 text-xs mt-0.5">{progress === 100 && items.length > 0 ? '🎉 All packed! Ready to go!' : `${100 - progress}% remaining`}</p>
              </div>
              <span className={`text-2xl font-display font-bold ${progress === 100 && items.length > 0 ? 'text-mint-500' : 'text-cream-400'}`}>
                {progress}%
              </span>
            </div>
            <div className="h-2.5 bg-cream-100 rounded-full overflow-hidden">
              <div className="h-full bg-mint-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Add + Presets */}
            <div className="space-y-4">
              {/* Add form */}
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h2 className="section-heading text-base mb-4">Add Item</h2>
                <form onSubmit={handleAdd} className="space-y-3">
                  <input type="text" className="input-field" placeholder="Item name..."
                    value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
                  <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                  <button type="submit" disabled={adding || !form.label.trim()} className="btn-primary w-full disabled:opacity-60">
                    + Add Item
                  </button>
                </form>
              </div>

              {/* Presets */}
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h2 className="section-heading text-base mb-4">Quick Add Presets</h2>
                <div className="space-y-3">
                  {CATEGORIES.map(cat => (
                    <div key={cat}>
                      <p className="text-xs font-semibold text-cream-500 uppercase tracking-wider mb-2">{CAT_ICONS[cat]} {cat}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESETS[cat].map(p => (
                          <button key={p} onClick={() => addPreset(p, cat)}
                            className="text-xs px-2.5 py-1 bg-cream-100 hover:bg-mint-100 hover:text-mint-700 text-cream-600 rounded-full transition-colors border border-cream-200">
                            +{p}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Checklist */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-5">
              {/* Category tabs */}
              <div className="flex gap-2 mb-5 flex-wrap">
                <button onClick={() => setActiveTab('all')} className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-mint-500 text-white' : 'bg-cream-100 text-cream-600 hover:bg-cream-200'}`}>
                  All ({items.length})
                </button>
                {CATEGORIES.map(cat => {
                  const count = items.filter(i => i.category === cat).length;
                  if (count === 0) return null;
                  return (
                    <button key={cat} onClick={() => setActiveTab(cat)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${activeTab === cat ? 'bg-mint-500 text-white' : 'bg-cream-100 text-cream-600 hover:bg-cream-200'}`}>
                      {CAT_ICONS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <div className="text-center py-8 text-cream-400">Loading...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🎒</div>
                  <p className="text-cream-500 font-medium">No items yet</p>
                  <p className="text-cream-400 text-sm mt-1">Add items using the form or presets.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(item => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      tripId={id}
                      onUpdate={updated => setItems(prev => prev.map(i => i.id === updated.id ? updated : i))}
                      onDelete={itemId => setItems(prev => prev.filter(i => i.id !== itemId))}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}