import assert from "node:assert/strict";
import test from "node:test";
import {
  getBackupRecordCounts,
  parseBackupSnapshot,
  parseBackupSnapshotText,
} from "@/lib/backup/backup-schema";

const timestamp = "2026-07-12T05:00:00.000Z";

function createSnapshot() {
  return {
    schemaVersion: 1,
    exportedAt: timestamp,
    app: "Habit Tracker - Routine Balance Dashboard",
    data: {
      habits: [
        {
          id: "habit-1",
          name: "Study",
          icon: "book-open",
          category: "study",
          weight: 8,
          targetPerWeek: 5,
          isActive: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      habitLogs: [
        {
          id: "log-1",
          habitId: "habit-1",
          date: timestamp,
          status: "done",
          note: null,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      timeBlocks: [],
      dailyCheckins: [],
      dailyScores: [],
      dailyPriorities: [],
      weeklyGoals: [],
    },
  };
}

test("backup parser accepts a valid versioned snapshot", () => {
  const snapshot = parseBackupSnapshot(createSnapshot());

  assert.equal(snapshot.schemaVersion, 1);
  assert.deepEqual(getBackupRecordCounts(snapshot), {
    habits: 1,
    habitLogs: 1,
    timeBlocks: 0,
    dailyCheckins: 0,
    dailyScores: 0,
    dailyPriorities: 0,
    weeklyGoals: 0,
  });
});

test("backup parser keeps compatibility with legacy version field", () => {
  const legacy = createSnapshot() as Record<string, unknown>;
  legacy.version = 1;
  delete legacy.schemaVersion;

  assert.equal(parseBackupSnapshot(legacy).schemaVersion, 1);
});

test("backup parser rejects unsupported schema versions", () => {
  const snapshot = createSnapshot();
  snapshot.schemaVersion = 2;

  assert.throws(() => parseBackupSnapshot(snapshot), /expected version 1/);
});

test("backup parser rejects snapshots from another application", () => {
  const snapshot = createSnapshot();
  snapshot.app = "Another app";

  assert.throws(() => parseBackupSnapshot(snapshot), /different application/);
});

test("backup parser rejects habit logs with missing habits", () => {
  const snapshot = createSnapshot();
  snapshot.data.habits = [];

  assert.throws(() => parseBackupSnapshot(snapshot), /habit "habit-1" is missing/);
});

test("backup parser reports invalid JSON", () => {
  assert.throws(() => parseBackupSnapshotText("{invalid"), /not valid JSON/);
});

test("backup parser rejects invalid check-in clock values", () => {
  const snapshot = createSnapshot();
  const dailyCheckins = snapshot.data.dailyCheckins as Array<
    Record<string, unknown>
  >;
  dailyCheckins.push({
    id: "checkin-1",
    date: timestamp,
    dayType: "normal",
    sleepStart: "25:00",
    wakeTime: null,
    mood: null,
    motivation: null,
    stress: null,
    note: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  assert.throws(() => parseBackupSnapshot(snapshot), /valid HH:mm time/);
});
