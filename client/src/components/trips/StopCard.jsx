import { PlusCircle, Trash2, Utensils, Mountain, Landmark, Waves, Sparkles } from 'lucide-react';

export default function StopCard({ stop, index, onAddActivities, onDelete, onRemoveActivity }) {
  const activityIcon = (type) => {
    if (type === 'food' || type === 'candle_light_dinner') return Utensils;
    if (type === 'adventure' || type === 'scuba_diving') return Mountain;
    if (type === 'museum' || type === 'holy_places') return Landmark;
    if (type === 'beach') return Waves;
    return Sparkles;
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-mint-100 flex items-center justify-center text-mint-700 font-bold text-sm flex-shrink-0">
            {index + 1}
          </div>
          <div>
            <h3 className="font-display font-semibold text-mint-800 text-lg">{stop.city?.name}</h3>
            <p className="text-cream-500 text-xs">
              {stop.city?.country} · {new Date(stop.startDate).toLocaleDateString()} – {new Date(stop.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onAddActivities} className="text-xs text-mint-600 font-medium hover:text-mint-800 bg-mint-50 hover:bg-mint-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5">
            <PlusCircle size={14} />
            Activities
          </button>
          <button onClick={onDelete} className="text-xs text-blush-500 font-medium hover:text-blush-700 bg-blush-50 hover:bg-blush-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5">
            <Trash2 size={14} />
            Remove
          </button>
        </div>
      </div>

      {stop.stopActivities?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {stop.stopActivities.map((sa) => (
            <div key={sa.id} className="flex items-center gap-2.5 bg-cream-50 rounded-xl px-3 py-2.5 border border-cream-200">
              <span className="text-lg">
                {(() => {
                  const Icon = activityIcon(sa.activity?.type);
                  return <Icon size={18} className="text-mint-700" />;
                })()}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cream-800 truncate">{sa.activity?.name}</p>
                <p className="text-xs text-cream-500">${sa.activity?.cost} · {sa.activity?.duration}min</p>
              </div>
              <button onClick={() => onRemoveActivity?.(sa.id)} className="text-blush-400 hover:text-blush-600 text-lg leading-none">
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-cream-400 text-sm italic mt-2">No activities added yet.</p>
      )}
    </div>
  );
}
