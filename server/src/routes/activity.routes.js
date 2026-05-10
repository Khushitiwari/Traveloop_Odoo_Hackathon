import { Router } from 'express';
import { getActivityById, searchActivities } from '../controllers/activity.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.get('/', searchActivities);
router.get('/:id', getActivityById);

export default router;
