import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api', (_req, res) => {
  res.json({ message: 'Express Minimal Archetype API' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export { app };
