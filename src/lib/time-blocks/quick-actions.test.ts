import assert from "node:assert/strict";
import test from "node:test";
import { getTimeBlockQuickUpdate } from "@/lib/time-blocks/quick-actions";

const block = {
  plannedStartTime: "09:00",
  plannedEndTime: "11:00",
  actualStartTime: null,
  actualEndTime: null,
  actualDurationMinutes: null,
};

test("mark done fills actual time from planned when missing", () => {
  assert.deepEqual(getTimeBlockQuickUpdate(block, "mark-done"), {
    status: "done",
    actualStartTime: "09:00",
    actualEndTime: "11:00",
    actualDurationMinutes: 120,
  });
});

test("skip clears actual clock time and records zero minutes", () => {
  assert.deepEqual(getTimeBlockQuickUpdate(block, "mark-skipped"), {
    status: "skipped",
    actualStartTime: null,
    actualEndTime: null,
    actualDurationMinutes: 0,
  });
});

test("partial uses half planned duration when no actual exists", () => {
  assert.deepEqual(getTimeBlockQuickUpdate(block, "mark-partial"), {
    status: "partial",
    actualStartTime: "09:00",
    actualEndTime: null,
    actualDurationMinutes: 60,
  });
});
