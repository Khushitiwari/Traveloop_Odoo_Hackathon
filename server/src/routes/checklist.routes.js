
import { Router } from 'express';
import {
  getChecklist,
  addItem,
  toggleItem,
  deleteItem,
} from '../controllers/checklist.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

router.use(protect);
router.get('/', getChecklist);
router.post('/', addItem);
router.patch('/:itemId/toggle', toggleItem);
router.delete('/:itemId', deleteItem);

export default router;