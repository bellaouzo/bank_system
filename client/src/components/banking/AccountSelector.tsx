import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Wallet, DollarSign, CreditCard, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Account } from "@shared/schema";

interface AccountSelectorProps {
  accounts: Account[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  excludeId?: number;
  showBalance?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  error?: string;
}

const accountIcons = {
  Checking: Wallet,
  Savings: DollarSign,
  "Credit Card": CreditCard,
  Investment: TrendingUp,
};

const sizeClasses = {
  sm: "h-9",
  md: "h-10",
  lg: "h-14",
};

export function AccountSelector({
  accounts,
  value,
  onChange,
  label,
  placeholder = "Select account",
  excludeId,
  showBalance = true,
  size = "md",
  disabled = false,
  error,
}: AccountSelectorProps) {
  const filteredAccounts = excludeId 
    ? accounts.filter(acc => acc.id !== excludeId)
    : accounts;

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger 
          className={cn(
            sizeClasses[size],
            error && "border-red-500 focus:ring-red-500"
          )}
          data-testid="account-selector"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {filteredAccounts.map(acc => {
            const Icon = accountIcons[acc.type as keyof typeof accountIcons] || Wallet;
            const balance = parseFloat(acc.balance);
            
            return (
              <SelectItem key={acc.id} value={acc.id.toString()}>
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-col text-left">
                    <span className="font-medium">{acc.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {acc.accountNumber}
                      {showBalance && ` • $${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
