
import { useForm } from 'react-hook-form';
import Button from '../common/Button';

export default function TripForm({ defaultValues = {}, onSubmit, loading = false, submitLabel = 'Save Trip' }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const inputClass = (err) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm bg-cream-50 text-mint-900 placeholder:text-cream-400 outline-none transition-colors focus:bg-white focus:border-mint-400 focus:ring-2 focus:ring-mint-100 ${
      err ? 'border-blush-400' : 'border-cream-300'
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Trip name */}
      <div>
        <label className="block text-sm font-medium text-mint-800 mb-1.5">Trip Name *</label>
        <input
          {...register('name', { required: 'Trip name is required' })}
          placeholder="e.g. Europe Summer 2026"
          className={inputClass(errors.name)}
        />
        {errors.name && <p className="text-xs text-blush-500 mt-1">{errors.name.message}</p>}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-mint-800 mb-1.5">Start Date *</label>
          <input
            type="date"
            {...register('startDate', { required: 'Start date is required' })}
            className={inputClass(errors.startDate)}
          />
          {errors.startDate && <p className="text-xs text-blush-500 mt-1">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-mint-800 mb-1.5">End Date *</label>
          <input
            type="date"
            {...register('endDate', { required: 'End date is required' })}
            className={inputClass(errors.endDate)}
          />
          {errors.endDate && <p className="text-xs text-blush-500 mt-1">{errors.endDate.message}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-mint-800 mb-1.5">Description</label>
        <textarea
          {...register('description')}
          placeholder="Tell us about this trip..."
          rows={3}
          className={`${inputClass(false)} resize-none`}
        />
      </div>

      {/* Cover photo */}
      <div>
        <label className="block text-sm font-medium text-mint-800 mb-1.5">Cover Photo URL</label>
        <input
          {...register('coverPhoto')}
          placeholder="https://..."
          className={inputClass(false)}
        />
      </div>

      {/* Public toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div className="relative">
          <input type="checkbox" {...register('isPublic')} className="sr-only peer" />
          <div className="w-10 h-6 bg-cream-200 rounded-full peer-checked:bg-mint-400 transition-colors" />
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
        </div>
        <span className="text-sm text-mint-800 font-medium">Make trip public (shareable link)</span>
      </label>

      <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
        {submitLabel}
      </Button>
    </form>
  );
}