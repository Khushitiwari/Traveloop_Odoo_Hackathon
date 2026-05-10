
import  prisma  from'../config/db.js';

export const getChecklist = async (req, res) => {
  const items = await prisma.checklistItem.findMany({
    where: { tripId: req.params.tripId, userId: req.user.userId },
    orderBy: { createdAt: 'asc' },
  });
  res.json(items);
};

export const addItem = async (req, res) => {
  const { label, category } = req.body;
  const item = await prisma.checklistItem.create({
    data: { tripId: req.params.tripId, userId: req.user.userId, label, category },
  });
  res.status(201).json(item);
};

export const toggleItem = async (req, res) => {
  const item = await prisma.checklistItem.findUnique({ where: { id: req.params.itemId } });
  const updated = await prisma.checklistItem.update({
    where: { id: req.params.itemId },
    data: { isPacked: !item.isPacked },
  });
  res.json(updated);
};

export const deleteItem = async (req, res) => {
  await prisma.checklistItem.delete({ where: { id: req.params.itemId } });
  res.json({ message: 'Deleted' });
};

