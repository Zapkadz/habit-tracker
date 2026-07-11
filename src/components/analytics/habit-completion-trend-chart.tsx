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
import type { AnalyticsTrendPoint } from "@/lib/analytics/trends";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type HabitCompletionTrendChartProps = {
  data: AnalyticsTrendPoint[];
};

export function HabitCompletionTrendChart({
  data,
}: HabitCompletionTrendChartProps) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Habit Completion
        </CardTitle>
        <CardDescription>
          Daily habit completion with risk days marked as a thin line.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis yAxisId="percent" domain={[0, 100]} tickLine={false} axisLine={false} />
              <YAxis yAxisId="risk" orientation="right" domain={[0, 1]} hide />
              <Tooltip />
              <Bar
                yAxisId="percent"
                dataKey="habitCompletion"
                name="Habit completion"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="risk"
                type="stepAfter"
                dataKey="risk"
                name="Risk day"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
