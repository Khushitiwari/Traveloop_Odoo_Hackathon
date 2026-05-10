
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Sidebar from '../components/common/Sidebar';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const TYPE_ICONS = { sightseeing: '👁️', food: '🍽️', adventure: '🏃', shopping: '🛍️' };
const TYPE_COLORS = {
  sightseeing: 'bg-amber-50 border-amber-200 text-amber-700',
  food: 'bg-blush-50 border-blush-200 text-blush-700',
  adventure: 'bg-mint-50 border-mint-200 text-mint-700',
  shopping: 'bg-purple-50 border-purple-200 text-purple-700',
};

export default function ItineraryViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(r => setTrip(r.data))
      .catch(() => toast.error('Failed to load trip'))
      .finally(() => setLoading(false));
  }, [id]);

  const copyShare = () => {
    const url = `${window.location.origin}/shared/${trip.shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied!');
  };

  const totalActivitiesCost = trip?.stops?.reduce((sum, s) =>
    sum + s.stopActivities?.reduce((ss, sa) => ss + (sa.activity?.cost || 0), 0), 0) || 0;

  if (loading) return (
    <div className="layout-with-sidebar"><Sidebar /><main className="main-with-sidebar"><div className="page-content"><Loader /></div></main></div>
  );

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <button onClick={() => navigate(`/trips/${id}/builder`)} className="text-cream-500 hover:text-cream-700 text-sm font-medium mb-2 flex items-center gap-1.5 transition-colors">
                ← Builder
              </button>
              <h1 className="page-title mb-0">{trip?.name}</h1>
              <p className="text-cream-500 text-sm mt-1">
                {new Date(trip?.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} →{' '}
                {new Date(trip?.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {trip?.isPublic && trip?.shareToken && (
                <button onClick={copyShare} className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${copied ? 'bg-mint-500 text-white' : 'btn-secondary'}`}>
                  {copied ? '✓ Copied!' : '🔗 Share'}
                </button>
              )}
              <div className="flex rounded-xl border border-cream-200 overflow-hidden bg-white">
                {['timeline', 'list'].map(m => (
                  <button key={m} onClick={() => setViewMode(m)}
                    className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${viewMode === m ? 'bg-mint-500 text-white' : 'text-cream-500 hover:bg-cream-50'}`}>
                    {m === 'timeline' ? '📅 Timeline' : '📋 List'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Stops', value: trip?.stops?.length || 0, icon: '📍' },
              { label: 'Activities', value: trip?.stops?.reduce((s, stop) => s + (stop.stopActivities?.length || 0), 0) || 0, icon: '🎯' },
              { label: 'Activities Cost', value: `$${totalActivitiesCost.toFixed(0)}`, icon: '💰' },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-xl border border-cream-200 p-3 text-center">
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="font-display font-semibold text-mint-800 text-lg">{item.value}</div>
                <div className="text-xs text-cream-500">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Stops */}
          {trip?.stops?.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-cream-300 p-12 text-center">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="font-display font-semibold text-mint-800 mb-2">No stops planned yet</p>
              <button onClick={() => navigate(`/trips/${id}/builder`)} className="btn-primary mt-2">Go to Builder</button>
            </div>
          ) : (
            <div className={viewMode === 'timeline' ? 'space-y-0' : 'space-y-4'}>
              {trip?.stops?.sort((a, b) => a.order - b.order).map((stop, idx) => (
                <div key={stop.id} className={viewMode === 'timeline' ? 'flex gap-4' : ''}>
                  {/* Timeline indicator */}
                  {viewMode === 'timeline' && (
                    <div className="flex flex-col items-center flex-shrink-0 w-8">
                      <div className="w-8 h-8 rounded-full bg-mint-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{idx + 1}</div>
                      {idx < (trip.stops.length - 1) && <div className="w-0.5 flex-1 bg-mint-200 mt-1 mb-1 min-h-[2rem]" />}
                    </div>
                  )}

                  {/* Stop card */}
                  <div className={`bg-white rounded-2xl shadow-card ${viewMode === 'timeline' ? 'flex-1 mb-4' : ''} p-5`}>
                    <div className="flex items-center gap-3 mb-4">
                      {viewMode === 'list' && (
                        <div className="w-8 h-8 rounded-full bg-mint-100 flex items-center justify-center text-mint-700 font-bold text-sm">{idx + 1}</div>
                      )}
                      <div>
                        <h3 className="font-display font-semibold text-mint-800 text-lg">{stop.city?.name}</h3>
                        <p className="text-cream-500 text-xs">
                          {stop.city?.country} · {new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(stop.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      {stop.city?.costIndex && (
                        <span className="ml-auto badge-mint text-xs">💰 Cost ×{stop.city.costIndex}</span>
                      )}
                    </div>

                    {stop.stopActivities?.length === 0 ? (
                      <p className="text-cream-400 text-sm italic">No activities for this stop.</p>
                    ) : (
                      <div className="space-y-2">
                        {stop.stopActivities.map(sa => (
                          <div key={sa.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${TYPE_COLORS[sa.activity?.type] || 'bg-cream-50 border-cream-200 text-cream-700'}`}>
                            <span className="text-base">{TYPE_ICONS[sa.activity?.type] || '📌'}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{sa.activity?.name}</p>
                              <p className="text-xs opacity-70">{sa.activity?.duration}min · ${sa.activity?.cost}</p>
                            </div>
                            <span className="text-xs font-medium opacity-70 capitalize">{sa.activity?.type}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}