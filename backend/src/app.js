import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

import config from './config/index.js';
import apiRouter from './routes/index.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

export const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for flexible SPA and CDN assets
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: config.cors.origin === '*' ? true : config.cors.origin.split(','),
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  })
);

// HTTP request logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(config.isProduction ? 'combined' : 'dev'));
}

// Body parsers with generous limits (handles large 50MB+ image uploads & base64 encoding)
const bodyLimit = `${Math.max(100, (config.upload?.maxSizeMb || 50) * 2)}mb`;
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));

// Global Rate Limiting
app.use(generalLimiter);

// Serve uploads statically
try {
  if (!fs.existsSync(config.paths.uploadsDir)) {
    fs.mkdirSync(config.paths.uploadsDir, { recursive: true });
  }
} catch (_) {}
app.use('/uploads', express.static(config.paths.uploadsDir));
app.use('/admin/uploads', express.static(config.paths.uploadsDir));

// Fallback upload paths
const frontendPublicUploads = fs.existsSync(path.join(config.paths.root, '..', 'frontend', 'public', 'uploads'))
  ? path.join(config.paths.root, '..', 'frontend', 'public', 'uploads')
  : path.join(config.paths.root, '..', 'ecotex-inc-frontend', 'public', 'uploads');
if (fs.existsSync(frontendPublicUploads)) {
  app.use('/uploads', express.static(frontendPublicUploads));
  app.use('/admin/uploads', express.static(frontendPublicUploads));
}

// Mount Core API router under both /api and /admin/api (cPanel subpath compatibility)
app.use('/api', apiRouter);
app.use('/admin/api', apiRouter);

// Serve Frontend SPA build if available
const distPath = [
  path.join(config.paths.root, 'dist'),
  path.join(config.paths.root, 'public'),
  config.paths.frontendDist,
  config.paths.rootDist,
].find((p) => p && fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) || config.paths.frontendDist;

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (
      req.path.startsWith('/api') || 
      req.path.startsWith('/admin/api') || 
      req.path.startsWith('/uploads') ||
      req.path.startsWith('/admin/uploads')
    ) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // If dist does not exist yet
  app.get('/', (req, res) => {
    res.json({
      service: 'Ecotex Inc. Enterprise API Server',
      status: 'active',
      endpoints: '/api',
      documentation: '/api/health',
    });
  });
}

// 404 for unmatched API routes
app.use('/api/*', notFoundHandler);
app.use('/admin/api/*', notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
