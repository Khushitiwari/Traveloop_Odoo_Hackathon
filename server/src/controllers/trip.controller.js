
import prisma from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const createTrip = async (req, res) => {
  const { name, description, startDate, endDate, isPublic, coverPhoto } = req.body;
  try {
    const trip = await prisma.trip.create({
      data: {
        name, description, startDate: new Date(startDate),
        endDate: new Date(endDate), isPublic: isPublic || false,
        coverPhoto, shareToken: isPublic ? uuidv4() : null,
        userId: req.user.userId,
      },
    });
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyTrips = async (req, res) => {
  const trips = await prisma.trip.findMany({
    where: { userId: req.user.userId },
    include: { stops: { include: { city: true } }, budget: true },
    orderBy: { startDate: 'asc' },
  });
  res.json(trips);
};

export const getTripById = async (req, res) => {
  const trip = await prisma.trip.findFirst({
    where: { id: req.params.id, userId: req.user.userId },
    include: {
      stops: {
        include: { city: true, stopActivities: { include: { activity: true } } },
        orderBy: { order: 'asc' },
      },
      budget: true,
      notes: true,
      checklists: true,
    },
  });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  res.json(trip);
};

export const updateTrip = async (req, res) => {
  const { name, description, startDate, endDate, isPublic, coverPhoto } = req.body;
  try {
    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: { name, description, startDate: new Date(startDate), endDate: new Date(endDate), isPublic, coverPhoto },
    });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTrip = async (req, res) => {
  await prisma.trip.delete({ where: { id: req.params.id } });
  res.json({ message: 'Trip deleted' });
};

export const getSharedTrip = async (req, res) => {
  const trip = await prisma.trip.findUnique({
    where: { shareToken: req.params.token },
    include: {
      stops: {
        include: { city: true, stopActivities: { include: { activity: true } } },
        orderBy: { order: 'asc' },
      },
      user: { select: { name: true, photo: true } },
    },
  });
  if (!trip || !trip.isPublic) return res.status(404).json({ message: 'Not found' });
  res.json(trip);
};

