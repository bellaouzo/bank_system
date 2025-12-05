import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";
import { accounts } from "@/lib/mockData";

export default function Statements() {
  const months = ["April 2024", "March 2024", "February 2024", "January 2024", "December 2023", "November 2023"];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Statements & Documents</h2>
          <p className="text-muted-foreground mt-1">View and download your monthly account statements.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {accounts.map(account => (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  {account.name}
                </CardTitle>
                <CardDescription>Account ending in {account.number}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {months.slice(0, 3).map((month, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded text-muted-foreground group-hover:text-primary transition-colors">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">{month}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary gap-1">
                        <Download className="w-3 h-3" /> PDF
                      </Button>
                    </div>
                  ))}
                  <Button variant="link" className="w-full mt-2 text-primary">View older statements</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
