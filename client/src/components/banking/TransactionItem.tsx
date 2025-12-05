import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Transaction } from "@shared/schema";

interface TransactionItemProps {
  transaction: Transaction;
  showActions?: boolean;
  onViewDetails?: (transaction: Transaction) => void;
  onDispute?: (transaction: Transaction) => void;
}

const categoryColors: Record<string, string> = {
  Groceries: "bg-green-50 text-green-700",
  Income: "bg-blue-50 text-blue-700",
  Utilities: "bg-orange-50 text-orange-700",
  Dining: "bg-pink-50 text-pink-700",
  Transfer: "bg-purple-50 text-purple-700",
  Transport: "bg-cyan-50 text-cyan-700",
  Shopping: "bg-amber-50 text-amber-700",
  Entertainment: "bg-rose-50 text-rose-700",
  Healthcare: "bg-red-50 text-red-700",
  default: "bg-slate-50 text-slate-700",
};

export function TransactionItem({ transaction, showActions = false, onViewDetails, onDispute }: TransactionItemProps) {
  const amount = parseFloat(transaction.amount);
  const isCredit = amount > 0;
  const categoryColor = categoryColors[transaction.category] || categoryColors.default;

  return (
    <div 
      className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors group"
      data-testid={`transaction-item-${transaction.id}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${isCredit ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>
          {isCredit ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
        </div>
        <div>
          <p className="font-medium text-sm text-foreground">{transaction.description}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor}`}>
              {transaction.category}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(transaction.date), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className={`font-semibold text-sm ${isCredit ? "text-green-600" : "text-foreground"}`}>
            {isCredit ? "+" : "-"}${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-xs capitalize ${transaction.status === "pending" ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
            {transaction.status}
          </p>
        </div>
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails?.(transaction)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>Download Receipt</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDispute?.(transaction)} className="text-red-600">
                Report Issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
