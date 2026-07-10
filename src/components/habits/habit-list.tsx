import {
  Archive,
  CheckCircle2,
  Edit3,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import type { getHabits } from "@/server/habits";
import { deleteHabit, toggleHabitActive } from "@/server/habits";
import {
  HABIT_CATEGORY_LABELS,
  type HabitCategory,
} from "@/lib/constants/habits";
import { HabitForm } from "@/components/habits/habit-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Habit = Awaited<ReturnType<typeof getHabits>>[number];

type HabitListProps = {
  habits: Habit[];
};

function categoryLabel(category: HabitCategory) {
  return HABIT_CATEGORY_LABELS[category] ?? category;
}

export function HabitList({ habits }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <Archive className="mx-auto size-8 text-slate-400" aria-hidden="true" />
        <h2 className="mt-3 text-base font-semibold text-slate-950">
          No habits yet
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Create your first habit above. Keep it small enough to actually use.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-[32%]">Habit</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Weight</TableHead>
            <TableHead className="text-right">Target</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {habits.map((habit) => (
            <TableRow key={habit.id} className="align-top">
              <TableCell className="min-w-64 whitespace-normal">
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-slate-950">{habit.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Icon: {habit.icon} · Logs: {habit._count.logs}
                    </p>
                  </div>
                  <details className="group rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-medium text-slate-600 marker:hidden">
                      <Edit3 className="size-3.5" aria-hidden="true" />
                      Edit habit
                    </summary>
                    <div className="mt-3 border-t border-slate-200 pt-3">
                      <HabitForm habit={habit} mode="edit" />
                    </div>
                  </details>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="rounded-lg border-slate-200 bg-slate-50 text-slate-700"
                >
                  {categoryLabel(habit.category)}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {habit.weight}
              </TableCell>
              <TableCell className="text-right">
                {habit.targetPerWeek}/week
              </TableCell>
              <TableCell>
                <Badge
                  variant={habit.isActive ? "default" : "secondary"}
                  className="rounded-lg"
                >
                  {habit.isActive ? (
                    <CheckCircle2 className="size-3" aria-hidden="true" />
                  ) : (
                    <PowerOff className="size-3" aria-hidden="true" />
                  )}
                  {habit.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <form action={toggleHabitActive}>
                    <input name="id" type="hidden" value={habit.id} />
                    <input
                      name="isActive"
                      type="hidden"
                      value={habit.isActive ? "false" : "true"}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon-sm"
                      title={habit.isActive ? "Deactivate" : "Activate"}
                    >
                      {habit.isActive ? (
                        <PowerOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Power className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  </form>
                  <form action={deleteHabit}>
                    <input name="id" type="hidden" value={habit.id} />
                    <Button
                      type="submit"
                      variant="destructive"
                      size="icon-sm"
                      title="Delete"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
