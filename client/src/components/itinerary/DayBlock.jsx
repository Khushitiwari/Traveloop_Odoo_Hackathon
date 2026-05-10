import ActivityBlock from './ActivityBlock';

export default function DayBlock({ stop, index }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-mint-100 flex items-center justify-center text-mint-700 font-bold text-sm">{index + 1}</div>
        <div>
          <h3 className="font-display font-semibold text-mint-800 text-lg">{stop.city?.name}</h3>
          <p className="text-cream-500 text-xs">
            {new Date(stop.startDate).toLocaleDateString()} – {new Date(stop.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {stop.stopActivities?.length > 0 ? (
        <div className="space-y-2">
          {stop.stopActivities.map((sa) => (
            <ActivityBlock key={sa.id} activity={sa.activity} />
          ))}
        </div>
      ) : (
        <p className="text-cream-400 text-sm italic">No activities planned.</p>
      )}
    </div>
  );
}
