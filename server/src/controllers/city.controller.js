

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

const buildActivityCatalog = (city) => {
  const base = [
    {
      name: `${city.name} Beach Day`,
      description: `Relax and unwind at a top beach spot near ${city.name}.`,
      type: 'beach',
      cost: 15,
      duration: 240,
      cityId: city.id,
    },
    {
      name: `${city.name} Scuba Diving Session`,
      description: `Beginner-friendly scuba diving with a certified guide.`,
      type: 'scuba_diving',
      cost: 90,
      duration: 180,
      cityId: city.id,
    },
    {
      name: `${city.name} Candle Light Dinner`,
      description: `Romantic dining experience with local cuisine.`,
      type: 'candle_light_dinner',
      cost: 60,
      duration: 120,
      cityId: city.id,
    },
    {
      name: `${city.name} Museum Visit`,
      description: `Explore art, history, and culture in a top museum.`,
      type: 'museum',
      cost: 20,
      duration: 120,
      cityId: city.id,
    },
    {
      name: `${city.name} Holy Places Trail`,
      description: `Visit spiritual and heritage landmarks in and around the city.`,
      type: 'holy_places',
      cost: 10,
      duration: 150,
      cityId: city.id,
    },
    {
      name: `${city.name} Adventure Park`,
      description: `Thrilling day with zipline, ATV, and outdoor challenges.`,
      type: 'adventure',
      cost: 55,
      duration: 180,
      cityId: city.id,
    },
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
  ];

  const regionSpecials = {
    Europe: [
      { name: `${city.name} Heritage Museum Circuit`, description: 'Curated museum and old-town pass.', type: 'museum', cost: 28, duration: 180, cityId: city.id },
      { name: `${city.name} Cathedral & Basilica Walk`, description: 'Iconic holy places and historic architecture.', type: 'holy_places', cost: 18, duration: 140, cityId: city.id },
    ],
    Asia: [
      { name: `${city.name} Temple and Shrine Tour`, description: 'Sacred places with local storytelling guide.', type: 'holy_places', cost: 16, duration: 150, cityId: city.id },
      { name: `${city.name} Night Market Food Trail`, description: 'Budget-friendly street food tasting walk.', type: 'food', cost: 18, duration: 100, cityId: city.id },
    ],
    Americas: [
      { name: `${city.name} Waterfront Adventure Combo`, description: 'Kayaking, cliff walk, and coastal viewpoints.', type: 'adventure', cost: 65, duration: 200, cityId: city.id },
      { name: `${city.name} Museum Mile Pass`, description: 'Multiple museum access in one day.', type: 'museum', cost: 26, duration: 160, cityId: city.id },
    ],
    Africa: [
      { name: `${city.name} Desert Adventure Trail`, description: 'Guided off-road and dune experience.', type: 'adventure', cost: 50, duration: 180, cityId: city.id },
      { name: `${city.name} Cultural Heritage Museum`, description: 'Regional history and craft exhibits.', type: 'museum', cost: 14, duration: 110, cityId: city.id },
    ],
    Oceania: [
      { name: `${city.name} Reef Discovery Dive`, description: 'Scuba and reef safety intro with equipment.', type: 'scuba_diving', cost: 95, duration: 170, cityId: city.id },
      { name: `${city.name} Sunset Beach Picnic`, description: 'Low-cost beachside evening with scenic views.', type: 'beach', cost: 12, duration: 140, cityId: city.id },
    ],
  };

  return [...base, ...(regionSpecials[city.region] || [])];
};

const bootstrapCityDataIfNeeded = async () => {
  if (bootstrapped) return;

  const existingCount = await prisma.city.count();
  if (existingCount === 0) {
    await prisma.city.createMany({ data: DEFAULT_CITIES });
  }

  const allCities = await prisma.city.findMany({ select: { id: true, name: true, region: true } });
  for (const city of allCities) {
    const activityCount = await prisma.activity.count({ where: { cityId: city.id } });
    if (activityCount > 0) continue;

    await prisma.activity.createMany({ data: buildActivityCatalog(city) });
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

