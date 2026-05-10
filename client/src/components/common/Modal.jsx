
import { useEffect } from 'react';

export default function Modal({
  isOpen,
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  size,
}) {
  const visible = typeof isOpen === 'boolean' ? isOpen : !!open;
  const widthClass = size === 'lg' ? 'max-w-3xl' : maxWidth;

  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-mint-900/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${widthClass} bg-white rounded-2xl shadow-xl border border-cream-200 animate-slide-up overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h2 className="font-display font-semibold text-mint-900 text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cream-400 hover:bg-cream-100 hover:text-mint-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}