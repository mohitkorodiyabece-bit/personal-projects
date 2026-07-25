import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import { projectVersionRouter, versionRouter } from './routes/versionRoutes.js';
import { versionFeedbackRouter, feedbackRouter } from './routes/feedbackRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

import notFoundMiddleware from './middleware/notFoundMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    errors: [],
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    errors: [],
  },
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FrameSync API is running',
    data: { timestamp: new Date().toISOString() },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/versions', projectVersionRouter);
app.use('/api/versions', versionRouter);
app.use('/api/versions/:versionId/feedback', versionFeedbackRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;