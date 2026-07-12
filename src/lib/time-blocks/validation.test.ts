import assert from "node:assert/strict";
import test from "node:test";
import {
  getOverlappingTimeBlockIds,
  validateTimeBlockInput,
} from "@/lib/time-blocks/validation";

const validInput = {
  title: "Deep work",
  plannedStartTime: "09:00",
  plannedEndTime: "11:00",
  actualStartTime: null,
  actualEndTime: null,
  actualDurationMinutes: null,
  status: "planned" as const,
  note: null,
};

test("time block validation keeps overnight planned ranges", () => {
  const result = validateTimeBlockInput({
    ...validInput,
    plannedStartTime: "23:00",
    plannedEndTime: "07:00",
  });

  assert.equal(result.plannedStartTime, "23:00");
  assert.equal(result.plannedEndTime, "07:00");
});

test("time block validation rejects incomplete actual clocks", () => {
  assert.throws(
    () =>
      validateTimeBlockInput({
        ...validInput,
        actualStartTime: "09:15",
      }),
    /provided together/
  );
});

test("done blocks require actual time", () => {
  assert.throws(
    () => validateTimeBlockInput({ ...validInput, status: "done" }),
    /need actual time/
  );
});

test("skipped blocks normalize missing actual duration to zero", () => {
  const result = validateTimeBlockInput({
    ...validInput,
    status: "skipped",
  });

  assert.equal(result.actualDurationMinutes, 0);
});

test("actual clocks and explicit minutes must agree", () => {
  assert.throws(
    () =>
      validateTimeBlockInput({
        ...validInput,
        status: "done",
        actualStartTime: "09:15",
        actualEndTime: "10:15",
        actualDurationMinutes: 30,
      }),
    /must match/
  );
});

test("overlap detection supports ordinary and overnight blocks", () => {
  const overlaps = getOverlappingTimeBlockIds([
    { id: "a", plannedStartTime: "09:00", plannedEndTime: "11:00" },
    { id: "b", plannedStartTime: "10:30", plannedEndTime: "12:00" },
    { id: "c", plannedStartTime: "23:00", plannedEndTime: "07:00" },
    { id: "d", plannedStartTime: "06:30", plannedEndTime: "08:00" },
    { id: "e", plannedStartTime: "12:00", plannedEndTime: "13:00" },
  ]);

  assert.deepEqual([...overlaps].sort(), ["a", "b", "c", "d"]);
});

test("touching time blocks do not count as overlapping", () => {
  const overlaps = getOverlappingTimeBlockIds([
    { id: "a", plannedStartTime: "09:00", plannedEndTime: "10:00" },
    { id: "b", plannedStartTime: "10:00", plannedEndTime: "11:00" },
  ]);

  assert.equal(overlaps.size, 0);
});
