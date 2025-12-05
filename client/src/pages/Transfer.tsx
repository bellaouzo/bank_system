import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingState } from "@/components/banking/LoadingState";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAccounts, createTransfer } from "@/lib/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Transfer() {
  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  const [fromAccountId, setFromAccountId] = useState<string>("");
  const [toAccountId, setToAccountId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const transferMutation = useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Transfer Successful",
        description: "Your funds have been transferred successfully.",
      });
      setAmount("");
      setMemo("");
    },
    onError: (error: Error) => {
      toast({
        title: "Transfer Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTransfer = () => {
    if (!fromAccountId || !toAccountId || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (fromAccountId === toAccountId) {
      toast({
        title: "Invalid Transfer",
        description: "Cannot transfer to the same account.",
        variant: "destructive",
      });
      return;
    }

    transferMutation.mutate({
      fromAccountId: parseInt(fromAccountId),
      toAccountId: parseInt(toAccountId),
      amount,
      memo: memo || undefined,
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Pay & Transfer</h2>
          <p className="text-muted-foreground mt-1">Move money between accounts or pay bills.</p>
        </div>

        <Tabs defaultValue="internal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="internal">Internal Transfer</TabsTrigger>
            <TabsTrigger value="external">Wire / External</TabsTrigger>
            <TabsTrigger value="bills">Bill Pay</TabsTrigger>
          </TabsList>
          
          <TabsContent value="internal">
            <Card>
              <CardHeader>
                <CardTitle>Transfer Funds</CardTitle>
                <CardDescription>Move money instantly between your accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="from">From Account</Label>
                    {accountsLoading ? (
                      <Skeleton className="h-14 w-full" />
                    ) : (
                      <Select value={fromAccountId} onValueChange={setFromAccountId}>
                        <SelectTrigger id="from" className="h-14" data-testid="select-from-account">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map(acc => (
                            <SelectItem key={acc.id} value={acc.id.toString()}>
                              <div className="flex flex-col text-left">
                                <span className="font-medium">{acc.name} ({acc.accountNumber})</span>
                                <span className="text-xs text-muted-foreground">Available: ${parseFloat(acc.balance).toLocaleString()}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="flex justify-center -my-2 z-10">
                    <div className="bg-background p-2 rounded-full border shadow-sm">
                      <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90 md:rotate-0" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="to">To Account</Label>
                    {accountsLoading ? (
                      <Skeleton className="h-14 w-full" />
                    ) : (
                      <Select value={toAccountId} onValueChange={setToAccountId}>
                        <SelectTrigger id="to" className="h-14" data-testid="select-to-account">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map(acc => (
                            <SelectItem key={acc.id} value={acc.id.toString()}>
                              <div className="flex flex-col text-left">
                                <span className="font-medium">{acc.name} ({acc.accountNumber})</span>
                                <span className="text-xs text-muted-foreground">Current: ${parseFloat(acc.balance).toLocaleString()}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                      <Input 
                        id="amount" 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        className="pl-8 text-lg font-medium" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        data-testid="input-amount"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      className="block" 
                      defaultValue={new Date().toISOString().split('T')[0]} 
                      data-testid="input-date"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="memo">Memo (Optional)</Label>
                    <Input 
                      id="memo" 
                      placeholder="What is this for?" 
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      data-testid="input-memo"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 bg-muted/20 border-t pt-6">
                <Button 
                  className="w-full h-11 text-base bg-primary hover:bg-primary/90"
                  onClick={handleTransfer}
                  disabled={transferMutation.isPending || accountsLoading}
                  data-testid="button-review-transfer"
                >
                  {transferMutation.isPending ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    "Complete Transfer"
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Secure 256-bit encrypted transaction</span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="external">
            <Card>
              <CardHeader>
                <CardTitle>External Transfer</CardTitle>
                <CardDescription>Send money to accounts at other banks</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                Feature available in full version
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bills">
             <Card>
              <CardHeader>
                <CardTitle>Bill Pay</CardTitle>
                <CardDescription>Manage and pay your bills</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                Feature available in full version
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
