import express from 'express';
import { userRoutes } from './routes/user.routes.js';
import { healthRoutes } from './routes/health.routes.js';

const app = express();

app.use(express.json());
app.use('/api', healthRoutes);
app.use('/api/users', userRoutes);

export { app };
