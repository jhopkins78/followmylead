import { useToast } from "@/hooks/use-toast";

export function useErrorHandler() {
  const { toast } = useToast();

  return (error: unknown) => {
    const message = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';

    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    });

    console.error('Application error:', error);
  };
}
