
import { Router } from 'express';
import { getStats, getUsers } from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.use(protect, isAdmin);
router.get('/stats', getStats);
router.get('/users', getUsers);

export default router;