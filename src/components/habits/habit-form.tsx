import type { getHabits } from "@/server/habits";
import { createHabit, updateHabit } from "@/server/habits";
import {
  DEFAULT_HABIT_WEIGHT,
  DEFAULT_TARGET_PER_WEEK,
  HABIT_CATEGORIES,
  HABIT_CATEGORY_LABELS,
  MAX_HABIT_WEIGHT,
  MAX_TARGET_PER_WEEK,
  MIN_HABIT_WEIGHT,
  MIN_TARGET_PER_WEEK,
} from "@/lib/constants/habits";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PendingSubmitButton } from "@/components/ui/pending-submit-button";

type Habit = Awaited<ReturnType<typeof getHabits>>[number];

type HabitFormProps = {
  habit?: Habit;
  mode?: "create" | "edit";
};

export function HabitForm({ habit, mode = "create" }: HabitFormProps) {
  const isEdit = mode === "edit" && habit;
  const action = isEdit ? updateHabit : createHabit;

  return (
    <form action={action} className="grid gap-4">
      {isEdit ? <input name="id" type="hidden" value={habit.id} /> : null}

      <div className="grid gap-3 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr]">
        <div className="space-y-2">
          <Label htmlFor={isEdit ? `habit-name-${habit.id}` : "habit-name"}>
            Name
          </Label>
          <Input
            id={isEdit ? `habit-name-${habit.id}` : "habit-name"}
            name="name"
            placeholder="Study N2"
            defaultValue={habit?.name}
            required
            minLength={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={isEdit ? `habit-icon-${habit.id}` : "habit-icon"}>
            Icon key
          </Label>
          <Input
            id={isEdit ? `habit-icon-${habit.id}` : "habit-icon"}
            name="icon"
            placeholder="book-open"
            defaultValue={habit?.icon ?? "circle-check"}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={isEdit ? `habit-weight-${habit.id}` : "habit-weight"}
          >
            Weight
          </Label>
          <Input
            id={isEdit ? `habit-weight-${habit.id}` : "habit-weight"}
            name="weight"
            type="number"
            min={MIN_HABIT_WEIGHT}
            max={MAX_HABIT_WEIGHT}
            defaultValue={habit?.weight ?? DEFAULT_HABIT_WEIGHT}
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={
              isEdit ? `habit-target-${habit.id}` : "habit-target-per-week"
            }
          >
            Target / week
          </Label>
          <Input
            id={isEdit ? `habit-target-${habit.id}` : "habit-target-per-week"}
            name="targetPerWeek"
            type="number"
            min={MIN_TARGET_PER_WEEK}
            max={MAX_TARGET_PER_WEEK}
            defaultValue={habit?.targetPerWeek ?? DEFAULT_TARGET_PER_WEEK}
            required
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="space-y-2">
          <Label
            htmlFor={isEdit ? `habit-category-${habit.id}` : "habit-category"}
          >
            Category
          </Label>
          <select
            id={isEdit ? `habit-category-${habit.id}` : "habit-category"}
            name="category"
            defaultValue={habit?.category ?? "personal"}
            className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {HABIT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {HABIT_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
          <label className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={habit?.isActive ?? true}
              className="size-4 rounded border-slate-300"
            />
            Active
          </label>
          <PendingSubmitButton size="lg">
            {isEdit ? "Save habit" : "Create habit"}
          </PendingSubmitButton>
        </div>
      </div>
    </form>
  );
}
