import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, DollarSign, CreditCard, TrendingUp, MoreHorizontal, ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Account } from "@shared/schema";

interface AccountCardProps {
  account: Account;
  onViewDetails?: (account: Account) => void;
  onTransfer?: (account: Account) => void;
  onDelete?: (account: Account) => void;
  showActions?: boolean;
  compact?: boolean;
  hideViewDetails?: boolean;
}

const accountIcons = {
  Checking: Wallet,
  Savings: DollarSign,
  "Credit Card": CreditCard,
  Investment: TrendingUp,
};

const accountColors = {
  Checking: "text-primary/50",
  Savings: "text-green-600/50",
  "Credit Card": "text-amber-500/50",
  Investment: "text-purple-500/50",
};

export function AccountCard({ account, onViewDetails, onTransfer, onDelete, showActions = true, compact = false, hideViewDetails = false }: AccountCardProps) {
  const Icon = accountIcons[account.type as keyof typeof accountIcons] || Wallet;
  const iconColor = accountColors[account.type as keyof typeof accountColors] || "text-primary/50";
  const balance = parseFloat(account.balance);

  if (compact) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors" data-testid={`account-compact-${account.id}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-muted ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-sm">{account.name}</p>
            <p className="text-xs text-muted-foreground">{account.accountNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-primary">
            {account.type === "Credit Card" ? "-" : ""}${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow duration-200 border-t-4 border-t-primary" data-testid={`account-card-${account.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            {account.type}
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </CardDescription>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!hideViewDetails && (
                  <DropdownMenuItem onClick={() => onViewDetails?.(account)}>
                    View Details
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onTransfer?.(account)}>
                  Transfer Funds
                </DropdownMenuItem>
                <DropdownMenuItem>View Statements</DropdownMenuItem>
                <DropdownMenuItem>Set Alerts</DropdownMenuItem>
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(account)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <CardTitle className="text-lg font-medium text-foreground">{account.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          {account.type === "Credit Card" ? "-" : ""}${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Available balance • {account.accountNumber}
        </p>
        {showActions && (
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => onTransfer?.(account)}>
              <ArrowUpRight className="w-3 h-3 mr-1" /> Transfer
            </Button>
            {!hideViewDetails && (
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => onViewDetails?.(account)}>
                <ArrowDownRight className="w-3 h-3 mr-1" /> Details
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
