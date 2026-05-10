const TYPE_ICONS = { sightseeing: '👁️', food: '🍽️', adventure: '🏃', shopping: '🛍️' };

export default function ActivityBlock({ activity }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border bg-cream-50 border-cream-200 text-cream-700">
      <span className="text-base">{TYPE_ICONS[activity?.type] || '📌'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{activity?.name}</p>
        <p className="text-xs opacity-70">{activity?.duration}min · ${activity?.cost}</p>
      </div>
      <span className="text-xs font-medium opacity-70 capitalize">{activity?.type}</span>
    </div>
  );
}
