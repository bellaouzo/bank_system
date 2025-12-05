import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Building2, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface Bill {
  id: string;
  payee: string;
  amount: number;
  dueDate: Date;
  status: "upcoming" | "due_soon" | "overdue" | "paid" | "scheduled";
  category?: string;
  autopay?: boolean;
}

interface BillPayCardProps {
  bills: Bill[];
  onPayBill?: (bill: Bill) => void;
  onViewAll?: () => void;
}

const statusConfig = {
  upcoming: { color: "text-muted-foreground", bg: "bg-muted", icon: Clock },
  due_soon: { color: "text-amber-600", bg: "bg-amber-50", icon: AlertCircle },
  overdue: { color: "text-red-600", bg: "bg-red-50", icon: AlertCircle },
  paid: { color: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
  scheduled: { color: "text-blue-600", bg: "bg-blue-50", icon: Calendar },
};

export function BillPayCard({ bills, onPayBill, onViewAll }: BillPayCardProps) {
  const upcomingBills = bills.filter(b => b.status !== "paid").slice(0, 4);
  const totalDue = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <Card data-testid="bill-pay-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Upcoming Bills
            </CardTitle>
            <CardDescription>Total due: ${totalDue.toLocaleString()}</CardDescription>
          </div>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingBills.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No upcoming bills</p>
          ) : (
            upcomingBills.map((bill) => (
              <BillRow key={bill.id} bill={bill} onPay={() => onPayBill?.(bill)} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface BillRowProps {
  bill: Bill;
  onPay?: () => void;
}

export function BillRow({ bill, onPay }: BillRowProps) {
  const config = statusConfig[bill.status];
  const Icon = config.icon;
  const daysUntilDue = differenceInDays(bill.dueDate, new Date());

  const getDueDateLabel = () => {
    if (bill.status === "paid") return "Paid";
    if (bill.status === "scheduled") return "Scheduled";
    if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return "Due today";
    if (daysUntilDue === 1) return "Due tomorrow";
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <div 
      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
      data-testid={`bill-row-${bill.id}`}
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", config.bg)}>
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>
        <div>
          <p className="font-medium text-sm">{bill.payee}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{format(bill.dueDate, "MMM d, yyyy")}</span>
            {bill.autopay && (
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                AutoPay
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="text-right flex items-center gap-3">
        <div>
          <p className="font-bold text-sm">${bill.amount.toLocaleString()}</p>
          <p className={cn("text-xs", config.color)}>{getDueDateLabel()}</p>
        </div>
        {bill.status !== "paid" && bill.status !== "scheduled" && (
          <Button size="sm" onClick={onPay}>
            Pay
          </Button>
        )}
      </div>
    </div>
  );
}
