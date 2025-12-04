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

// CORS configuration - allow frontend origin with credentials
const allowedOrigins = ['https://civicworks.vercel.app', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Auth-Token', 'Origin', 'Accept'],
  optionsSuccessStatus: 200
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

// Listen locally (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}
