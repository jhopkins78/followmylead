import { describe, it, expect } from '@jest/globals';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import type { Flags, RunnerResult } from 'lighthouse';

describe('Frontend Performance Tests', () => {
  it('home page should meet performance standards', async () => {
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options: Flags = {
      logLevel: 'info',
      output: 'json',
      port: chrome.port,
      onlyCategories: ['performance']
    };

    try {
      const runnerResult = await lighthouse('http://localhost:5000', options);
      
      if (!runnerResult?.lhr) {
        throw new Error('Lighthouse failed to return results');
      }

      const performanceScore = runnerResult.lhr.categories.performance?.score ?? 0;
      const score = performanceScore * 100;

      const metrics = {
        firstContentfulPaint: runnerResult.lhr.audits['first-contentful-paint']?.numericValue ?? 0,
        timeToInteractive: runnerResult.lhr.audits['interactive']?.numericValue ?? 0,
        speedIndex: runnerResult.lhr.audits['speed-index']?.numericValue ?? 0
      };

      console.log('Lighthouse Performance Results:');
      console.log(`Performance Score: ${score}`);
      console.log('Metrics:', {
        'First Contentful Paint': runnerResult.lhr.audits['first-contentful-paint']?.displayValue ?? 'N/A',
        'Time to Interactive': runnerResult.lhr.audits['interactive']?.displayValue ?? 'N/A',
        'Speed Index': runnerResult.lhr.audits['speed-index']?.displayValue ?? 'N/A'
      });

      // Performance thresholds
      expect(score).toBeGreaterThan(80);
      expect(metrics.firstContentfulPaint).toBeLessThan(2000); // 2 seconds
      expect(metrics.timeToInteractive).toBeLessThan(3500); // 3.5 seconds
    } finally {
      await chrome.kill();
    }
  }, 30000);
});
