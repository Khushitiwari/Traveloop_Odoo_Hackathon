
import prisma from '../config/db.js';

export const addStop = async (req, res) => {
  const { cityId, startDate, endDate, order } = req.body;
  const stop = await prisma.stop.create({
    data: { tripId: req.params.tripId, cityId, startDate: new Date(startDate), endDate: new Date(endDate), order },
    include: { city: true },
  });
  res.status(201).json(stop);
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

