import type { Express } from "express";
import { db } from "../db";

export function registerRoutes(app: Express) {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    try {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Health check failed:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  });

  // Error handling middleware
  app.use((err: Error, req: any, res: any, next: any) => {
    console.error('Global error handler:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
  });
}
