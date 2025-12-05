import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function LoadingState({ message = "Loading...", size = "md", className, fullScreen = false }: LoadingStateProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)} data-testid="loading-state">
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="py-12 flex items-center justify-center">
      {content}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-muted rounded", className)} data-testid="loading-skeleton" />
  );
}

export function AccountCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4" data-testid="account-card-skeleton">
      <div className="flex justify-between">
        <LoadingSkeleton className="h-4 w-20" />
        <LoadingSkeleton className="h-4 w-4" />
      </div>
      <LoadingSkeleton className="h-6 w-32" />
      <LoadingSkeleton className="h-8 w-28" />
      <LoadingSkeleton className="h-4 w-40" />
    </div>
  );
}

export function TransactionItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-3" data-testid="transaction-skeleton">
      <div className="flex items-center gap-4">
        <LoadingSkeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-32" />
          <LoadingSkeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <LoadingSkeleton className="h-4 w-20" />
        <LoadingSkeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
