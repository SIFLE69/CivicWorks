import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import reportRoutes from './routes/reportRoutes';
import engagementRoutes from './routes/engagementRoutes';
import profileRoutes from './routes/profileRoutes';

const app = express();
const PORT = Number(process.env.PORT || 4000);

// Connect to Database
connectDB();

// CORS configuration - allow all origins in development, specific origins in production
const corsOptions = process.env.NODE_ENV === 'production'
  ? {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [],
    credentials: true
  }
  : {
    origin: true, // Allow all origins in development
    credentials: true
  };

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));

// Handle OPTIONS requests for CORS preflight
app.options('*', cors(corsOptions));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', engagementRoutes);
app.use('/api/profile', profileRoutes);

// Root
app.get('/', (_req, res) => {
  res.json({
    message: 'CivicWorks API is running',
    health: '/api/health',
    endpoints: ['/api/auth', '/api/reports', '/api/profile']
  });
});

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Export for Vercel serverless
export default app;

// Listen only in development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}
