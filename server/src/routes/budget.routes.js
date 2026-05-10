
import { Router } from 'express';
import { upsertBudget, getBudget } from '../controllers/budget.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

router.use(protect);
router.get('/', getBudget);
router.put('/', upsertBudget);

export default router;