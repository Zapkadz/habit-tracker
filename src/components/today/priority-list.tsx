import { CheckCircle2, Circle, Edit3, Target, Trash2 } from "lucide-react";
import type { getDailyPriorities } from "@/server/daily-priorities";
import {
  createDailyPriority,
  deleteDailyPriority,
  updateDailyPriority,
} from "@/server/daily-priorities";
import {
  DAILY_PRIORITY_STATUS_LABELS,
  DAILY_PRIORITY_STATUSES,
  MAX_DAILY_PRIORITIES,
  type DailyPriorityStatus,
} from "@/lib/constants/planner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type DailyPriority = Awaited<ReturnType<typeof getDailyPriorities>>[number];

type PriorityListProps = {
  date: string;
  priorities: DailyPriority[];
};

const statusTone: Record<DailyPriorityStatus, string> = {
  planned: "border-slate-200 bg-slate-50 text-slate-700",
  done: "border-emerald-200 bg-emerald-50 text-emerald-900",
  partial: "border-blue-200 bg-blue-50 text-blue-900",
  skipped: "border-amber-200 bg-amber-50 text-amber-900",
};

function PriorityStatusSelect({
  id,
  defaultValue,
}: {
  id: string;
  defaultValue: DailyPriorityStatus;
}) {
  return (
    <select
      id={id}
      name="status"
      defaultValue={defaultValue}
      className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {DAILY_PRIORITY_STATUSES.map((status) => (
        <option key={status} value={status}>
          {DAILY_PRIORITY_STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}

export function PriorityList({ date, priorities }: PriorityListProps) {
  const canCreate = priorities.length < MAX_DAILY_PRIORITIES;
  const doneCount = priorities.filter((priority) => priority.status === "done")
    .length;

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader className="border-b border-slate-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Target className="size-4" aria-hidden="true" />
              Top 3 Priorities
            </CardTitle>
            <CardDescription>
              A day can be successful when the main priorities move.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="w-fit rounded-lg border-slate-300 bg-slate-50 text-slate-700"
          >
            {doneCount}/{priorities.length} done
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {canCreate ? (
          <form
            action={createDailyPriority}
            className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[minmax(0,1fr)_auto]"
          >
            <input name="date" type="hidden" value={date} />
            <div className="space-y-2">
              <Label htmlFor="new-priority-title">New priority</Label>
              <Input
                id="new-priority-title"
                name="title"
                placeholder="Finish Java Spring lesson"
                minLength={2}
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Add priority
              </Button>
            </div>
          </form>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Today already has 3 priorities.
          </div>
        )}

        {priorities.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center">
            <Circle className="mx-auto size-7 text-slate-400" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-slate-950">
              No priorities yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add up to 3 outcomes that make the day count.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {priorities.map((priority) => (
              <div
                key={priority.id}
                className="rounded-lg border border-slate-200 bg-white p-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-lg bg-slate-900 text-xs font-semibold text-white">
                        {priority.priorityOrder}
                      </span>
                      <p className="font-medium text-slate-950">
                        {priority.title}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn("rounded-lg", statusTone[priority.status])}
                      >
                        {priority.status === "done" ? (
                          <CheckCircle2 className="size-3" aria-hidden="true" />
                        ) : null}
                        {DAILY_PRIORITY_STATUS_LABELS[priority.status]}
                      </Badge>
                    </div>
                    {priority.note ? (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {priority.note}
                      </p>
                    ) : null}
                  </div>

                  <form action={deleteDailyPriority}>
                    <input name="id" type="hidden" value={priority.id} />
                    <input name="date" type="hidden" value={date} />
                    <Button
                      type="submit"
                      variant="destructive"
                      size="icon-sm"
                      title="Delete priority"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </form>
                </div>

                <details className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-medium text-slate-600 marker:hidden">
                    <Edit3 className="size-3.5" aria-hidden="true" />
                    Edit priority
                  </summary>
                  <form
                    action={updateDailyPriority}
                    className="mt-3 grid gap-3 border-t border-slate-200 pt-3"
                  >
                    <input name="id" type="hidden" value={priority.id} />
                    <input name="date" type="hidden" value={date} />
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
                      <div className="space-y-2">
                        <Label htmlFor={`priority-title-${priority.id}`}>
                          Title
                        </Label>
                        <Input
                          id={`priority-title-${priority.id}`}
                          name="title"
                          defaultValue={priority.title}
                          minLength={2}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`priority-status-${priority.id}`}>
                          Status
                        </Label>
                        <PriorityStatusSelect
                          id={`priority-status-${priority.id}`}
                          defaultValue={priority.status}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`priority-note-${priority.id}`}>
                        Note
                      </Label>
                      <textarea
                        id={`priority-note-${priority.id}`}
                        name="note"
                        rows={2}
                        defaultValue={priority.note ?? ""}
                        className="min-h-16 w-full rounded-lg border border-input bg-white px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      />
                    </div>
                    <div>
                      <Button type="submit" size="lg">
                        Save priority
                      </Button>
                    </div>
                  </form>
                </details>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
