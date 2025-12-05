import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Copy, ExternalLink, Settings, FileText, ArrowUpRight } from "lucide-react";
import { SensitiveData } from "./SecurityIndicator.tsx";
import type { Account } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface AccountDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  onTransfer?: () => void;
  onViewStatements?: () => void;
}

export function AccountDetailsModal({
  open,
  onOpenChange,
  account,
  onTransfer,
  onViewStatements,
}: AccountDetailsModalProps) {
  const { toast } = useToast();

  if (!account) return null;

  const balance = parseFloat(account.balance);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="account-details-modal">
        <DialogHeader>
          <DialogTitle>{account.name}</DialogTitle>
          <DialogDescription>{account.type} Account</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Account Details</TabsTrigger>
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-4">
            <div className="text-center py-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-3xl font-bold text-primary mt-1">
                {account.type === "Credit Card" ? "-" : ""}${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <DetailRow 
                label="Account Number" 
                value={<SensitiveData value={account.accountNumber.replace("...", "****1234")} />}
                onCopy={() => copyToClipboard(account.accountNumber, "Account number")}
              />
              <DetailRow 
                label="Routing Number" 
                value={<SensitiveData value="021000021" />}
                onCopy={() => copyToClipboard("021000021", "Routing number")}
              />
              <DetailRow 
                label="Account Type" 
                value={account.type}
              />
              <DetailRow 
                label="Status" 
                value={<span className="text-green-600 font-medium">Active</span>}
              />
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-3 mt-4">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12"
              onClick={onTransfer}
            >
              <ArrowUpRight className="w-4 h-4 mr-3" />
              Transfer Funds
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12"
              onClick={onViewStatements}
            >
              <FileText className="w-4 h-4 mr-3" />
              View Statements
            </Button>
            <Button variant="outline" className="w-full justify-start h-12">
              <Settings className="w-4 h-4 mr-3" />
              Account Settings
            </Button>
            <Button variant="outline" className="w-full justify-start h-12">
              <ExternalLink className="w-4 h-4 mr-3" />
              Direct Deposit Setup
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  onCopy?: () => void;
}

function DetailRow({ label, value, onCopy }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{value}</span>
        {onCopy && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCopy}>
            <Copy className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
