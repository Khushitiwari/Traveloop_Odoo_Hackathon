import DayBlock from './DayBlock';

export default function ItineraryTimeline({ stops = [] }) {
  if (!stops.length) {
    return <p className="text-cream-400 text-sm italic">No stops planned yet.</p>;
  }

  return (
    <div className="space-y-4">
      {stops
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((stop, idx) => (
          <DayBlock key={stop.id} stop={stop} index={idx} />
        ))}
    </div>
  );
}
