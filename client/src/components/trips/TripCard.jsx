
import { useNavigate } from 'react-router-dom';
import { formatShort, tripDuration } from '../../utils/formatDate';
import { useTrip } from '../../context/TripContext';
import toast from 'react-hot-toast';

export default function TripCard({ trip, onDelete }) {
  const navigate = useNavigate();
  const { deleteTrip } = useTrip();

  const duration = tripDuration(trip.startDate, trip.endDate);
  const cityCount = trip.stops?.length || 0;
  const isPast = new Date(trip.endDate) < new Date();
  const isUpcoming = new Date(trip.startDate) > new Date();

  const statusBadge = isPast
    ? { label: 'Past', cls: 'bg-cream-100 text-cream-500' }
    : isUpcoming
    ? { label: 'Upcoming', cls: 'bg-mint-100 text-mint-700' }
    : { label: 'Active', cls: 'bg-amber-100 text-amber-700' };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm(`Delete "${trip.name}"?`)) return;
    try {
      await deleteTrip(trip.id);
      onDelete?.(trip.id);
      toast.success('Trip deleted');
    } catch {
      toast.error('Failed to delete trip');
    }
  };

  return (
    <div
      onClick={() => navigate(`/trips/${trip.id}/view`)}
      className="bg-white rounded-2xl border border-cream-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      {/* Cover */}
      <div className="h-28 bg-gradient-to-br from-mint-100 to-mint-200 relative overflow-hidden">
        {trip.coverPhoto ? (
          <img
            src={trip.coverPhoto}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">🗺️</div>
        )}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusBadge.cls}`}>
          {statusBadge.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-mint-900 truncate mb-1">{trip.name}</h3>

        <div className="flex items-center gap-3 text-xs text-cream-500 mb-3">
          <span>📅 {formatShort(trip.startDate)} – {formatShort(trip.endDate)}</span>
          <span>·</span>
          <span>{duration}d</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {trip.stops?.slice(0, 3).map((stop) => (
            <span
              key={stop.id}
              className="px-2 py-0.5 bg-cream-100 text-cream-600 rounded-lg text-xs font-medium"
            >
              {stop.city?.name}
            </span>
          ))}
          {cityCount > 3 && (
            <span className="text-xs text-cream-400">+{cityCount - 3}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip.id}/builder`); }}
            className="flex-1 py-1.5 text-xs font-medium text-mint-700 bg-mint-50 rounded-lg hover:bg-mint-100 transition-colors border border-mint-200"
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip.id}/budget`); }}
            className="flex-1 py-1.5 text-xs font-medium text-cream-600 bg-cream-50 rounded-lg hover:bg-cream-100 transition-colors border border-cream-200"
          >
            Budget
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip.id}/notes`); }}
            className="flex-1 py-1.5 text-xs font-medium text-mint-700 bg-mint-50 rounded-lg hover:bg-mint-100 transition-colors border border-mint-200"
          >
            Notes
          </button>
          {trip.isPublic && trip.shareToken && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/shared/${trip.shareToken}`); }}
              className="py-1.5 px-2 text-xs font-medium text-mint-700 bg-mint-50 rounded-lg hover:bg-mint-100 transition-colors border border-mint-200"
              title="Open shared itinerary"
            >
              🔗
            </button>
          )}
          <button
            onClick={handleDelete}
            className="py-1.5 px-2 text-xs font-medium text-blush-500 bg-blush-50 rounded-lg hover:bg-blush-100 transition-colors border border-blush-200"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}