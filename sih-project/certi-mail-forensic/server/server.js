import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import threatIntelRoutes from './routes/threatIntel.js';
import investigateRoutes from './routes/investigate.js';
import authRoutes from './routes/auth.js';
import { verifySessionToken } from './middleware/auth.js';

dotenv.config();

const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || 'https://certi-mail-forensic.vercel.app';
app.use(cors({ origin: [allowedOrigin, 'http://localhost:5173'], credentials: true }));
app.use(express.json({ limit: '2mb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests. Please wait before trying again.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many login attempts. Please wait before trying again.' }
});

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'CertiMail Forensic Backend is Live!',
    endpoints: { login: 'POST /api/auth/login', investigate: 'POST /api/investigate', history: 'GET /api/history', intel: 'GET /api/intel' }
  });
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/certimailforensic';

mongoose.connect(MONGODB_URI, { dbName: 'certimailforensic', family: 4, serverSelectionTimeoutMS: 10000 })
  .then(() => console.log(`Connected to MongoDB. Active Database: ${mongoose.connection.name}`))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api/intel', apiLimiter, verifySessionToken, threatIntelRoutes);
app.use('/api', apiLimiter, verifySessionToken, investigateRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Node backend running on port ${PORT}`);
});