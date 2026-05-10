
import { Router } from 'express';
import {
  createTrip,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getSharedTrip,
} from '../controllers/trip.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.get('/', getMyTrips);
router.post('/', createTrip);
router.get('/shared/:token', getSharedTrip); // public shared link
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

export default router;
