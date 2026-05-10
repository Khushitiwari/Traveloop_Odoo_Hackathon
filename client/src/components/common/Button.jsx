
const VARIANTS = {
  primary: 'bg-mint-500 text-white hover:bg-mint-600 border border-mint-600 shadow-md hover:shadow-lg hover:-translate-y-0.5',
  secondary: 'bg-white text-mint-700 hover:bg-mint-50 border border-mint-300 hover:border-mint-400',
  danger: 'bg-blush-100 text-blush-700 hover:bg-blush-200 border border-blush-300',
  ghost: 'text-mint-600 hover:bg-mint-50 border border-transparent hover:-translate-y-0.5',
  outline: 'bg-transparent text-mint-700 border border-mint-400 hover:bg-mint-50 hover:border-mint-500',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-95
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${className}
      `}
      {...rest}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}