import { describe, it, expect } from '@jest/globals';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import type { Flags, Result } from 'lighthouse';

describe('Frontend Performance Tests', () => {
  it('home page should meet performance standards', async () => {
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options: Flags = {
      logLevel: 'info',
      output: 'json',
      port: chrome.port,
      onlyCategories: ['performance']
    };

    let runnerResult: Result | undefined;

    try {
      runnerResult = await lighthouse('http://localhost:5000', options);
      
      if (!runnerResult?.lhr) {
        throw new Error('Lighthouse failed to return results');
      }

      const performanceScore = runnerResult.lhr.categories.performance?.score ?? 0;
      const score = performanceScore * 100;

      const firstContentfulPaint = Number(runnerResult.lhr.audits['first-contentful-paint']?.numericValue ?? 0);
      const timeToInteractive = Number(runnerResult.lhr.audits['interactive']?.numericValue ?? 0);

      console.log('Lighthouse Performance Results:');
      console.log(`Performance Score: ${score}`);
      console.log('Metrics:', {
        'First Contentful Paint': runnerResult.lhr.audits['first-contentful-paint']?.displayValue ?? 'N/A',
        'Time to Interactive': runnerResult.lhr.audits['interactive']?.displayValue ?? 'N/A',
        'Speed Index': runnerResult.lhr.audits['speed-index']?.displayValue ?? 'N/A'
      });

      // Performance thresholds
      expect(score).toBeGreaterThan(80);
      expect(firstContentfulPaint).toBeLessThan(2000);
      expect(timeToInteractive).toBeLessThan(3500);
    } finally {
      await chrome.kill();
    }
  }, 30000);
});
