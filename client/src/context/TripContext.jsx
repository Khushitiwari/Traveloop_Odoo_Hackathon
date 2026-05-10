
import { createContext, useContext, useState, useCallback } from 'react';
import { tripsApi } from '../api/trips.api';
import { stopsApi } from '../api/stops.api';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tripsApi.getAll();
      setTrips(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrip = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await tripsApi.getById(id);
      setCurrentTrip(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTrip = async (data) => {
    const res = await tripsApi.create(data);
    setTrips((prev) => [...prev, res.data]);
    return res.data;
  };

  const updateTrip = async (id, data) => {
    const res = await tripsApi.update(id, data);
    setTrips((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    if (currentTrip?.id === id) setCurrentTrip(res.data);
    return res.data;
  };

  const deleteTrip = async (id) => {
    await tripsApi.delete(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (currentTrip?.id === id) setCurrentTrip(null);
  };

  const addStop = async (tripId, data) => {
    const res = await stopsApi.add(tripId, data);
    setCurrentTrip((prev) =>
      prev ? { ...prev, stops: [...(prev.stops || []), res.data] } : prev
    );
    return res.data;
  };

  const updateStop = async (tripId, stopId, data) => {
    const res = await stopsApi.update(tripId, stopId, data);
    setCurrentTrip((prev) =>
      prev
        ? { ...prev, stops: prev.stops.map((s) => (s.id === stopId ? res.data : s)) }
        : prev
    );
    return res.data;
  };

  const removeStop = async (tripId, stopId) => {
    await stopsApi.delete(tripId, stopId);
    setCurrentTrip((prev) =>
      prev ? { ...prev, stops: prev.stops.filter((s) => s.id !== stopId) } : prev
    );
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        loading,
        fetchTrips,
        fetchTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        addStop,
        updateStop,
        removeStop,
        setCurrentTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used inside TripProvider');
  return ctx;
};

export default TripContext;