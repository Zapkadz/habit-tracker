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

type PlanAccuracyChartProps = {
  data: AnalyticsTrendPoint[];
};

export function PlanAccuracyChart({ data }: PlanAccuracyChartProps) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Plan vs Actual
        </CardTitle>
        <CardDescription>
          Planned hours, recorded actual hours, and accuracy percentage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis yAxisId="hours" tickLine={false} axisLine={false} />
              <YAxis
                yAxisId="percent"
                orientation="right"
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Bar
                yAxisId="hours"
                dataKey="plannedHours"
                name="Planned hours"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="hours"
                dataKey="actualHours"
                name="Actual hours"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="percent"
                type="monotone"
                dataKey="planAccuracy"
                name="Accuracy"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
