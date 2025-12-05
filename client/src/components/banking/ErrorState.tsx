import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while loading this content. Please try again.",
  onRetry,
  onGoBack,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)} data-testid="error-state">
      <div className="p-4 bg-red-100 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{message}</p>
      <div className="flex gap-3">
        {onGoBack && (
          <Button variant="outline" onClick={onGoBack} data-testid="error-go-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        )}
        {onRetry && (
          <Button onClick={onRetry} data-testid="error-retry">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

export function ApiErrorState({ error, onRetry }: { error: Error | null; onRetry?: () => void }) {
  return (
    <ErrorState
      title="Failed to load data"
      message={error?.message || "An unexpected error occurred. Please try again later."}
      onRetry={onRetry}
    />
  );
}
