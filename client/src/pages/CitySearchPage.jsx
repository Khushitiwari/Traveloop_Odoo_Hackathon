
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Sidebar from '../components/common/Sidebar';
import toast from 'react-hot-toast';

const REGION_FILTERS = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];

export default function CitySearchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(null);
  const [stopForm, setStopForm] = useState({ startDate: '', endDate: '' });
  const [adding, setAdding] = useState(false);

  const fetchCities = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (region !== 'All') params.set('region', region);
    try {
      const res = await api.get(`/cities?${params}`);
      setCities(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCities(); }, [search, region]);

  const handleAddToTrip = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const trip = await api.get(`/trips/${id}`);
      const order = (trip.data.stops?.length || 0) + 1;
      await api.post(`/trips/${id}/stops`, {
        cityId: addModal.id,
        startDate: stopForm.startDate,
        endDate: stopForm.endDate,
        order,
      });
      toast.success(`${addModal.name} added to your trip!`);
      setAddModal(null);
      navigate(`/trips/${id}/builder`);
    } catch {
      toast.error('Failed to add city');
    } finally {
      setAdding(false);
    }
  };

  const COST_LABEL = (idx) => idx <= 1 ? 'Budget' : idx <= 2 ? 'Moderate' : 'Premium';
  const COST_COLOR = (idx) => idx <= 1 ? 'text-mint-600' : idx <= 2 ? 'text-amber-600' : 'text-blush-600';

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content">
          <div className="mb-8">
            <button onClick={() => navigate(`/trips/${id}/builder`)} className="text-cream-500 hover:text-cream-700 text-sm font-medium mb-2 flex items-center gap-1.5">
              ← Back to Builder
            </button>
            <h1 className="page-title">Explore Cities</h1>
            <p className="page-subtitle">Discover destinations to add to your trip.</p>
          </div>

          {/* Search & filters */}
          <div className="bg-white rounded-2xl shadow-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-400">🔍</span>
              <input type="text" className="input-field pl-9" placeholder="Search cities..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {REGION_FILTERS.map(r => (
                <button key={r} onClick={() => setRegion(r)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${region === r ? 'bg-mint-500 text-white' : 'bg-cream-100 text-cream-600 hover:bg-cream-200'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-cream-500">Searching cities...</div>
          ) : cities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🌏</div>
              <p className="text-cream-500 font-medium">No cities found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map(city => (
                <div key={city.id} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all group overflow-hidden">
                  <div className="h-28 bg-gradient-to-br from-mint-100 to-cream-100 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                    🌆
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-mint-800">{city.name}</h3>
                        <p className="text-cream-500 text-xs">{city.country}{city.region ? ` · ${city.region}` : ''}</p>
                      </div>
                      <span className={`text-xs font-semibold ${COST_COLOR(city.costIndex)}`}>
                        {COST_LABEL(city.costIndex)}
                      </span>
                    </div>
                    {city.description && <p className="text-cream-500 text-xs mb-3 line-clamp-2">{city.description}</p>}
                    <div className="flex items-center justify-between pt-2 border-t border-cream-100">
                      <span className="text-xs text-cream-400">
                        🔥 Popularity: {city.popularity}/100
                      </span>
                      <button onClick={() => setAddModal(city)} className="text-xs font-medium text-mint-600 hover:text-mint-800 bg-mint-50 hover:bg-mint-100 px-3 py-1.5 rounded-lg transition-colors">
                        + Add to Trip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add to Trip Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAddModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up p-6">
            <h3 className="font-display font-semibold text-mint-800 text-lg mb-1">Add {addModal.name}</h3>
            <p className="text-cream-500 text-sm mb-5">Set your dates for this stop.</p>
            <form onSubmit={handleAddToTrip} className="space-y-4">
              <div>
                <label className="label">Arrival Date</label>
                <input type="date" className="input-field" required
                  value={stopForm.startDate} onChange={e => setStopForm({ ...stopForm, startDate: e.target.value })} />
              </div>
              <div>
                <label className="label">Departure Date</label>
                <input type="date" className="input-field" required
                  value={stopForm.endDate} onChange={e => setStopForm({ ...stopForm, endDate: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setAddModal(null)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={adding} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                  {adding ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  Add Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}