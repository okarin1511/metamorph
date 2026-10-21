import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'express-layered-api', uptime: process.uptime() });
});

export const healthRoutes = router;
