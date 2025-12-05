import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Accounts from "@/pages/Accounts";
import AccountDetail from "@/pages/AccountDetail";
import Transfer from "@/pages/Transfer";
import Statements from "@/pages/Statements";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/accounts/:id">
        {({ params }) => <AccountDetail params={params} />}
      </Route>
      <Route path="/accounts" component={Accounts} /> 
      <Route path="/transfer" component={Transfer} />
      <Route path="/statements" component={Statements} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
