import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all trips' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create trip' });
});

export default router;
