import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Sidebar from '../components/common/Sidebar';
import toast from 'react-hot-toast';

const TYPE_ICONS = {
  sightseeing: '👁️',
  food: '🍽️',
  adventure: '🏃',
  shopping: '🛍️',
  beach: '🏖️',
  scuba_diving: '🤿',
  candle_light_dinner: '🕯️',
  museum: '🏛️',
  holy_places: '🛕',
};
const TYPE_COLORS = {
  sightseeing: 'bg-amber-50 border-amber-200',
  food: 'bg-blush-50 border-blush-200',
  adventure: 'bg-mint-50 border-mint-200',
  shopping: 'bg-purple-50 border-purple-200',
  beach: 'bg-sky-50 border-sky-200',
  scuba_diving: 'bg-cyan-50 border-cyan-200',
  candle_light_dinner: 'bg-rose-50 border-rose-200',
  museum: 'bg-indigo-50 border-indigo-200',
  holy_places: 'bg-orange-50 border-orange-200',
};

export default function ActivitySearchPage() {
  const { id, stopId } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [stop, setStop] = useState(null);
  const [filters, setFilters] = useState({ type: '', maxCost: '' });
  const [added, setAdded] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/trips/${id}`).then(r => {
      const s = r.data.stops?.find(s => s.id === stopId);
      setStop(s);
      if (s) {
        setAdded(new Set(s.stopActivities?.map(sa => sa.activityId)));
        const params = new URLSearchParams();
        if (filters.type) params.set('type', filters.type);
        if (filters.maxCost) params.set('maxCost', filters.maxCost);
        api.get(`/cities/${s.cityId}/activities?${params}`).then(r2 => setActivities(r2.data));
      }
    }).finally(() => setLoading(false));
  }, [id, stopId, filters]);

  const handleAdd = async (activityId) => {
    try {
      await api.post(`/trips/${id}/stops/${stopId}/activities`, { activityId });
      setAdded(prev => new Set([...prev, activityId]));
      toast.success('Activity added!');
    } catch {
      toast.error('Already added');
    }
  };

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content">
          <button onClick={() => navigate(`/trips/${id}/builder`)} className="text-cream-500 hover:text-cream-700 text-sm font-medium mb-4 flex items-center gap-1.5">
            ← Back to Builder
          </button>
          <div className="mb-6">
            <h1 className="page-title">{stop ? `Activities in ${stop.city?.name}` : 'Activities'}</h1>
            <p className="page-subtitle">Browse and add experiences to your stop.</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-card p-4 mb-6 flex flex-wrap gap-3">
            <select className="input-field w-auto" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
              <option value="">All Types</option>
              <option value="sightseeing">👁️ Sightseeing</option>
              <option value="food">🍽️ Food</option>
              <option value="adventure">🏃 Adventure</option>
              <option value="shopping">🛍️ Shopping</option>
              <option value="beach">🏖️ Beach</option>
              <option value="scuba_diving">🤿 Scuba Diving</option>
              <option value="candle_light_dinner">🕯️ Candle Light Dinner</option>
              <option value="museum">🏛️ Museum</option>
              <option value="holy_places">🛕 Holy Places</option>
            </select>
            <select className="input-field w-auto" value={filters.maxCost} onChange={e => setFilters({ ...filters, maxCost: e.target.value })}>
              <option value="">Any Budget</option>
              <option value="20">Under $20</option>
              <option value="50">Under $50</option>
              <option value="100">Under $100</option>
            </select>
            <span className="flex items-center text-sm text-cream-500">{activities.length} activities found</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-cream-500">Loading activities...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.map(act => {
                const isAdded = added.has(act.id);
                return (
                  <div key={act.id} className={`rounded-2xl border p-5 transition-all ${isAdded ? 'border-mint-300 bg-mint-50' : `${TYPE_COLORS[act.type] || 'bg-cream-50 border-cream-200'} hover:shadow-card`}`}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-2xl">{TYPE_ICONS[act.type] || '📌'}</span>
                      {isAdded && <span className="badge-mint text-xs">✓ Added</span>}
                    </div>
                    <h3 className="font-display font-semibold text-mint-800 mb-2 leading-snug">{act.name}</h3>
                    {act.description && <p className="text-cream-500 text-xs mb-3 line-clamp-2">{act.description}</p>}
                    <div className="flex gap-3 text-xs text-cream-500 mb-4">
                      <span>💰 ${act.cost}</span>
                      <span>⏱ {act.duration}min</span>
                      <span>🏷 {(act.type || '').replace(/_/g, ' ')}</span>
                    </div>
                    <button
                      onClick={() => !isAdded && handleAdd(act.id)}
                      disabled={isAdded}
                      className={`w-full py-2 rounded-xl text-sm font-medium transition-all ${
                        isAdded ? 'bg-mint-100 text-mint-600 cursor-default' : 'bg-mint-500 text-white hover:bg-mint-600'
                      }`}
                    >
                      {isAdded ? '✓ Added to Stop' : 'Add to Stop'}
                    </button>
                  </div>
                );
              })}
              {activities.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-4xl mb-3">🎯</div>
                  <p className="text-cream-500 font-medium">No activities found for these filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}