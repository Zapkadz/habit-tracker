import assert from "node:assert/strict";
import test from "node:test";
import { calculateDailyBalance } from "@/lib/scoring/daily-score";
import { calculateHabitScore } from "@/lib/scoring/habit-score";

test("blank day is incomplete instead of burnout risk", () => {
  const result = calculateDailyBalance({
    dayType: "normal",
    checkin: null,
    habits: [
      { weight: 5, log: null },
      { weight: 5, log: null },
    ],
    priorities: [],
    timeBlocks: [],
  });

  assert.equal(result.dataStatus.state, "empty");
  assert.equal(result.scoreLabel, "Incomplete");
  assert.equal(result.warningLevel, "notice");
  assert.equal(result.totalScore, 0);
});

test("planned focus block does not count as actual focus", () => {
  const result = calculateDailyBalance({
    dayType: "normal",
    checkin: {
      dayType: "normal",
      sleepStart: "23:00",
      wakeTime: "07:00",
      mood: 7,
      motivation: 7,
      stress: 3,
    },
    habits: [{ weight: 5, log: { status: "done" } }],
    priorities: [],
    timeBlocks: [
      {
        category: "deep_work",
        plannedStartTime: "09:00",
        plannedEndTime: "12:00",
        status: "planned",
        actualDurationMinutes: null,
      },
      {
        category: "rest",
        plannedStartTime: "12:00",
        plannedEndTime: "13:00",
        status: "done",
        actualDurationMinutes: 60,
      },
    ],
  });

  assert.equal(result.metrics.plannedFocusMinutes, 180);
  assert.equal(result.metrics.actualFocusMinutes, 0);
  assert.equal(result.metrics.focusMinutes, 0);
  assert.equal(result.scoreLabel, "Incomplete");
});

test("missing and skipped habits are neutral while missed remains zero", () => {
  assert.equal(
    calculateHabitScore([
      { weight: 5, log: { status: "done" } },
      { weight: 5, log: { status: "skipped" } },
      { weight: 5, log: null },
    ]),
    100
  );

  assert.equal(
    calculateHabitScore([
      { weight: 5, log: { status: "done" } },
      { weight: 5, log: { status: "missed" } },
      { weight: 5, log: { status: "skipped" } },
    ]),
    50
  );
});
