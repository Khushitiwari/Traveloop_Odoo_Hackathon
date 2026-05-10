
import { useEffect } from 'react';
import { useTrip } from '../context/TripContext';

/**
 * useTrips – fetches all trips on mount and exposes trip state + actions.
 * Pass `autoFetch: false` to skip initial fetch (e.g. when data is already loaded).
 */
export const useTrips = ({ autoFetch = true } = {}) => {
  const ctx = useTrip();

  useEffect(() => {
    if (autoFetch) ctx.fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  const upcomingTrips = ctx.trips.filter((t) => new Date(t.startDate) > new Date());
  const pastTrips = ctx.trips.filter((t) => new Date(t.endDate) < new Date());

  return { ...ctx, upcomingTrips, pastTrips };
};

export default useTrips;