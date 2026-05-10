import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import Loader from '../components/common/Loader';

const TYPE_ICONS = { sightseeing: '👁️', food: '🍽️', adventure: '🏃', shopping: '🛍️' };

export default function SharedItineraryPage() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/trips/shared/${token}`)
      .then(r => setTrip(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <Loader message="Loading shared itinerary..." />
    </div>
  );

  if (error || !trip) return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center text-center p-8">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-display font-semibold text-mint-800 mb-2">Itinerary Not Found</h1>
      <p className="text-cream-500">This itinerary may have been made private or the link has changed.</p>
    </div>
  );

  const totalCost = trip.stops?.reduce((s, stop) => s + stop.stopActivities?.reduce((ss, sa) => ss + (sa.activity?.cost || 0), 0), 0) || 0;

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero */}
      <div className="bg-gradient-to-br from-mint-300 to-mint-200 text-mint-900 px-6 py-12 text-center border-b border-cream-200">
        <div className="max-w-2xl mx-auto">
          <p className="text-mint-700 text-sm font-medium mb-2">Shared Itinerary by {trip.user?.name}</p>
          <h1 className="text-4xl font-display font-bold mb-3">{trip.name}</h1>
          <p className="text-mint-800">
            {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} →{' '}
            {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{trip.stops?.length}</div>
              <div className="text-mint-700 text-sm">Stops</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{trip.stops?.reduce((s, st) => s + (st.stopActivities?.length || 0), 0)}</div>
              <div className="text-mint-700 text-sm">Activities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${totalCost}</div>
              <div className="text-mint-700 text-sm">Activities Cost</div>
            </div>
          </div>
        </div>
      </div>

      {/* Share button */}
      <div className="flex justify-center -mt-5 mb-8">
        <button
          onClick={() => { navigator.clipboard.writeText(window.location.href); }}
          className="bg-white shadow-card rounded-full px-6 py-2.5 text-sm font-medium text-mint-700 hover:shadow-card-hover transition-all flex items-center gap-2"
        >
          🔗 Copy Share Link
        </button>
      </div>

      {/* Stops */}
      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-0">
        {trip.stops?.sort((a, b) => a.order - b.order).map((stop, idx) => (
          <div key={stop.id} className="flex gap-4">
            <div className="flex flex-col items-center flex-shrink-0 w-8">
              <div className="w-8 h-8 rounded-full bg-mint-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{idx + 1}</div>
              {idx < (trip.stops.length - 1) && <div className="w-0.5 flex-1 bg-mint-200 mt-1 mb-1 min-h-[2rem]" />}
            </div>
            <div className="flex-1 mb-5">
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h2 className="font-display font-semibold text-mint-800 text-xl mb-1">{stop.city?.name}</h2>
                <p className="text-cream-500 text-sm mb-4">
                  {stop.city?.country} · {new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(stop.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                {stop.stopActivities?.length > 0 ? (
                  <div className="space-y-2">
                    {stop.stopActivities.map(sa => (
                      <div key={sa.id} className="flex items-center gap-2.5 bg-cream-50 rounded-xl px-3 py-2.5 border border-cream-200">
                        <span className="text-base">{TYPE_ICONS[sa.activity?.type] || '📌'}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-cream-800">{sa.activity?.name}</p>
                          <p className="text-xs text-cream-500">${sa.activity?.cost} · {sa.activity?.duration}min</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-cream-400 text-sm italic">No activities listed.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-cream-200">
        <p className="text-cream-500 text-sm">
          Made with <span className="text-blush-500">♥</span> using{' '}
          <span className="font-display font-semibold text-mint-600">Traveloop</span>
        </p>
      </div>
    </div>
  );
}