import { describe, it, expect } from '@jest/globals';
import lighthouse, { Result as LHResult } from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import type { Flags } from 'lighthouse';

describe('Frontend Performance Tests', () => {
  it('home page should meet performance standards', async () => {
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options: Flags = {
      logLevel: 'info',
      output: 'json',
      port: chrome.port,
      onlyCategories: ['performance']
    };

    let runnerResult: LHResult;

    try {
      runnerResult = await lighthouse('http://localhost:5000', options) as LHResult;
      
      if (!runnerResult || !runnerResult.lhr) {
        throw new Error('Lighthouse failed to return results');
      }

      const performanceScore = runnerResult.lhr.categories.performance?.score ?? 0;
      const score = performanceScore * 100;

      const metrics = {
        firstContentfulPaint: runnerResult.lhr.audits['first-contentful-paint']?.numericValue,
        timeToInteractive: runnerResult.lhr.audits['interactive']?.numericValue,
        speedIndex: runnerResult.lhr.audits['speed-index']?.numericValue
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
      expect(metrics.firstContentfulPaint).toBeLessThan(2000);
      expect(metrics.timeToInteractive).toBeLessThan(3500);
    } finally {
      await chrome.kill();
    }
  }, 30000);
});
