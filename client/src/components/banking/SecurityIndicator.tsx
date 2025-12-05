import { ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SecurityIndicatorProps {
  level?: "standard" | "enhanced" | "maximum";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const levelConfig = {
  standard: {
    color: "text-amber-600",
    bg: "bg-amber-100",
    label: "Standard Security",
  },
  enhanced: {
    color: "text-blue-600",
    bg: "bg-blue-100",
    label: "Enhanced Security",
  },
  maximum: {
    color: "text-green-600",
    bg: "bg-green-100",
    label: "Maximum Security",
  },
};

const sizeConfig = {
  sm: { icon: "w-3 h-3", text: "text-xs", padding: "px-2 py-1" },
  md: { icon: "w-4 h-4", text: "text-sm", padding: "px-3 py-1.5" },
  lg: { icon: "w-5 h-5", text: "text-base", padding: "px-4 py-2" },
};

export function SecurityIndicator({ level = "enhanced", showLabel = true, size = "md" }: SecurityIndicatorProps) {
  const config = levelConfig[level];
  const sizes = sizeConfig[size];

  return (
    <div 
      className={cn("inline-flex items-center gap-2 rounded-full font-medium", config.bg, sizes.padding)}
      data-testid="security-indicator"
    >
      <ShieldCheck className={cn(config.color, sizes.icon)} />
      {showLabel && <span className={cn(config.color, sizes.text)}>{config.label}</span>}
    </div>
  );
}

export function EncryptionBadge({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)} data-testid="encryption-badge">
      <Lock className="w-4 h-4 text-green-600" />
      <span>256-bit SSL Encryption</span>
    </div>
  );
}

interface SensitiveDataProps {
  value: string;
  defaultHidden?: boolean;
  className?: string;
}

export function SensitiveData({ value, defaultHidden = true, className }: SensitiveDataProps) {
  const [hidden, setHidden] = useState(defaultHidden);

  const maskedValue = value.replace(/./g, "•");

  return (
    <div className={cn("inline-flex items-center gap-2", className)} data-testid="sensitive-data">
      <span className="font-mono">{hidden ? maskedValue : value}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => setHidden(!hidden)}
        data-testid="toggle-visibility"
      >
        {hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </Button>
    </div>
  );
}

export function SecureFormFooter() {
  return (
    <div className="flex items-center justify-center gap-4 pt-4 border-t">
      <EncryptionBadge />
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span>Secure Transaction</span>
      </div>
    </div>
  );
}
