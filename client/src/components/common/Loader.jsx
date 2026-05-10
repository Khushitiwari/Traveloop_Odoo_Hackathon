
export default function Loader({ size = 'md', text = 'Loading...' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div
        className={`${sizes[size]} border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin`}
      />
      {text && <p className="text-cream-500 text-sm">{text}</p>}
    </div>
  );
}