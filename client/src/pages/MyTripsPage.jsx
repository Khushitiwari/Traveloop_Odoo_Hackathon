
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Sidebar from '../components/common/Sidebar';
import TripCard from '../components/trips/TripCard';
import Loader from '../components/common/Loader';

export default function MyTripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/trips').then(r => setTrips(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const filtered = trips.filter(t => {
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'upcoming') return start > now;
    if (filter === 'active') return start <= now && end >= now;
    if (filter === 'past') return end < now;
    return true;
  });

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="page-title">My Trips</h1>
              <p className="page-subtitle">All your travel adventures in one place.</p>
            </div>
            <button onClick={() => navigate('/trips/new')} className="btn-primary">
              + New Trip
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Search trips..."
              className="input-field sm:w-64"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="flex gap-2">
              {['all', 'upcoming', 'active', 'past'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                    filter === f ? 'bg-mint-500 text-white' : 'bg-white text-cream-600 border border-cream-200 hover:border-mint-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <p className="text-sm text-cream-500 mb-4">{filtered.length} trip{filtered.length !== 1 ? 's' : ''}</p>

          {/* Grid */}
          {loading ? <Loader /> : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-cream-300 p-16 text-center">
              <div className="text-5xl mb-4">🗺️</div>
              <p className="text-lg font-display font-semibold text-mint-800 mb-2">
                {search ? 'No trips found' : 'No trips yet'}
              </p>
              <p className="text-cream-500 text-sm mb-6">
                {search ? 'Try a different search term.' : 'Start planning your first adventure!'}
              </p>
              {!search && <button onClick={() => navigate('/trips/new')} className="btn-primary">Plan Your First Trip</button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(trip => (
                <TripCard key={trip.id} trip={trip} onDelete={id => setTrips(prev => prev.filter(t => t.id !== id))} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}