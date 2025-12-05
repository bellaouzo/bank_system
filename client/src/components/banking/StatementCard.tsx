import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, ChevronRight } from "lucide-react";
import type { Account } from "@shared/schema";

interface Statement {
  id: string;
  month: string;
  year: number;
  downloadUrl?: string;
}

interface StatementCardProps {
  account: Account;
  statements: Statement[];
  onDownload?: (statement: Statement) => void;
  onViewAll?: () => void;
}

export function StatementCard({ account, statements, onDownload, onViewAll }: StatementCardProps) {
  return (
    <Card data-testid={`statement-card-${account.id}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          {account.name}
        </CardTitle>
        <CardDescription>Account ending in {account.accountNumber}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {statements.slice(0, 3).map((statement) => (
            <StatementRow 
              key={statement.id} 
              statement={statement} 
              onDownload={() => onDownload?.(statement)} 
            />
          ))}
          {onViewAll && (
            <Button variant="link" className="w-full mt-2 text-primary" onClick={onViewAll}>
              View older statements
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatementRowProps {
  statement: Statement;
  onDownload?: () => void;
}

export function StatementRow({ statement, onDownload }: StatementRowProps) {
  return (
    <div 
      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer group"
      onClick={onDownload}
      data-testid={`statement-row-${statement.id}`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-muted rounded text-muted-foreground group-hover:text-primary transition-colors">
          <Calendar className="w-4 h-4" />
        </div>
        <span className="font-medium text-sm">{statement.month} {statement.year}</span>
      </div>
      <Button variant="ghost" size="sm" className="text-primary gap-1">
        <Download className="w-3 h-3" /> PDF
      </Button>
    </div>
  );
}

export function StatementList({ statements, onDownload }: { statements: Statement[]; onDownload?: (s: Statement) => void }) {
  return (
    <div className="space-y-2" data-testid="statement-list">
      {statements.map((statement) => (
        <StatementRow 
          key={statement.id} 
          statement={statement}
          onDownload={() => onDownload?.(statement)}
        />
      ))}
    </div>
  );
}
