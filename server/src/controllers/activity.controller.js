import prisma from '../config/db.js';

export const searchActivities = async (req, res) => {
  const { cityId, type, maxCost, q } = req.query;

  const activities = await prisma.activity.findMany({
    where: {
      ...(cityId ? { cityId } : {}),
      ...(type ? { type } : {}),
      ...(maxCost ? { cost: { lte: parseFloat(maxCost) } } : {}),
      ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
    },
    include: { city: { select: { id: true, name: true, country: true } } },
    orderBy: { name: 'asc' },
    take: 100,
  });

  res.json(activities);
};

export const getActivityById = async (req, res) => {
  const activity = await prisma.activity.findUnique({
    where: { id: req.params.id },
    include: { city: true },
  });

  if (!activity) return res.status(404).json({ message: 'Activity not found' });
  res.json(activity);
};
