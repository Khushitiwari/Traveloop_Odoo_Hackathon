
import { Router } from 'express';
import {
  searchCities,
  getActivitiesByCity,
} from '../controllers/city.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.get('/', searchCities);
router.get('/:cityId/activities', getActivitiesByCity);

export default router;