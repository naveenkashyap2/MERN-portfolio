import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import corsOptions from './config/cors.js';
import env from './config/env.js';
import { securityHeaders, sanitizeBody } from './middleware/security.middleware.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import { generalLimiter } from './middleware/rateLimit.middleware.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import tripRoutes from './routes/trip.routes.js';
import itineraryRoutes from './routes/itinerary.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import aiRoutes from './routes/ai.routes.js';
import assistantRoutes from './routes/assistant.routes.js';
import locationRoutes from './routes/location.routes.js';
import routeRoutes from './routes/route.routes.js';
import walkingRoutes from './routes/walking.routes.js';
import transportRoutes from './routes/transport.routes.js';
import hotelRoutes from './routes/hotel.routes.js';
import placeRoutes from './routes/place.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import healthRoutes from './routes/health.routes.js';

const app = express();

app.set('trust proxy', 1);

// Security & transport
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(securityHeaders);
app.use(cors(corsOptions()));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(sanitizeBody);

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
const api = express.Router();
api.use('/auth', authRoutes);
api.use('/users', userRoutes);
api.use('/trips', tripRoutes);
api.use('/trips/:tripId/itinerary', itineraryRoutes);
api.use('/trips/:tripId/expenses', expenseRoutes);
api.use('/ai', aiRoutes);
api.use('/assistant', assistantRoutes);
api.use('/location', locationRoutes);
api.use('/routes', routeRoutes);
api.use('/walking', walkingRoutes);
api.use('/transport', transportRoutes);
api.use('/hotels', hotelRoutes);
api.use('/places', placeRoutes);
api.use('/favorites', favoriteRoutes);
api.use('/notifications', notificationRoutes);
api.use('/health', healthRoutes);

app.use('/api/v1', generalLimiter, api);

// Root
app.get('/', (_req, res) => {
  res.json({ success: true, name: 'YatraGenie AI API', docs: '/api/v1/health' });
});

app.use(notFound);
app.use(errorHandler);

export default app;
