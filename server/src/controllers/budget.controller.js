
import prisma  from '../config/db.js';

export const upsertBudget = async (req, res) => {
  const { totalBudget, transport, accommodation, activities, meals, misc, currency } = req.body;
  const budget = await prisma.budget.upsert({
    where: { tripId: req.params.tripId },
    update: { totalBudget, transport, accommodation, activities, meals, misc, currency },
    create: { tripId: req.params.tripId, totalBudget, transport, accommodation, activities, meals, misc, currency },
  });
  res.json(budget);
};

export const getBudget = async (req, res) => {
  const budget = await prisma.budget.findUnique({ where: { tripId: req.params.tripId } });
  res.json(budget);
};


