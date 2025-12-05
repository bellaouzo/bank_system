import { TransactionItem } from "./TransactionItem.tsx";
import { EmptyState } from "./EmptyState.tsx";
import { Receipt } from "lucide-react";
import type { Transaction } from "@shared/schema";

interface TransactionListProps {
  transactions: Transaction[];
  showActions?: boolean;
  emptyMessage?: string;
  onViewDetails?: (transaction: Transaction) => void;
  maxItems?: number;
}

export function TransactionList({ 
  transactions, 
  showActions = false, 
  emptyMessage = "No transactions found",
  onViewDetails,
  maxItems
}: TransactionListProps) {
  const displayTransactions = maxItems ? transactions.slice(0, maxItems) : transactions;

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No Transactions"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="space-y-1" data-testid="transaction-list">
      {displayTransactions.map((tx) => (
        <TransactionItem 
          key={tx.id} 
          transaction={tx} 
          showActions={showActions}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
