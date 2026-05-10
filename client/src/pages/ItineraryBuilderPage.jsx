
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Sidebar from '../components/common/Sidebar';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import StopCard from '../components/trips/StopCard';
import toast from 'react-hot-toast';

export default function ItineraryBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState('');
  const [showAddStop, setShowAddStop] = useState(false);
  const [addingStop, setAddingStop] = useState(false);
  const [stopForm, setStopForm] = useState({ cityId: '', startDate: '', endDate: '' });
  const [activityModal, setActivityModal] = useState(null); // stopId
  const [activities, setActivities] = useState([]);
  const [showEditTrip, setShowEditTrip] = useState(false);
  const [updatingTrip, setUpdatingTrip] = useState(false);
  const [tripForm, setTripForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    coverPhoto: '',
    isPublic: false,
  });

  const fetchTrip = async () => {
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data);
    } catch {
      toast.error('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!trip) return;
    setTripForm({
      name: trip.name || '',
      description: trip.description || '',
      startDate: trip.startDate ? new Date(trip.startDate).toISOString().slice(0, 10) : '',
      endDate: trip.endDate ? new Date(trip.endDate).toISOString().slice(0, 10) : '',
      coverPhoto: trip.coverPhoto || '',
      isPublic: !!trip.isPublic,
    });
  }, [trip]);

  useEffect(() => { fetchTrip(); }, [id]);

  useEffect(() => {
    if (citySearch.length > 1) {
      api.get(`/cities?q=${citySearch}`).then(r => setCities(r.data));
    }
  }, [citySearch]);

  const handleAddStop = async (e) => {
    e.preventDefault();
    if (new Date(stopForm.endDate) < new Date(stopForm.startDate)) {
      toast.error('Departure date must be after arrival date');
      return;
    }
    setAddingStop(true);
    try {
      await api.post(`/trips/${id}/stops`, {
        ...stopForm,
      });
      toast.success('Stop added!');
      setShowAddStop(false);
      setStopForm({ cityId: '', startDate: '', endDate: '' });
      setCitySearch('');
      fetchTrip();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add stop');
    } finally {
      setAddingStop(false);
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!confirm('Remove this stop?')) return;
    try {
      await api.delete(`/trips/${id}/stops/${stopId}`);
      toast.success('Stop removed');
      fetchTrip();
    } catch {
      toast.error('Failed to remove stop');
    }
  };

  const openActivities = async (stopId, cityId) => {
    setActivityModal(stopId);
    const res = await api.get(`/cities/${cityId}/activities`);
    setActivities(res.data);
  };

  const addActivity = async (stopId, activityId) => {
    try {
      await api.post(`/trips/${id}/stops/${stopId}/activities`, { activityId });
      toast.success('Activity added!');
      fetchTrip();
    } catch {
      toast.error('Already added or failed');
    }
  };

  const removeActivity = async (stopId, saId) => {
    try {
      await api.delete(`/trips/${id}/stops/${stopId}/activities/${saId}`);
      fetchTrip();
    } catch { toast.error('Failed'); }
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    if (tripForm.startDate && tripForm.endDate && new Date(tripForm.endDate) < new Date(tripForm.startDate)) {
      toast.error('End date must be after start date');
      return;
    }
    setUpdatingTrip(true);
    try {
      await api.put(`/trips/${id}`, tripForm);
      toast.success('Trip details updated');
      setShowEditTrip(false);
      fetchTrip();
    } catch {
      toast.error('Failed to update trip');
    } finally {
      setUpdatingTrip(false);
    }
  };

  if (loading) return (
    <div className="layout-with-sidebar"><Sidebar /><main className="main-with-sidebar"><div className="page-content"><Loader /></div></main></div>
  );

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <button onClick={() => navigate('/trips')} className="text-cream-500 hover:text-cream-700 text-sm font-medium mb-2 flex items-center gap-1.5 transition-colors">
                ← My Trips
              </button>
              <h1 className="page-title mb-0">{trip?.name}</h1>
              <p className="text-cream-500 text-sm mt-1">
                {new Date(trip?.startDate).toLocaleDateString()} → {new Date(trip?.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setShowEditTrip(true)} className="btn-primary text-sm px-4 py-2">Edit Trip ✏️</button>
              <button onClick={() => navigate(`/trips/${id}/view`)} className="btn-secondary text-sm px-4 py-2">View Itinerary</button>
              <button onClick={() => navigate(`/trips/${id}/cities`)} className="btn-secondary text-sm px-4 py-2">City Search 🌆</button>
              {trip?.stops?.[0] && (
                <button
                  onClick={() => navigate(`/trips/${id}/activities/${trip.stops[0].id}`)}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Activity Search 🎯
                </button>
              )}
              <button onClick={() => navigate(`/trips/${id}/budget`)} className="btn-secondary text-sm px-4 py-2">Budget 💰</button>
              <button onClick={() => navigate(`/trips/${id}/budget`)} className="btn-primary text-sm px-4 py-2">Add Total Budget ➕</button>
              <button onClick={() => navigate(`/trips/${id}/checklist`)} className="btn-secondary text-sm px-4 py-2">Checklist 📋</button>
              <button onClick={() => navigate(`/trips/${id}/notes`)} className="btn-secondary text-sm px-4 py-2">Notes 📝</button>
            </div>
          </div>

          {/* Stops */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-heading mb-0">Trip Stops ({trip?.stops?.length || 0})</h2>
            <button onClick={() => setShowAddStop(true)} className="btn-primary text-sm px-4 py-2">+ Add Stop</button>
          </div>

          {trip?.stops?.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-cream-300 p-12 text-center mb-6">
              <div className="text-4xl mb-3">📍</div>
              <p className="font-display font-semibold text-mint-800 mb-2">No stops yet</p>
              <p className="text-cream-500 text-sm mb-4">Add your first city to start building your itinerary.</p>
              <button onClick={() => setShowAddStop(true)} className="btn-primary">Add First Stop</button>
            </div>
          ) : (
            <div className="space-y-4">
              {trip?.stops?.sort((a, b) => a.order - b.order).map((stop, idx) => (
                <StopCard
                  key={stop.id}
                  stop={stop}
                  index={idx}
                  onAddActivities={() => openActivities(stop.id, stop.cityId)}
                  onDelete={() => handleDeleteStop(stop.id)}
                  onRemoveActivity={(saId) => removeActivity(stop.id, saId)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Stop Modal */}
      <Modal isOpen={showAddStop} onClose={() => setShowAddStop(false)} title="Add a Stop">
        <form onSubmit={handleAddStop} className="space-y-4">
          <div>
            <label className="label">Search City</label>
            <input type="text" className="input-field" placeholder="Type a city name..." value={citySearch}
              onChange={e => { setCitySearch(e.target.value); setStopForm({ ...stopForm, cityId: '' }); }} />
            {cities.length > 0 && !stopForm.cityId && (
              <div className="mt-2 bg-white border border-cream-200 rounded-xl shadow-card max-h-48 overflow-auto">
                {cities.map(city => (
                  <button key={city.id} type="button"
                    className="w-full text-left px-4 py-2.5 hover:bg-mint-50 text-sm transition-colors flex items-center justify-between border-b border-cream-100 last:border-0"
                    onClick={() => { setStopForm({ ...stopForm, cityId: city.id }); setCitySearch(city.name); setCities([]); }}>
                    <span className="font-medium text-mint-800">{city.name}</span>
                    <span className="text-cream-400">{city.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Arrival Date</label>
              <input type="date" className="input-field" value={stopForm.startDate}
                onChange={e => setStopForm({ ...stopForm, startDate: e.target.value })} required />
            </div>
            <div>
              <label className="label">Departure Date</label>
              <input type="date" className="input-field" value={stopForm.endDate}
                onChange={e => setStopForm({ ...stopForm, endDate: e.target.value })} required />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAddStop(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={!stopForm.cityId || addingStop} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
              {addingStop ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              Add Stop
            </button>
          </div>
        </form>
      </Modal>

      {/* Activities Modal */}
      <Modal isOpen={!!activityModal} onClose={() => setActivityModal(null)} title="Add Activities" size="lg">
        {activities.length === 0 ? (
          <p className="text-cream-500 text-center py-6">No activities found for this city.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-auto">
            {activities.map(act => {
              const stop = trip?.stops?.find(s => s.id === activityModal);
              const added = stop?.stopActivities?.some(sa => sa.activityId === act.id);
              return (
                <div key={act.id} className={`border rounded-xl p-3.5 transition-all ${added ? 'border-mint-300 bg-mint-50' : 'border-cream-200 bg-white hover:border-mint-200'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-cream-800 mb-1">{act.name}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="badge-cream text-xs capitalize">{act.type}</span>
                        <span className="text-xs text-cream-500">${act.cost}</span>
                        <span className="text-xs text-cream-500">{act.duration}min</span>
                      </div>
                    </div>
                    <button
                      onClick={() => !added && addActivity(activityModal, act.id)}
                      disabled={added}
                      className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        added ? 'bg-mint-100 text-mint-600 cursor-default' : 'bg-mint-500 text-white hover:bg-mint-600'
                      }`}
                    >
                      {added ? '✓ Added' : 'Add'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Edit Trip Modal */}
      <Modal isOpen={showEditTrip} onClose={() => setShowEditTrip(false)} title="Edit Trip Details">
        <form onSubmit={handleUpdateTrip} className="space-y-4">
          <div>
            <label className="label">Trip Name *</label>
            <input
              type="text"
              className="input-field"
              value={tripForm.name}
              onChange={(e) => setTripForm({ ...tripForm, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={tripForm.description}
              onChange={(e) => setTripForm({ ...tripForm, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Start Date *</label>
              <input
                type="date"
                className="input-field"
                value={tripForm.startDate}
                onChange={(e) => setTripForm({ ...tripForm, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">End Date *</label>
              <input
                type="date"
                className="input-field"
                value={tripForm.endDate}
                onChange={(e) => setTripForm({ ...tripForm, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Cover Photo URL</label>
            <input
              type="text"
              className="input-field"
              value={tripForm.coverPhoto}
              onChange={(e) => setTripForm({ ...tripForm, coverPhoto: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <label className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              checked={tripForm.isPublic}
              onChange={(e) => setTripForm({ ...tripForm, isPublic: e.target.checked })}
            />
            <span className="text-sm text-cream-700">Make this trip public</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowEditTrip(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={updatingTrip} className="btn-primary flex-1 disabled:opacity-60">
              {updatingTrip ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}