

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import tripRoutes from './routes/trip.routes.js';
import stopRoutes from './routes/stop.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import checklistRoutes from './routes/checklist.routes.js';
import noteRoutes from './routes/note.routes.js';
import cityRoutes from './routes/city.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();


app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trips/:tripId/stops', stopRoutes);
app.use('/api/trips/:tripId/budget', budgetRoutes);
app.use('/api/trips/:tripId/checklist', checklistRoutes);
app.use('/api/trips/:tripId/notes', noteRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/admin', adminRoutes);

export default app;