import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "pending" | "completed" | "cancelled";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 border-slate-200",
  success: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  danger: "bg-red-100 text-red-700 border-red-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
};

export function StatusBadge({ status, variant = "default", size = "sm", className }: StatusBadgeProps) {
  const inferredVariant = variant === "default" ? inferVariant(status) : variant;
  
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        variantStyles[inferredVariant],
        sizeStyles[size],
        className
      )}
      data-testid={`status-badge-${status.toLowerCase()}`}
    >
      {status}
    </span>
  );
}

function inferVariant(status: string): BadgeVariant {
  const lowerStatus = status.toLowerCase();
  
  if (["posted", "completed", "approved", "active", "success"].includes(lowerStatus)) {
    return "completed";
  }
  if (["pending", "processing", "in_progress", "review"].includes(lowerStatus)) {
    return "pending";
  }
  if (["cancelled", "rejected", "failed", "declined"].includes(lowerStatus)) {
    return "cancelled";
  }
  if (["warning", "flagged", "disputed"].includes(lowerStatus)) {
    return "warning";
  }
  
  return "default";
}

export function TransactionStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status.toUpperCase()} />;
}

export function TransferStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status.charAt(0).toUpperCase() + status.slice(1)} />;
}
