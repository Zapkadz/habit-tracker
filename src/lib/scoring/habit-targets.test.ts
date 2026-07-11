import assert from "node:assert/strict";
import test from "node:test";
import { calculateTargetHabitCompletionPercent } from "@/lib/scoring/habit-targets";
import type { HabitStatus } from "@/lib/constants/habits";

test("weekly habit target uses expected occurrences instead of every day", () => {
  const statuses: Array<HabitStatus | null> = [
    "done",
    "done",
    "done",
    null,
    null,
    null,
    null,
  ];

  assert.equal(calculateTargetHabitCompletionPercent(statuses, 3, 7), 100);
});

test("skipped target occurrence is neutral", () => {
  const statuses: Array<HabitStatus | null> = [
    "done",
    "skipped",
    null,
    null,
    null,
    null,
    null,
  ];

  assert.equal(calculateTargetHabitCompletionPercent(statuses, 2, 7), 100);
});
