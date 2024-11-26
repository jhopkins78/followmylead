import type { Express, Request, Response, NextFunction } from "express";
import { db } from "../db";

// Performance metrics storage
const performanceMetrics = {
  requestCount: 0,
  totalResponseTime: 0,
  errors: 0,
  lastResetTime: new Date()
};

// Performance monitoring middleware
function performanceMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const responseTime = seconds * 1000 + nanoseconds / 1000000;
    
    performanceMetrics.requestCount++;
    performanceMetrics.totalResponseTime += responseTime;
    
    if (res.statusCode >= 400) {
      performanceMetrics.errors++;
    }
  });
  
  next();
}

export function registerRoutes(app: Express) {
  // Apply performance middleware to all routes
  app.use(performanceMiddleware);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    try {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Health check failed:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  });

  // Performance metrics endpoint
  app.get('/api/metrics', (req, res) => {
    try {
      const avgResponseTime = performanceMetrics.requestCount > 0
        ? performanceMetrics.totalResponseTime / performanceMetrics.requestCount
        : 0;

      res.json({
        uptime: process.uptime(),
        requestCount: performanceMetrics.requestCount,
        averageResponseTime: avgResponseTime.toFixed(2),
        errorCount: performanceMetrics.errors,
        metricsCollectionStart: performanceMetrics.lastResetTime
      });
    } catch (error) {
      console.error('Metrics retrieval failed:', error);
      res.status(500).json({ status: 'error', message: 'Failed to retrieve metrics' });
    }
  });

  // Reset metrics endpoint (for maintenance)
  app.post('/api/metrics/reset', (req, res) => {
    try {
      performanceMetrics.requestCount = 0;
      performanceMetrics.totalResponseTime = 0;
      performanceMetrics.errors = 0;
      performanceMetrics.lastResetTime = new Date();
      res.json({ status: 'success', message: 'Metrics reset successfully' });
    } catch (error) {
      console.error('Metrics reset failed:', error);
      res.status(500).json({ status: 'error', message: 'Failed to reset metrics' });
    }
  });

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Global error handler:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
  });
}
