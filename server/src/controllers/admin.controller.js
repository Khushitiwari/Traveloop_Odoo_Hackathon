
import prisma from '../config/db.js'

export const getStats = async (req, res) => {
  const [userCount, tripCount, topCities] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.city.findMany({
      take: 5,
      orderBy: { stops: { _count: 'desc' } },
      include: { _count: { select: { stops: true } } },
    }),
  ]);
  res.json({ userCount, tripCount, topCities });
};

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { trips: true } } },
  });
  res.json(users);
};

