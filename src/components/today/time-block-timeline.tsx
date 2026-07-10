import { Clock3, Edit3, Plus, Trash2 } from "lucide-react";
import type { getTimeBlocks } from "@/server/time-blocks";
import {
  createTimeBlock,
  deleteTimeBlock,
  updateTimeBlock,
} from "@/server/time-blocks";
import {
  TIME_BLOCK_CATEGORIES,
  TIME_BLOCK_CATEGORY_LABELS,
  TIME_BLOCK_STATUSES,
  TIME_BLOCK_STATUS_LABELS,
  type TimeBlockCategory,
  type TimeBlockStatus,
} from "@/lib/constants/planner";
import { formatDuration, minutesBetween } from "@/lib/dates/time-utils";
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

type TimeBlock = Awaited<ReturnType<typeof getTimeBlocks>>[number];

type TimeBlockTimelineProps = {
  date: string;
  timeBlocks: TimeBlock[];
};

type TimeBlockFormProps = {
  date: string;
  block?: TimeBlock;
  mode?: "create" | "edit";
};

const categoryTone: Record<TimeBlockCategory, string> = {
  sleep: "border-indigo-200 bg-indigo-50 text-indigo-900",
  deep_work: "border-blue-200 bg-blue-50 text-blue-900",
  study: "border-cyan-200 bg-cyan-50 text-cyan-900",
  work: "border-slate-200 bg-slate-50 text-slate-800",
  rest: "border-emerald-200 bg-emerald-50 text-emerald-900",
  exercise: "border-lime-200 bg-lime-50 text-lime-900",
  entertainment: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900",
  personal: "border-teal-200 bg-teal-50 text-teal-900",
  meal: "border-amber-200 bg-amber-50 text-amber-900",
  commute: "border-zinc-200 bg-zinc-50 text-zinc-800",
  social: "border-violet-200 bg-violet-50 text-violet-900",
  other: "border-stone-200 bg-stone-50 text-stone-800",
};

const statusTone: Record<TimeBlockStatus, string> = {
  planned: "border-slate-200 bg-slate-50 text-slate-700",
  done: "border-emerald-200 bg-emerald-50 text-emerald-900",
  partial: "border-blue-200 bg-blue-50 text-blue-900",
  skipped: "border-rose-200 bg-rose-50 text-rose-900",
};

function CategorySelect({
  id,
  defaultValue,
}: {
  id: string;
  defaultValue: TimeBlockCategory;
}) {
  return (
    <select
      id={id}
      name="category"
      defaultValue={defaultValue}
      className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {TIME_BLOCK_CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {TIME_BLOCK_CATEGORY_LABELS[category]}
        </option>
      ))}
    </select>
  );
}

