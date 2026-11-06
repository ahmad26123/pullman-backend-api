import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all bookings' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create booking' });
});

export default router;
