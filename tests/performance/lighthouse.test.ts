import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

describe('Frontend Performance Tests', () => {
  it('home page should meet performance standards', async () => {
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {
      logLevel: 'info',
      output: 'json',
      port: chrome.port,
      onlyCategories: ['performance']
    };

    const runnerResult = await lighthouse('http://localhost:5000', options);
    const performanceScore = runnerResult.lhr.categories.performance.score * 100;

    console.log('Lighthouse Performance Results:');
    console.log(`Performance Score: ${performanceScore}`);
    console.log('Metrics:', {
      'First Contentful Paint': runnerResult.lhr.audits['first-contentful-paint'].displayValue,
      'Time to Interactive': runnerResult.lhr.audits['interactive'].displayValue,
      'Speed Index': runnerResult.lhr.audits['speed-index'].displayValue
    });

    await chrome.kill();

    // Performance thresholds
    expect(performanceScore).toBeGreaterThan(80);
    expect(parseFloat(runnerResult.lhr.audits['first-contentful-paint'].numericValue)).toBeLessThan(2000);
    expect(parseFloat(runnerResult.lhr.audits['interactive'].numericValue)).toBeLessThan(3500);
  }, 30000);
});
