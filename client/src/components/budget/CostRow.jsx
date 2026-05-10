export default function CostRow({ icon, label, value, currency = 'USD' }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-cream-600">{label}</span>
      </div>
      <span className="font-medium text-cream-800">
        {currency} {Number(value || 0).toLocaleString()}
      </span>
    </div>
  );
}