function StatusSelect({
  id,
  defaultValue,
}: {
  id: string;
  defaultValue: TimeBlockStatus;
}) {
  return (
    <select
      id={id}
      name="status"
      defaultValue={defaultValue}
      className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {TIME_BLOCK_STATUSES.map((status) => (
        <option key={status} value={status}>
          {TIME_BLOCK_STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}

function TimeBlockForm({
  date,
  block,
  mode = "create",
}: TimeBlockFormProps) {
  const isEdit = mode === "edit" && block;
  const action = isEdit ? updateTimeBlock : createTimeBlock;
  const idPrefix = isEdit ? block.id : "new-time-block";

  return (
    <form action={action} className="grid gap-3">
      <input name="date" type="hidden" value={date} />
      {isEdit ? <input name="id" type="hidden" value={block.id} /> : null}

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_110px_110px]">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-title`}>Title</Label>
          <Input
            id={`${idPrefix}-title`}
            name="title"
            placeholder="N2 vocabulary"
            defaultValue={block?.title ?? ""}
            minLength={2}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-category`}>Category</Label>
          <CategorySelect
            id={`${idPrefix}-category`}
            defaultValue={block?.category ?? "study"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-planned-start`}>Start</Label>
          <Input
            id={`${idPrefix}-planned-start`}
            name="plannedStartTime"
            type="time"
            defaultValue={block?.plannedStartTime ?? ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-planned-end`}>End</Label>
          <Input
            id={`${idPrefix}-planned-end`}
            name="plannedEndTime"
            type="time"
            defaultValue={block?.plannedEndTime ?? ""}
            required
          />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[110px_110px_120px_110px_110px_140px]">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-actual-start`}>Actual start</Label>
          <Input
            id={`${idPrefix}-actual-start`}
            name="actualStartTime"
            type="time"
            defaultValue={block?.actualStartTime ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-actual-end`}>Actual end</Label>
          <Input
            id={`${idPrefix}-actual-end`}
            name="actualEndTime"
            type="time"
            defaultValue={block?.actualEndTime ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-actual-duration`}>Actual min</Label>
          <Input
            id={`${idPrefix}-actual-duration`}
            name="actualDurationMinutes"
            type="number"
            min={0}
            max={1440}
            defaultValue={block?.actualDurationMinutes ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-priority`}>Priority</Label>
          <Input
            id={`${idPrefix}-priority`}
            name="priority"
            type="number"
            min={1}
            max={5}
            defaultValue={block?.priority ?? 3}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-energy`}>Energy</Label>
          <Input
            id={`${idPrefix}-energy`}
            name="energyLevel"
            type="number"
            min={1}
            max={10}
            defaultValue={block?.energyLevel ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <StatusSelect
            id={`${idPrefix}-status`}
            defaultValue={block?.status ?? "planned"}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-note`}>Note</Label>
        <textarea
          id={`${idPrefix}-note`}
          name="note"
          rows={2}
          defaultValue={block?.note ?? ""}
          className="min-h-16 w-full rounded-lg border border-input bg-white px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div>
        <Button type="submit" size="lg">
          {isEdit ? "Save block" : "Add block"}
        </Button>
      </div>
    </form>
  );
}

export function TimeBlockTimeline({
  date,
  timeBlocks,
}: TimeBlockTimelineProps) {
  const plannedMinutes = timeBlocks.reduce(
    (sum, block) =>
      sum + minutesBetween(block.plannedStartTime, block.plannedEndTime),
    0
  );

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader className="border-b border-slate-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Clock3 className="size-4" aria-hidden="true" />
              Timeline / Time Blocks
            </CardTitle>
            <CardDescription>
              Plan time ranges without forcing every block to become a habit.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="w-fit rounded-lg border-slate-300 bg-slate-50 text-slate-700"
          >
            {timeBlocks.length} blocks - {formatDuration(plannedMinutes)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <details className="rounded-lg border border-slate-200 bg-slate-50 p-3" open>
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-700 marker:hidden">
            <Plus className="size-4" aria-hidden="true" />
            Add time block
          </summary>
          <div className="mt-3 border-t border-slate-200 pt-3">
            <TimeBlockForm date={date} />
          </div>
        </details>

        {timeBlocks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
            <Clock3 className="mx-auto size-8 text-slate-400" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-slate-950">
              No time blocks planned
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add sleep, study, work, and recovery blocks to make the day visible.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {timeBlocks.map((block) => {
              const plannedDuration = minutesBetween(
                block.plannedStartTime,
                block.plannedEndTime
              );

              return (
                <div
                  key={block.id}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="grid gap-3 lg:grid-cols-[110px_minmax(0,1fr)_auto] lg:items-start">
                    <div className="rounded-lg bg-slate-950 px-3 py-2 text-center text-sm font-semibold text-white">
                      {block.plannedStartTime}
                      <span className="block text-xs font-normal text-slate-300">
                        {block.plannedEndTime}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-950">
                          {block.title}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-lg",
                            categoryTone[block.category]
                          )}
                        >
                          {TIME_BLOCK_CATEGORY_LABELS[block.category]}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn("rounded-lg", statusTone[block.status])}
                        >
                          {TIME_BLOCK_STATUS_LABELS[block.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Planned {formatDuration(plannedDuration)} - Priority{" "}
                        {block.priority}
                        {block.energyLevel
                          ? ` - Energy ${block.energyLevel}/10`
                          : ""}
                      </p>
                      {block.actualDurationMinutes ||
                      block.actualStartTime ||
                      block.actualEndTime ? (
                        <p className="mt-1 text-xs text-slate-500">
                          Actual: {block.actualStartTime ?? "--"} to{" "}
                          {block.actualEndTime ?? "--"}
                          {block.actualDurationMinutes
                            ? ` - ${formatDuration(
                                block.actualDurationMinutes
                              )}`
                            : ""}
                        </p>
                      ) : null}
                      {block.note ? (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {block.note}
                        </p>
                      ) : null}
                    </div>

                    <form action={deleteTimeBlock}>
                      <input name="id" type="hidden" value={block.id} />
                      <input name="date" type="hidden" value={date} />
                      <Button
                        type="submit"
                        variant="destructive"
                        size="icon-sm"
                        title="Delete time block"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </form>
                  </div>

                  <details className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-medium text-slate-600 marker:hidden">
                      <Edit3 className="size-3.5" aria-hidden="true" />
                      Edit time block
                    </summary>
                    <div className="mt-3 border-t border-slate-200 pt-3">
                      <TimeBlockForm date={date} block={block} mode="edit" />
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
