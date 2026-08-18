const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const { corsOptions } = require('./config/cors');
const { requestId } = require('./middleware/requestId');
const { sanitizeRequest } = require('./middleware/sanitize');
const { publicLimiter } = require('./middleware/rateLimits');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');
const { spec } = require('./docs/openapi');

function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      frameguard: false,
      referrerPolicy: { policy: 'no-referrer' },
    })
  );
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '200kb' }));
  app.use(express.urlencoded({ extended: false, limit: '200kb' }));
  app.use(requestId);
  app.use(sanitizeRequest);
  app.use(publicLimiter);

  app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(spec, { customSiteTitle: 'YatraGenie API' }));
  app.get('/api/v1/docs.json', (_req, res) => res.json(spec));
  app.use('/api/v1', routes);

  app.get('/', (_req, res) => {
    res.json({ name: 'YatraGenie AI', docs: '/api/v1/docs', health: '/api/v1/health' });
  });

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
