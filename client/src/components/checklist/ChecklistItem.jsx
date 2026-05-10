import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export default function ChecklistItem({ item, tripId, onUpdate, onDelete }) {
  const toggle = async () => {
    try {
      const res = await api.patch(`/trips/${tripId}/checklist/${item.id}/toggle`);
      onUpdate?.(res.data);
    } catch {
      toast.error('Failed to update item');
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/trips/${tripId}/checklist/${item.id}`);
      onDelete?.(item.id);
    } catch {
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="flex items-center gap-3 bg-cream-50 border border-cream-200 rounded-xl px-3 py-2.5">
      <button
        onClick={toggle}
        className={`w-5 h-5 rounded border flex-shrink-0 ${item.isPacked ? 'bg-mint-500 border-mint-500' : 'border-cream-300 bg-white'}`}
      >
        {item.isPacked ? <span className="text-white text-xs">✓</span> : null}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${item.isPacked ? 'line-through text-cream-400' : 'text-cream-800'}`}>{item.label}</p>
        <p className="text-xs text-cream-400 capitalize">{item.category}</p>
      </div>
      <button onClick={remove} className="text-xs text-blush-500 hover:text-blush-700">
        Delete
      </button>
    </div>
  );
}
