import autocannon from 'autocannon';

describe('API Performance Tests', () => {
  const API_URL = 'http://localhost:5000';
  
  it('health endpoint should handle high load', async () => {
    const result = await autocannon({
      url: `${API_URL}/api/health`,
      connections: 10,
      duration: 10,
      requests: [
        {
          method: 'GET',
          path: '/api/health'
        }
      ]
    });

    // Performance thresholds
    expect(result.latency.p99).toBeLessThan(500); // 99th percentile latency < 500ms
    expect(result.requests.average).toBeGreaterThan(100); // Average > 100 req/sec
    expect(result.errors).toBe(0); // No errors
    
    console.log('Performance Test Results:');
    console.log(`Avg Latency: ${result.latency.average}ms`);
    console.log(`99th Percentile Latency: ${result.latency.p99}ms`);
    console.log(`Requests/sec: ${result.requests.average}`);
  }, 15000);
});
