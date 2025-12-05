import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AccountCardSkeleton, TransactionItemSkeleton } from "@/components/banking/LoadingState";
import { ArrowLeft, Search, ArrowUpRight, ArrowDownRight, Wallet, DollarSign, CreditCard, FileText, Bell } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAccount, fetchTransactions } from "@/lib/api";
import { useLocation, Link } from "wouter";

export default function AccountDetail({ params }: { params?: { id?: string } }) {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  
  const accountId = params?.id ? parseInt(params.id) : parseInt(location.split("/").pop() || "0");

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ["account", accountId],
    queryFn: () => fetchAccount(accountId),
    enabled: !!accountId,
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", accountId],
    queryFn: () => fetchTransactions(accountId),
    enabled: !!accountId,
  });

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (accountLoading) {
    return (
      <Layout>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-80" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-7 w-48" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Skeleton className="h-4 w-28 mb-2" />
                    <Skeleton className="h-9 w-40 mb-1" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TransactionItemSkeleton key={i} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!account) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-muted-foreground">Account not found</div>
          <Link href="/accounts">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Accounts
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link href="/accounts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">Account Details</h2>
            <p className="text-muted-foreground mt-1">View transactions and account information.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {account.type === 'Checking' && <Wallet className="h-5 w-5 text-primary" />}
                    {account.type === 'Savings' && <DollarSign className="h-5 w-5 text-green-600" />}
                    {account.type === 'Credit Card' && <CreditCard className="h-5 w-5 text-amber-500" />}
                    <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {account.type}
                    </CardDescription>
                  </div>
                </div>
                <CardTitle className="text-xl mt-2">{account.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-primary">
                    {account.type === 'Credit Card' ? '-' : ''}${parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Account Number • {account.accountNumber}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => setLocation(`/transfer?from=${account.id}`)}
                    className="w-full"
                    data-testid="button-transfer"
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Transfer Funds
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Statements
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Set Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row gap-3 justify-between">
                  <div>
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>
                      {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} found
                    </CardDescription>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TransactionItemSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredTransactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((tx) => {
                        const amount = parseFloat(tx.amount);
                        return (
                          <TableRow key={tx.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium text-muted-foreground">
                              {format(new Date(tx.date), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-foreground">{tx.description}</div>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                {tx.category}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`text-xs ${tx.status === 'pending' ? 'text-amber-600 font-medium' : 'text-green-600 font-medium'}`}>
                                {tx.status.toUpperCase()}
                              </span>
                            </TableCell>
                            <TableCell className={`text-right font-bold ${amount > 0 ? 'text-green-600' : 'text-foreground'}`}>
                              <div className="flex items-center justify-end gap-1">
                                {amount > 0 ? (
                                  <ArrowDownRight className="w-4 h-4 text-green-600" />
                                ) : (
                                  <ArrowUpRight className="w-4 h-4" />
                                )}
                                {amount > 0 ? '+' : ''}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <div className="text-muted-foreground">
                      {searchTerm ? "No transactions found matching your search." : "No transactions found for this account."}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

