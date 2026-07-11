"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsCategoryBreakdown } from "@/lib/analytics/trends";
import { minutesToHours } from "@/lib/analytics/trends";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CategoryBreakdownChartProps = {
  data: AnalyticsCategoryBreakdown[];
};

type ChartPoint = {
  label: string;
  plannedHours: number;
  actualHours: number;
  skippedCount: number;
};

function toChartData(data: AnalyticsCategoryBreakdown[]): ChartPoint[] {
  return data.map((item) => ({
    label: item.label,
    plannedHours: minutesToHours(item.plannedMinutes),
    actualHours: minutesToHours(item.actualMinutes),
    skippedCount: item.skippedCount,
  }));
}

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  const chartData = toChartData(data);

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Category Breakdown
        </CardTitle>
        <CardDescription>
          Planned and recorded actual hours by time block category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={70}
              />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar
                dataKey="plannedHours"
                name="Planned hours"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="actualHours"
                name="Actual hours"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="skippedCount"
                name="Skipped blocks"
                fill="#dc2626"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
