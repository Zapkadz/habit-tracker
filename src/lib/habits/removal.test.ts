import assert from "node:assert/strict";
import test from "node:test";
import { getHabitRemovalMode } from "@/lib/habits/removal";

test("habit with logs is archived instead of hard deleted", () => {
  assert.equal(getHabitRemovalMode(1), "archive");
});

test("habit without logs can be hard deleted", () => {
  assert.equal(getHabitRemovalMode(0), "delete");
});
