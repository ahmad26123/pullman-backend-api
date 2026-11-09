import { Router } from 'express';
import { tripController } from '../controllers/trip.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, tripController.getAllTrips);
router.get('/:id', authenticate, tripController.getTripById);

router.post('/', authenticate, requireAdmin, tripController.createTrip);
router.put('/:id', authenticate, requireAdmin, tripController.updateTrip);
router.delete('/:id', authenticate, requireAdmin, tripController.deleteTrip);

export default router;
