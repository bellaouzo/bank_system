import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface SpendingData {
  category: string;
  amount: number;
  color?: string;
}

interface SpendingChartProps {
  data: SpendingData[];
  title?: string;
  description?: string;
  type?: "pie" | "bar";
}

const defaultColors = [
  "hsl(210, 60%, 50%)",
  "hsl(150, 45%, 45%)",
  "hsl(40, 80%, 55%)",
  "hsl(340, 60%, 55%)",
  "hsl(280, 50%, 55%)",
  "hsl(180, 50%, 45%)",
  "hsl(20, 70%, 55%)",
  "hsl(260, 50%, 55%)",
];

export function SpendingChart({ data, title = "Spending by Category", description, type = "pie" }: SpendingChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length],
  }));

  const total = chartData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card data-testid="spending-chart">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {type === "pie" ? (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="amount"
                  nameKey="category"
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">Total Spending</p>
          <p className="text-2xl font-bold text-primary">${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
      </CardContent>
    </Card>
  );
}
