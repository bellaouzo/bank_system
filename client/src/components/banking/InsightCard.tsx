import { LucideIcon, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  type: "tip" | "warning" | "success" | "info";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  dismissable?: boolean;
  onDismiss?: () => void;
}

const typeStyles = {
  tip: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    titleColor: "text-blue-900",
    textColor: "text-blue-700",
    icon: Lightbulb,
    iconColor: "text-blue-600",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    titleColor: "text-amber-900",
    textColor: "text-amber-700",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-100",
    titleColor: "text-green-900",
    textColor: "text-green-700",
    icon: CheckCircle,
    iconColor: "text-green-600",
  },
  info: {
    bg: "bg-slate-50",
    border: "border-slate-100",
    titleColor: "text-slate-900",
    textColor: "text-slate-700",
    icon: Info,
    iconColor: "text-slate-600",
  },
};

export function InsightCard({
  type,
  title,
  description,
  actionLabel,
  onAction,
  icon,
  dismissable = false,
  onDismiss,
}: InsightCardProps) {
  const styles = typeStyles[type];
  const Icon = icon || styles.icon;

  return (
    <div 
      className={cn("p-4 rounded-lg border", styles.bg, styles.border)}
      data-testid={`insight-card-${type}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", styles.iconColor)} />
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium", styles.titleColor)}>{title}</p>
          <p className={cn("text-xs mt-1", styles.textColor)}>{description}</p>
          {actionLabel && onAction && (
            <Button
              variant="link"
              size="sm"
              onClick={onAction}
              className={cn("p-0 h-auto mt-2 text-xs", styles.titleColor)}
            >
              {actionLabel} →
            </Button>
          )}
        </div>
        {dismissable && onDismiss && (
          <button
            onClick={onDismiss}
            className={cn("text-xs opacity-60 hover:opacity-100", styles.textColor)}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export function SpendingAlert({ category, percentage, isOver = true }: { category: string; percentage: number; isOver?: boolean }) {
  return (
    <InsightCard
      type={isOver ? "warning" : "success"}
      title={isOver ? `Unusual spending in ${category}` : `Good job on ${category}!`}
      description={isOver 
        ? `Your ${category.toLowerCase()} expenses are ${percentage}% higher than last month.`
        : `You've reduced ${category.toLowerCase()} spending by ${Math.abs(percentage)}%.`
      }
      icon={isOver ? TrendingUp : TrendingDown}
      actionLabel="View details"
      onAction={() => {}}
    />
  );
}

export function SavingsGoalAlert({ goalName, reached = false }: { goalName: string; reached?: boolean }) {
  return (
    <InsightCard
      type={reached ? "success" : "info"}
      title={reached ? "Savings Goal Reached!" : `Progress on "${goalName}"`}
      description={reached 
        ? `Congratulations! You hit your goal for "${goalName}".`
        : `You're 75% of the way to your "${goalName}" goal.`
      }
      actionLabel={reached ? "Set new goal" : "View progress"}
      onAction={() => {}}
    />
  );
}
