import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Sidebar from '../components/common/Sidebar';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function PublicSharedTripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trips')
      .then((r) => setTrips(r.data.filter((t) => t.isPublic)))
      .catch(() => toast.error('Failed to load shared trips'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content">
          <div className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="page-title">Publicly Shared Trips</h1>
              <p className="page-subtitle">Open, copy, and manage your public itinerary links.</p>
            </div>
            <button onClick={() => navigate('/trips')} className="btn-secondary text-sm">← Back to My Trips</button>
          </div>

          {loading ? <Loader /> : trips.length === 0 ? (
            <div className="bg-white rounded-2xl border border-cream-300 p-10 text-center">
              <p className="text-mint-900 font-semibold mb-2">No public trips yet</p>
              <p className="text-cream-600 text-sm">Open any trip and enable public sharing to list it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trips.map((trip) => {
                const shareUrl = `${window.location.origin}/shared/${trip.shareToken}`;
                return (
                  <div key={trip.id} className="bg-white rounded-2xl border border-cream-200 p-5 shadow-card">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display font-semibold text-mint-900 text-lg">{trip.name}</h3>
                      <span className="badge-mint text-xs">Public</span>
                    </div>
                    <p className="text-cream-700 text-sm mt-1">
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                    <div className="mt-4 p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-cream-700 break-all">
                      {shareUrl}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => navigate(`/shared/${trip.shareToken}`)} className="btn-secondary text-sm flex-1">
                        Open Page
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(shareUrl);
                          toast.success('Public link copied');
                        }}
                        className="btn-primary text-sm flex-1"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
