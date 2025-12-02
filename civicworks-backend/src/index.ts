import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import reportRoutes from './routes/reportRoutes';
import engagementRoutes from './routes/engagementRoutes';
import profileRoutes from './routes/profileRoutes';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Connect to Database
connectDB();

app.use(cors({ origin: ORIGIN }));
app.use(express.json({ limit: '5mb' }));

// Ensure uploads dir
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', engagementRoutes);
app.use('/api/profile', profileRoutes);

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
