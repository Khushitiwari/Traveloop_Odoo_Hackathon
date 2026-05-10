
import { Router } from 'express';
import {
  addStop,
  updateStop,
  deleteStop,
  addActivityToStop,
  removeActivityFromStop,
} from '../controllers/stop.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

router.use(protect);
router.post('/', addStop);
router.put('/:stopId', updateStop);
router.delete('/:stopId', deleteStop);
router.post('/:stopId/activities', addActivityToStop);
router.delete('/:stopId/activities/:saId', removeActivityFromStop);

export default router;