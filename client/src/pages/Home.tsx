import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "../hooks/useErrorHandler";

export function Home() {
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error('Failed to fetch health status');
      }
      return response.json();
    }
  });

  if (error) {
    handleError(error);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-primary">
        Welcome to the Application
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="text-lg">
                {data?.status || 'Unknown'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
