
import { format, formatDistance, differenceInDays, parseISO, isValid } from 'date-fns';

/**
 * Safe parse: accepts Date, ISO string, or timestamp.
 */
const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = typeof value === 'string' ? parseISO(value) : new Date(value);
  return isValid(d) ? d : null;
};

/** "May 10, 2026" */
export const formatLong = (value) => {
  const d = toDate(value);
  return d ? format(d, 'MMMM d, yyyy') : '—';
};

/** "10 May" */
export const formatShort = (value) => {
  const d = toDate(value);
  return d ? format(d, 'd MMM') : '—';
};

/** "May 10" */
export const formatMonthDay = (value) => {
  const d = toDate(value);
  return d ? format(d, 'MMM d') : '—';
};

/** "10 May – 20 May 2026" */
export const formatRange = (start, end) =>
  `${formatShort(start)} – ${formatLong(end)}`;

/** Number of days between two dates (inclusive) */
export const tripDuration = (start, end) => {
  const s = toDate(start);
  const e = toDate(end);
  if (!s || !e) return 0;
  return differenceInDays(e, s) + 1;
};

/** "in 3 days" / "2 months ago" */
export const relativeTime = (value) => {
  const d = toDate(value);
  return d ? formatDistance(d, new Date(), { addSuffix: true }) : '—';
};

/** "Mon, 10 May" */
export const formatWeekday = (value) => {
  const d = toDate(value);
  return d ? format(d, 'EEE, d MMM') : '—';
};

export default { formatLong, formatShort, formatMonthDay, formatRange, tripDuration, relativeTime, formatWeekday };