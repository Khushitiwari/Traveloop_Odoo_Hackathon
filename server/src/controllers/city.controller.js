

import prisma from '../config/db.js';

const DEFAULT_CITIES = [
  { name: 'Paris', country: 'France', region: 'Europe', costIndex: 1.9, popularity: 95, description: 'City of lights, art, and iconic architecture.' },
  { name: 'Rome', country: 'Italy', region: 'Europe', costIndex: 1.6, popularity: 88, description: 'Ancient ruins, piazzas, and incredible cuisine.' },
  { name: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 2.1, popularity: 96, description: 'Futuristic city blended with rich traditions.' },
  { name: 'Bangkok', country: 'Thailand', region: 'Asia', costIndex: 1.2, popularity: 89, description: 'Street food, temples, and vibrant nightlife.' },
  { name: 'New York', country: 'USA', region: 'Americas', costIndex: 2.3, popularity: 94, description: 'Skylines, museums, and iconic neighborhoods.' },
  { name: 'Rio de Janeiro', country: 'Brazil', region: 'Americas', costIndex: 1.4, popularity: 84, description: 'Beaches, samba culture, and scenic mountains.' },
  { name: 'Cape Town', country: 'South Africa', region: 'Africa', costIndex: 1.3, popularity: 82, description: 'Coastlines, mountains, and vineyards nearby.' },
  { name: 'Marrakech', country: 'Morocco', region: 'Africa', costIndex: 1.1, popularity: 80, description: 'Souks, riads, and colorful old-city charm.' },
  { name: 'Sydney', country: 'Australia', region: 'Oceania', costIndex: 2.0, popularity: 91, description: 'Harbour views, beaches, and laid-back vibes.' },
  { name: 'Auckland', country: 'New Zealand', region: 'Oceania', costIndex: 1.8, popularity: 79, description: 'Waterfront city with easy nature escapes.' },
];

let bootstrapped = false;

const bootstrapCityDataIfNeeded = async () => {
  if (bootstrapped) return;

  const existingCount = await prisma.city.count();
  if (existingCount === 0) {
    await prisma.city.createMany({ data: DEFAULT_CITIES });
  }

  const allCities = await prisma.city.findMany({ select: { id: true, name: true } });
  for (const city of allCities) {
    const activityCount = await prisma.activity.count({ where: { cityId: city.id } });
    if (activityCount > 0) continue;

    await prisma.activity.createMany({
      data: [
        {
          name: `${city.name} Walking Tour`,
          description: `Guided highlights tour across ${city.name}.`,
          type: 'sightseeing',
          cost: 25,
          duration: 120,
          cityId: city.id,
        },
        {
          name: `${city.name} Food Experience`,
          description: `Taste local flavors and iconic dishes in ${city.name}.`,
          type: 'food',
          cost: 35,
          duration: 90,
          cityId: city.id,
        },
      ],
    });
  }

  bootstrapped = true;
};

export const searchCities = async (req, res) => {
  const { q, region } = req.query;
  await bootstrapCityDataIfNeeded();
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
  await bootstrapCityDataIfNeeded();
  const activities = await prisma.activity.findMany({
    where: {
      cityId: req.params.cityId,
      ...(type ? { type } : {}),
      ...(maxCost ? { cost: { lte: parseFloat(maxCost) } } : {}),
    },
  });
  res.json(activities);
};

