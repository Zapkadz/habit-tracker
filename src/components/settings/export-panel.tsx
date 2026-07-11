import { Download, FileJson, Table } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ExportPanelProps = {
  counts: {
    habits: number;
    habitLogs: number;
    timeBlocks: number;
    dailyCheckins: number;
    dailyPriorities: number;
    weeklyGoals: number;
  };
};

const exports = [
  {
    label: "Full JSON",
    href: "/export/full",
    description: "All core local tables in one portable snapshot.",
    icon: FileJson,
  },
  {
    label: "Habit Logs CSV",
    href: "/export/habit-logs",
    description: "Daily habit statuses for spreadsheet review.",
    icon: Table,
  },
  {
    label: "Time Blocks CSV",
    href: "/export/time-blocks",
    description: "Planned and actual time block history.",
    icon: Table,
  },
  {
    label: "Check-ins CSV",
    href: "/export/checkins",
    description: "Mood, motivation, stress, sleep, and notes.",
    icon: Table,
  },
] as const;

export function ExportPanel({ counts }: ExportPanelProps) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Download className="size-4" aria-hidden="true" />
          Export Data
        </CardTitle>
        <CardDescription>
          Download local data for review or backup. Exports do not modify the
          database.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Habits
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-950">
              {counts.habits}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Logs
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-950">
              {counts.habitLogs}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Time Blocks
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-950">
              {counts.timeBlocks}
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {exports.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.href}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-white text-slate-700">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-950">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                    <a
                      href={item.href}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "mt-3",
                      })}
                    >
                      <Download className="size-3.5" aria-hidden="true" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
