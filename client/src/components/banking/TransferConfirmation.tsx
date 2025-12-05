import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import type { Account } from "@shared/schema";

interface TransferConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromAccount: Account | null;
  toAccount: Account | null;
  amount: string;
  memo?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function TransferConfirmation({
  open,
  onOpenChange,
  fromAccount,
  toAccount,
  amount,
  memo,
  onConfirm,
  isLoading = false,
}: TransferConfirmationProps) {
  if (!fromAccount || !toAccount) return null;

  const amountNum = parseFloat(amount);
  const newFromBalance = parseFloat(fromAccount.balance) - amountNum;
  const newToBalance = parseFloat(toAccount.balance) + amountNum;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="transfer-confirmation-dialog">
        <DialogHeader>
          <DialogTitle>Confirm Transfer</DialogTitle>
          <DialogDescription>
            Please review the transfer details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">From</p>
              <p className="font-medium text-sm">{fromAccount.name}</p>
              <p className="text-xs text-muted-foreground">{fromAccount.accountNumber}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">To</p>
              <p className="font-medium text-sm">{toAccount.name}</p>
              <p className="text-xs text-muted-foreground">{toAccount.accountNumber}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Transfer Amount</p>
            <p className="text-3xl font-bold text-primary">
              ${amountNum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {memo && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Memo</p>
              <p className="text-sm">{memo}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">New {fromAccount.name} balance:</span>
              <span className="font-medium">${newFromBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">New {toAccount.name} balance:</span>
              <span className="font-medium">${newToBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-col">
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={onConfirm}
            disabled={isLoading}
            data-testid="confirm-transfer-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Transfer"
            )}
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Secure 256-bit encrypted transaction</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
