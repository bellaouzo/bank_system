import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  description?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: {
    bg: "bg-primary/10",
    text: "text-primary",
    icon: "text-primary",
  },
  success: {
    bg: "bg-green-100",
    text: "text-green-700",
    icon: "text-green-600",
  },
  warning: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: "text-amber-600",
  },
  danger: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: "text-red-600",
  },
};

export function StatCard({ title, value, icon: Icon, trend, description, variant = "default" }: StatCardProps) {
  const styles = variantStyles[variant];
  const TrendIcon = trend ? (trend.value > 0 ? TrendingUp : trend.value < 0 ? TrendingDown : Minus) : null;

  return (
    <Card data-testid="stat-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-2xl font-bold", styles.text)}>{value}</p>
            {trend && (
              <div className={cn("flex items-center gap-1 text-xs font-medium", trend.value >= 0 ? "text-green-600" : "text-red-600")}>
                {TrendIcon && <TrendIcon className="w-3 h-3" />}
                <span>{trend.value > 0 ? "+" : ""}{trend.value}%</span>
                {trend.label && <span className="text-muted-foreground ml-1">{trend.label}</span>}
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {Icon && (
            <div className={cn("p-3 rounded-lg", styles.bg)}>
              <Icon className={cn("w-5 h-5", styles.icon)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
