 import prisma from '../config/db.js';

export const getNotes = async (req, res) => {
  const notes = await prisma.note.findMany({
    where: { tripId: req.params.tripId, userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(notes);
};

export const createNote = async (req, res) => {
  const note = await prisma.note.create({
    data: { tripId: req.params.tripId, userId: req.user.userId, content: req.body.content },
  });
  res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const note = await prisma.note.update({
    where: { id: req.params.noteId },
    data: { content: req.body.content },
  });
  res.json(note);
};

export const deleteNote = async (req, res) => {
  await prisma.note.delete({ where: { id: req.params.noteId } });
  res.json({ message: 'Deleted' });
};

