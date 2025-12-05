import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  currency?: string;
  max?: number;
  min?: number;
  error?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-9 text-sm",
  md: "h-10 text-base",
  lg: "h-12 text-lg",
};

export function AmountInput({
  value,
  onChange,
  label,
  placeholder = "0.00",
  currency = "$",
  max,
  min = 0,
  error,
  disabled = false,
  className,
  size = "md",
}: AmountInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (newValue === "" || /^\d*\.?\d{0,2}$/.test(newValue)) {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        if (max !== undefined && numValue > max) return;
        if (numValue < min) return;
      }
      onChange(newValue);
    }
  }, [onChange, max, min]);

  const formattedDisplay = value ? parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="relative">
        <span className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 font-semibold",
          error ? "text-red-500" : isFocused ? "text-primary" : "text-muted-foreground"
        )}>
          {currency}
        </span>
        <Input
          type="text"
          inputMode="decimal"
          value={isFocused ? value : formattedDisplay}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pl-8 font-medium",
            sizeClasses[size],
            error && "border-red-500 focus-visible:ring-red-500"
          )}
          data-testid="amount-input"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {max !== undefined && (
        <p className="text-xs text-muted-foreground">
          Maximum: {currency}{max.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      )}
    </div>
  );
}
