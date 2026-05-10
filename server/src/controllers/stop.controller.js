
import prisma from '../config/db.js';

export const addStop = async (req, res) => {
  try {
    const { cityId, startDate, endDate, order } = req.body;

    if (!cityId || !startDate || !endDate) {
      return res.status(400).json({ message: 'City and dates are required.' });
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'Departure date must be after arrival date.' });
    }

    const trip = await prisma.trip.findFirst({
      where: { id: req.params.tripId, userId: req.user.userId },
      select: { id: true },
    });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const maxOrderStop = await prisma.stop.findFirst({
      where: { tripId: req.params.tripId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const nextOrder = Number.isFinite(order) ? Number(order) : (maxOrderStop?.order || 0) + 1;

    const stop = await prisma.stop.create({
      data: {
        tripId: req.params.tripId,
        cityId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        order: nextOrder,
      },
      include: { city: true },
    });
    res.status(201).json(stop);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to add stop' });
  }
};

export const updateStop = async (req, res) => {
  const { startDate, endDate, order } = req.body;
  const stop = await prisma.stop.update({
    where: { id: req.params.stopId },
    data: { startDate: new Date(startDate), endDate: new Date(endDate), order },
  });
  res.json(stop);
};

export const deleteStop = async (req, res) => {
  await prisma.stop.delete({ where: { id: req.params.stopId } });
  res.json({ message: 'Stop removed' });
};

export const addActivityToStop = async (req, res) => {
  const { activityId, scheduledAt, notes } = req.body;
  const sa = await prisma.stopActivity.create({
    data: { stopId: req.params.stopId, activityId, scheduledAt: scheduledAt ? new Date(scheduledAt) : null, notes },
    include: { activity: true },
  });
  res.status(201).json(sa);
};

export const removeActivityFromStop = async (req, res) => {
  await prisma.stopActivity.delete({ where: { id: req.params.saId } });
  res.json({ message: 'Activity removed' });
};

