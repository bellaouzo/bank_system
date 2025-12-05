import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, CreditCard, DollarSign, Wallet } from "lucide-react";
import { format } from "date-fns";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchAccounts, fetchTransactions } from "@/lib/api";

const chartData = [
  { name: 'Jan', balance: 4000 },
  { name: 'Feb', balance: 3000 },
  { name: 'Mar', balance: 5000 },
  { name: 'Apr', balance: 4500 },
  { name: 'May', balance: 6000 },
  { name: 'Jun', balance: 5500 },
  { name: 'Jul', balance: 7000 },
];

export default function Dashboard() {
  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  const { data: recentTransactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactions(),
  });

  const totalBalance = accounts.reduce((sum, acc) => {
    const balance = parseFloat(acc.balance);
    return acc.type !== 'Credit Card' ? sum + balance : sum - balance;
  }, 0);

  if (accountsLoading || transactionsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">Good Morning, John</h2>
            <p className="text-muted-foreground mt-1">Here is your financial overview for today.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/transfer">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm" data-testid="button-transfer-funds">
                <ArrowUpRight className="mr-2 h-4 w-4" /> Transfer Funds
              </Button>
            </Link>
            <Button variant="outline" className="border-primary/20 hover:bg-primary/5 text-primary" data-testid="button-download-report">
              Download Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="relative overflow-hidden hover:shadow-md transition-shadow duration-200 border-t-4 border-t-primary" data-testid={`card-account-${account.id}`}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex justify-between items-center">
                  {account.type}
                  {account.type === 'Checking' && <Wallet className="h-4 w-4 text-primary/50" />}
                  {account.type === 'Savings' && <DollarSign className="h-4 w-4 text-green-600/50" />}
                  {account.type === 'Credit Card' && <CreditCard className="h-4 w-4 text-amber-500/50" />}
                </CardDescription>
                <CardTitle className="text-lg font-medium text-foreground">{account.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary" data-testid={`text-balance-${account.id}`}>
                  {account.type === 'Credit Card' ? '-' : ''}${parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Available balance • {account.accountNumber}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            <Card>
              <CardHeader>
                <CardTitle>Balance History</CardTitle>
                <CardDescription>Your total assets over the last 7 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorBalance)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest activity across all accounts</CardDescription>
                </div>
                <Link href="/transactions">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid="button-view-all-transactions">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.slice(0, 6).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors group" data-testid={`transaction-${tx.id}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${parseFloat(tx.amount) > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                          {parseFloat(tx.amount) > 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">{tx.category} • {format(new Date(tx.date), 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-sm ${parseFloat(tx.amount) > 0 ? 'text-green-600' : 'text-foreground'}`} data-testid={`text-amount-${tx.id}`}>
                          {parseFloat(tx.amount) > 0 ? '+' : ''}${parseFloat(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Quick Transfer</CardTitle>
                <CardDescription className="text-primary-foreground/80">Send money instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase text-primary-foreground/70">From</label>
                  <div className="p-3 bg-white/10 rounded-md border border-white/10 text-sm flex justify-between items-center">
                    <span>{accounts[0]?.name} {accounts[0]?.accountNumber}</span>
                    <span className="font-mono">${parseFloat(accounts[0]?.balance || "0").toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase text-primary-foreground/70">To</label>
                  <select className="w-full p-3 bg-white text-primary rounded-md border-none text-sm focus:ring-2 focus:ring-white/50 outline-none">
                    {accounts.slice(1).map(acc => (
                      <option key={acc.id}>{acc.name} {acc.accountNumber}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase text-primary-foreground/70">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
                    <input type="number" className="w-full p-3 pl-8 bg-white text-primary rounded-md border-none text-sm font-bold focus:ring-2 focus:ring-white/50 outline-none placeholder:text-primary/30" placeholder="0.00" />
                  </div>
                </div>
                <Link href="/transfer">
                  <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold mt-2" data-testid="button-send-money">
                    Send Money
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Financial Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-md">
                    <p className="text-sm text-amber-900 font-medium">Unusual spending detected</p>
                    <p className="text-xs text-amber-700 mt-1">Your dining expenses are 20% higher than last month.</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                    <p className="text-sm text-green-900 font-medium">Savings Goal Reached</p>
                    <p className="text-xs text-green-700 mt-1">You hit your $10k goal for "Emergency Fund".</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="text-primary w-full text-xs">View all insights</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
