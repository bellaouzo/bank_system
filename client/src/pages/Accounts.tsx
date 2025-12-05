import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { AccountCard } from "@/components/banking/AccountCard";
import { CreateAccountDialog } from "@/components/banking/CreateAccountDialog";
import { ConfirmDialog } from "@/components/banking/ConfirmDialog";
import { AccountCardSkeleton } from "@/components/banking/LoadingState";
import { Plus, Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAccounts, deleteAccount } from "@/lib/api";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Account } from "@shared/schema";

export default function Accounts() {
  const [, setLocation] = useLocation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Account Deleted",
        description: "The account has been deleted successfully.",
      });
      setDeleteConfirmOpen(false);
      setAccountToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Delete Account",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const assets = accounts
    .filter(acc => acc.type !== 'Credit Card')
    .reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

  const liabilities = accounts
    .filter(acc => acc.type === 'Credit Card')
    .reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

  const totalBalance = assets - liabilities;

  const handleViewDetails = (account: Account) => {
    setLocation(`/accounts/${account.id}`);
  };

  const handleTransfer = (account: Account) => {
    setLocation(`/transfer?from=${account.id}`);
  };

  const handleDelete = (account: Account) => {
    setAccountToDelete(account);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (accountToDelete) {
      deleteMutation.mutate(accountToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-80" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <AccountCardSkeleton key={i} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-56" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">Accounts</h2>
            <p className="text-muted-foreground mt-1">Manage your accounts and view balances.</p>
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" /> New Account
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {accounts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Wallet className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No accounts yet</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                    Get started by creating your first account to manage your finances.
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Account
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid grid-cols-1 ${accounts.length === 1 ? '' : 'md:grid-cols-2'} gap-6`}>
                {accounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onViewDetails={handleViewDetails}
                    onTransfer={handleTransfer}
                    onDelete={handleDelete}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Overview</CardTitle>
                <CardDescription>Summary of your assets and liabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Net Worth</p>
                  <div className="text-3xl font-bold text-primary">
                    ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-muted-foreground">
                        <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                        Total Assets
                      </span>
                      <span className="font-medium text-green-600">
                        ${assets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <Progress value={assets > 0 ? (assets / (assets + liabilities)) * 100 : 0} className="h-2 bg-green-100 [&>div]:bg-green-600" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-muted-foreground">
                        <TrendingDown className="mr-2 h-4 w-4 text-red-600" />
                        Total Liabilities
                      </span>
                      <span className="font-medium text-red-600">
                        ${liabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <Progress value={liabilities > 0 ? (liabilities / (assets + liabilities)) * 100 : 0} className="h-2 bg-red-100 [&>div]:bg-red-600" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Accounts</span>
                    <span className="font-medium">{accounts.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground border-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/10 rounded-full">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Financial Goal</h3>
                    <p className="text-sm text-primary-foreground/80">Emergency Fund</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2 bg-black/20 [&>div]:bg-white" />
                  <p className="text-xs text-primary-foreground/70 mt-2">
                    You're $2,500 away from your goal of $10,000.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <CreateAccountDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />

        <ConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title="Delete Account"
          description={
            accountToDelete
              ? `Are you sure you want to delete "${accountToDelete.name}"? This action cannot be undone and will delete all associated transactions and transfers.`
              : ""
          }
          confirmLabel="Delete Account"
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={confirmDelete}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </Layout>
  );
}

