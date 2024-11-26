import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "./LoadingSpinner";
import { useErrorHandler } from "../hooks/useErrorHandler";

interface Metrics {
  uptime: number;
  requestCount: number;
  averageResponseTime: string;
  errorCount: number;
  metricsCollectionStart: string;
}

export function PerformanceMetrics() {
  const handleError = useErrorHandler();

  const { data, isLoading, error } = useQuery<Metrics>({
    queryKey: ['metrics'],
    queryFn: async () => {
      const response = await fetch('/api/metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch performance metrics');
      }
      return response.json();
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  if (error) {
    handleError(error);
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-2">
            <p><span className="font-semibold">Uptime:</span> {data?.uptime.toFixed(2)}s</p>
            <p><span className="font-semibold">Total Requests:</span> {data?.requestCount}</p>
            <p><span className="font-semibold">Avg Response Time:</span> {data?.averageResponseTime}ms</p>
            <p><span className="font-semibold">Error Count:</span> {data?.errorCount}</p>
            <p className="text-sm text-gray-500">
              Metrics since: {new Date(data?.metricsCollectionStart || '').toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
