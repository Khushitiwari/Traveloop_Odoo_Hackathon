

import prisma from '../config/db.js';

export const searchCities = async (req, res) => {
  const { q, region } = req.query;
  const cities = await prisma.city.findMany({
    where: {
      AND: [
        q ? { name: { contains: q, mode: 'insensitive' } } : {},
        region ? { region: { contains: region, mode: 'insensitive' } } : {},
      ],
    },
    include: { _count: { select: { stops: true } } },
    orderBy: { popularity: 'desc' },
    take: 20,
  });
  res.json(cities);
};

export const getActivitiesByCity = async (req, res) => {
  const { type, maxCost } = req.query;
  const activities = await prisma.activity.findMany({
    where: {
      cityId: req.params.cityId,
      ...(type ? { type } : {}),
      ...(maxCost ? { cost: { lte: parseFloat(maxCost) } } : {}),
    },
  });
  res.json(activities);
};

