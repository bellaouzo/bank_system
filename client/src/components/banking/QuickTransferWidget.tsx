import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AmountInput } from "./AmountInput.tsx";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import type { Account } from "@shared/schema";

interface QuickTransferWidgetProps {
  accounts: Account[];
  onTransfer: (fromId: number, toId: number, amount: string) => Promise<void>;
  isLoading?: boolean;
}

export function QuickTransferWidget({ accounts, onTransfer, isLoading = false }: QuickTransferWidgetProps) {
  const [fromAccountId, setFromAccountId] = useState<string>("");
  const [toAccountId, setToAccountId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const fromAccount = accounts.find(a => a.id.toString() === fromAccountId);
  const maxAmount = fromAccount ? parseFloat(fromAccount.balance) : undefined;

  const handleTransfer = async () => {
    if (!fromAccountId || !toAccountId || !amount) {
      setError("Please fill in all fields");
      return;
    }
    if (fromAccountId === toAccountId) {
      setError("Cannot transfer to the same account");
      return;
    }
    setError("");
    await onTransfer(parseInt(fromAccountId), parseInt(toAccountId), amount);
    setAmount("");
  };

  return (
    <Card className="bg-primary text-primary-foreground border-none shadow-lg" data-testid="quick-transfer-widget">
      <CardHeader>
        <CardTitle className="text-xl">Quick Transfer</CardTitle>
        <CardDescription className="text-primary-foreground/80">Send money instantly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase text-primary-foreground/70">From</label>
          <Select value={fromAccountId} onValueChange={setFromAccountId}>
            <SelectTrigger className="bg-white/10 border-white/10 text-white" data-testid="quick-transfer-from">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map(acc => (
                <SelectItem key={acc.id} value={acc.id.toString()}>
                  {acc.name} (${parseFloat(acc.balance).toLocaleString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center">
          <div className="p-2 bg-white/10 rounded-full">
            <ArrowRight className="w-4 h-4 text-white/70" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase text-primary-foreground/70">To</label>
          <Select value={toAccountId} onValueChange={setToAccountId}>
            <SelectTrigger className="bg-white text-primary border-none" data-testid="quick-transfer-to">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.filter(a => a.id.toString() !== fromAccountId).map(acc => (
                <SelectItem key={acc.id} value={acc.id.toString()}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase text-primary-foreground/70">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
            <input 
              type="number" 
              step="0.01"
              className="w-full p-3 pl-8 bg-white text-primary rounded-md border-none text-sm font-bold focus:ring-2 focus:ring-white/50 outline-none placeholder:text-primary/30" 
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={maxAmount}
              data-testid="quick-transfer-amount"
            />
          </div>
          {maxAmount !== undefined && (
            <p className="text-xs text-primary-foreground/60">
              Available: ${maxAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>

        {error && <p className="text-xs text-red-300">{error}</p>}

        <Button 
          className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
          onClick={handleTransfer}
          disabled={isLoading}
          data-testid="quick-transfer-submit"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Send Money"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
