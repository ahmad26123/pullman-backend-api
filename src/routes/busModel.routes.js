import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all bus models' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create bus model' });
});

export default router;
