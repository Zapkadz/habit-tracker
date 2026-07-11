"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyWeeklyProgressPoint } from "@/lib/scoring/monthly-score";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WeeklyProgressChartProps = {
  data: MonthlyWeeklyProgressPoint[];
};

export function WeeklyProgressChart({ data }: WeeklyProgressChartProps) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Weekly Progress
        </CardTitle>
        <CardDescription>
          Habit completion compared by week inside the month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis yAxisId="percent" domain={[0, 100]} tickLine={false} axisLine={false} />
              <YAxis yAxisId="hours" orientation="right" tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar
                yAxisId="percent"
                dataKey="completion"
                name="Completion"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="percent"
                type="monotone"
                dataKey="score"
                name="Avg score"
                stroke="#059669"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="hours"
                type="monotone"
                dataKey="focusHours"
                name="Focus hours"
                stroke="#ea580c"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
