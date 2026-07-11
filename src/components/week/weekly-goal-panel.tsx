import { Edit3, Plus, Target, Trash2 } from "lucide-react";
import type { getWeeklyBalance } from "@/server/weekly-balance";
import {
  createWeeklyGoal,
  deleteWeeklyGoal,
  updateWeeklyGoal,
} from "@/server/weekly-goals";
import {
  DEFAULT_WEEKLY_GOAL_UNIT,
  WEEKLY_GOAL_CATEGORIES,
  WEEKLY_GOAL_CATEGORY_LABELS,
  WEEKLY_GOAL_UNITS,
} from "@/lib/constants/weekly-goals";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type WeeklyBalance = Awaited<ReturnType<typeof getWeeklyBalance>>;
type WeeklyGoal = WeeklyBalance["goals"][number];

type WeeklyGoalPanelProps = {
  weekStartDate: string;
  goals: WeeklyBalance["goals"];
};

function categoryLabel(category: string) {
  if (category in WEEKLY_GOAL_CATEGORY_LABELS) {
    return WEEKLY_GOAL_CATEGORY_LABELS[
      category as keyof typeof WEEKLY_GOAL_CATEGORY_LABELS
    ];
  }

  return category;
}

function GoalFields({
  goal,
  idPrefix,
}: {
  goal?: WeeklyGoal;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.7fr_0.7fr_0.7fr]">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-title`}>Goal</Label>
        <Input
          id={`${idPrefix}-title`}
          name="title"
          placeholder="N2 study"
          defaultValue={goal?.title}
          required
          minLength={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-category`}>Category</Label>
        <select
          id={`${idPrefix}-category`}
          name="category"
          defaultValue={goal?.category ?? "study"}
          className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {WEEKLY_GOAL_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {WEEKLY_GOAL_CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-current`}>Current</Label>
        <Input
          id={`${idPrefix}-current`}
          name="currentValue"
          type="number"
          min="0"
          max="1000"
          step="0.25"
          defaultValue={goal?.currentValue ?? 0}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-target`}>Target</Label>
        <Input
          id={`${idPrefix}-target`}
          name="targetValue"
          type="number"
          min="0.1"
          max="1000"
          step="0.25"
          defaultValue={goal?.targetValue ?? 1}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-unit`}>Unit</Label>
        <select
          id={`${idPrefix}-unit`}
          name="unit"
          defaultValue={goal?.unit ?? DEFAULT_WEEKLY_GOAL_UNIT}
          className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {WEEKLY_GOAL_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ProgressBar({ goal }: { goal: WeeklyGoal }) {
  const cappedProgress = Math.min(goal.progressPercent, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-slate-500">Progress</span>
        <span className="font-medium text-slate-950">
          {goal.progressPercent}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            goal.isBehind ? "bg-amber-500" : "bg-slate-900"
          }`}
          style={{ width: `${cappedProgress}%` }}
        />
      </div>
    </div>
  );
}

export function WeeklyGoalPanel({
  weekStartDate,
  goals,
}: WeeklyGoalPanelProps) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Target className="size-4" aria-hidden="true" />
          Weekly Goals
        </CardTitle>
        <CardDescription>
          Track the goals that decide whether the week is actually moving.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          action={createWeeklyGoal}
          className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
        >
          <input name="weekStartDate" type="hidden" value={weekStartDate} />
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Plus className="size-4" aria-hidden="true" />
            Add weekly goal
          </div>
          <GoalFields idPrefix="weekly-goal-new" />
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Create goal
            </Button>
          </div>
        </form>

        {goals.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
            <Target className="mx-auto size-7 text-slate-400" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-slate-950">
              No weekly goals yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add one target like N2 hours, Java lessons, or recovery days.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-[38%]">Goal</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Current / Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goals.map((goal) => (
                  <TableRow key={goal.id} className="align-top">
                    <TableCell className="min-w-72 whitespace-normal">
                      <div className="space-y-2">
                        <div>
                          <p className="font-medium text-slate-950">
                            {goal.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {categoryLabel(goal.category)} - Expected{" "}
                            {goal.expectedPercent}%
                          </p>
                        </div>
                        <details className="group rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                          <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-medium text-slate-600 marker:hidden">
                            <Edit3 className="size-3.5" aria-hidden="true" />
                            Edit goal
                          </summary>
                          <form
                            action={updateWeeklyGoal}
                            className="mt-3 grid gap-3 border-t border-slate-200 pt-3"
                          >
                            <input
                              name="weekStartDate"
                              type="hidden"
                              value={weekStartDate}
                            />
                            <input name="id" type="hidden" value={goal.id} />
                            <GoalFields goal={goal} idPrefix={`goal-${goal.id}`} />
                            <div className="flex justify-end">
                              <Button type="submit" size="lg">
                                Save goal
                              </Button>
                            </div>
                          </form>
                        </details>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-40">
                      <ProgressBar goal={goal} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-lg ${
                          goal.isBehind
                            ? "border-amber-200 bg-amber-50 text-amber-900"
                            : "border-emerald-200 bg-emerald-50 text-emerald-900"
                        }`}
                      >
                        {goal.isBehind ? "Behind" : "On pace"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <form action={deleteWeeklyGoal} className="flex justify-end">
                        <input
                          name="weekStartDate"
                          type="hidden"
                          value={weekStartDate}
                        />
                        <input name="id" type="hidden" value={goal.id} />
                        <Button
                          type="submit"
                          variant="destructive"
                          size="icon-sm"
                          title="Delete"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
