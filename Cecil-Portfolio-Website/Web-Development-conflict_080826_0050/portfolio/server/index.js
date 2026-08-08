import dns from 'node:dns';

dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import journeyRoutes from './routes/journeyRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { seedIfEmpty } from './utils/seed.js';

dotenv.config();

const app = express();

// CORS: allow the frontend origin(s) from CLIENT_URL, or any origin in local dev
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
app.use(express.json({ limit: '1mb' }));

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api', contentRoutes); // /api/skills + /api/admin/login

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedIfEmpty();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
