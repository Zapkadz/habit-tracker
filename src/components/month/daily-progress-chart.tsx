"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyChartPoint } from "@/lib/scoring/monthly-score";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DailyProgressChartProps = {
  data: MonthlyChartPoint[];
};

export function DailyProgressChart({ data }: DailyProgressChartProps) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Daily Progress
        </CardTitle>
        <CardDescription>
          Habit completion and Daily Balance Score by day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="completion"
                name="Completion"
                stroke="#2563eb"
                fill="#dbeafe"
                strokeWidth={2}
                connectNulls
              />
              <Area
                type="monotone"
                dataKey="score"
                name="Daily score"
                stroke="#059669"
                fill="#d1fae5"
                strokeWidth={2}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
