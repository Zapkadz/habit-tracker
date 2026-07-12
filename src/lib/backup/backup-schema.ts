import {
  HABIT_CATEGORIES,
  HABIT_STATUSES,
  type HabitCategory,
  type HabitStatus,
} from "@/lib/constants/habits";
import {
  DAILY_PRIORITY_STATUSES,
  TIME_BLOCK_CATEGORIES,
  TIME_BLOCK_STATUSES,
  type DailyPriorityStatus,
  type TimeBlockCategory,
  type TimeBlockStatus,
} from "@/lib/constants/planner";
import { DAY_TYPES, type DayType } from "@/lib/constants/day-types";
import { WARNING_LEVELS, type WarningLevel } from "@/lib/constants/warnings";
import { isTimeString } from "@/lib/dates/time-utils";
import { validateTimeBlockInput } from "@/lib/time-blocks/validation";

export const BACKUP_SCHEMA_VERSION = 1;
export const BACKUP_MAX_FILE_BYTES = 5 * 1024 * 1024;
export const BACKUP_APP_NAME = "Habit Tracker - Routine Balance Dashboard";

type BackupBaseRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type BackupSnapshot = {
  schemaVersion: typeof BACKUP_SCHEMA_VERSION;
  exportedAt: string;
  app: string;
  data: {
    habits: Array<
      BackupBaseRecord & {
        name: string;
        icon: string;
        category: HabitCategory;
        weight: number;
        targetPerWeek: number;
        isActive: boolean;
      }
    >;
    habitLogs: Array<
      BackupBaseRecord & {
        habitId: string;
        date: string;
        status: HabitStatus;
        note: string | null;
      }
    >;
    timeBlocks: Array<
      BackupBaseRecord & {
        date: string;
        title: string;
        category: TimeBlockCategory;
        plannedStartTime: string;
        plannedEndTime: string;
        actualStartTime: string | null;
        actualEndTime: string | null;
        actualDurationMinutes: number | null;
        priority: number;
        energyLevel: number | null;
        status: TimeBlockStatus;
        note: string | null;
      }
    >;
    dailyCheckins: Array<
      BackupBaseRecord & {
        date: string;
        dayType: DayType;
        sleepStart: string | null;
        wakeTime: string | null;
        mood: number | null;
        motivation: number | null;
        stress: number | null;
        note: string | null;
      }
    >;
    dailyScores: Array<
      BackupBaseRecord & {
        date: string;
        sleepScore: number;
        focusScore: number;
        habitScore: number;
        restScore: number;
        moodScore: number;
        priorityScore: number;
        totalScore: number;
        warningLevel: WarningLevel;
        advice: string | null;
      }
    >;
    dailyPriorities: Array<
      BackupBaseRecord & {
        date: string;
        title: string;
        status: DailyPriorityStatus;
        priorityOrder: number;
        note: string | null;
      }
    >;
    weeklyGoals: Array<
      BackupBaseRecord & {
        weekStartDate: string;
        title: string;
        category: string;
        targetValue: number;
        currentValue: number;
        unit: string;
      }
    >;
  };
};

type JsonRecord = Record<string, unknown>;

function fail(path: string, message: string): never {
  throw new Error(`${path}: ${message}`);
}

function record(value: unknown, path: string): JsonRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(path, "expected an object");
  }

  return value as JsonRecord;
}

function stringValue(
  source: JsonRecord,
  key: string,
  path: string,
  options: { min?: number; max?: number } = {}
) {
  const value = source[key];

  if (typeof value !== "string") {
    fail(`${path}.${key}`, "expected text");
  }

  const trimmed = value.trim();
  const min = options.min ?? 1;
  const max = options.max ?? 1000;

  if (trimmed.length < min || trimmed.length > max) {
    fail(`${path}.${key}`, `expected ${min}-${max} characters`);
  }

  return trimmed;
}

function nullableString(
  source: JsonRecord,
  key: string,
  path: string,
  max = 2000
) {
  const value = source[key];

  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "string" || value.length > max) {
    fail(`${path}.${key}`, `expected text up to ${max} characters or null`);
  }

  return value.trim() || null;
}

function numberValue(
  source: JsonRecord,
  key: string,
  path: string,
  min: number,
  max: number,
  integer = false
) {
  const value = source[key];

  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < min ||
    value > max ||
    (integer && !Number.isInteger(value))
  ) {
    fail(`${path}.${key}`, `expected a number between ${min} and ${max}`);
  }

  return value;
}

function nullableNumber(
  source: JsonRecord,
  key: string,
  path: string,
  min: number,
  max: number,
  integer = false
) {
  if (source[key] === null || source[key] === undefined) {
    return null;
  }

  return numberValue(source, key, path, min, max, integer);
}

function nullableTime(source: JsonRecord, key: string, path: string) {
  const value = nullableString(source, key, path, 5);

  if (value && !isTimeString(value)) {
    fail(`${path}.${key}`, "expected a valid HH:mm time or null");
  }

  return value;
}

function booleanValue(source: JsonRecord, key: string, path: string) {
  const value = source[key];

  if (typeof value !== "boolean") {
    fail(`${path}.${key}`, "expected true or false");
  }

  return value;
}

function dateValue(source: JsonRecord, key: string, path: string) {
  const value = stringValue(source, key, path, { max: 100 });

  if (Number.isNaN(Date.parse(value))) {
    fail(`${path}.${key}`, "expected a valid date");
  }

  return value;
}

function enumValue<const T extends readonly string[]>(
  source: JsonRecord,
  key: string,
  path: string,
  allowed: T
) {
  const value = stringValue(source, key, path, { max: 100 });

  if (!allowed.includes(value)) {
    fail(`${path}.${key}`, `unsupported value "${value}"`);
  }

  return value as T[number];
}

function baseRecord(value: unknown, path: string) {
  const source = record(value, path);

  return {
    source,
    base: {
      id: stringValue(source, "id", path, { max: 200 }),
      createdAt: dateValue(source, "createdAt", path),
      updatedAt: dateValue(source, "updatedAt", path),
    },
  };
}

function arrayValue<T>(
  value: unknown,
  path: string,
  parser: (item: unknown, itemPath: string) => T
) {
  if (!Array.isArray(value)) {
    fail(path, "expected an array");
  }

  return value.map((item, index) => parser(item, `${path}[${index}]`));
}

function parseHabit(value: unknown, path: string) {
  const { source, base } = baseRecord(value, path);

  return {
    ...base,
    name: stringValue(source, "name", path, { min: 2, max: 120 }),
    icon: stringValue(source, "icon", path, { max: 80 }),
    category: enumValue(source, "category", path, HABIT_CATEGORIES),
    weight: numberValue(source, "weight", path, 1, 10, true),
    targetPerWeek: numberValue(
      source,
      "targetPerWeek",
      path,
      1,
      7,
      true
    ),
    isActive: booleanValue(source, "isActive", path),
  };
}

function parseHabitLog(value: unknown, path: string) {
  const { source, base } = baseRecord(value, path);

  return {
    ...base,
    habitId: stringValue(source, "habitId", path, { max: 200 }),
    date: dateValue(source, "date", path),
    status: enumValue(source, "status", path, HABIT_STATUSES),
    note: nullableString(source, "note", path),
  };
}

function parseTimeBlock(value: unknown, path: string) {
  const { source, base } = baseRecord(value, path);
  const status = enumValue(source, "status", path, TIME_BLOCK_STATUSES);
  const validated = validateTimeBlockInput({
    title: stringValue(source, "title", path, { min: 2, max: 120 }),
    plannedStartTime: stringValue(source, "plannedStartTime", path, {
      max: 5,
    }),
    plannedEndTime: stringValue(source, "plannedEndTime", path, { max: 5 }),
    actualStartTime: nullableTime(source, "actualStartTime", path),
    actualEndTime: nullableTime(source, "actualEndTime", path),
    actualDurationMinutes: nullableNumber(
      source,
      "actualDurationMinutes",
      path,
      0,
      1440,
      true
    ),
    status,
    note: nullableString(source, "note", path, 1000),
  });

  return {
    ...base,
    date: dateValue(source, "date", path),
    ...validated,
    category: enumValue(source, "category", path, TIME_BLOCK_CATEGORIES),
    priority: numberValue(source, "priority", path, 1, 5, true),
    energyLevel: nullableNumber(source, "energyLevel", path, 1, 10, true),
  };
}

function parseDailyCheckin(value: unknown, path: string) {
  const { source, base } = baseRecord(value, path);
  const dayTypeValues = DAY_TYPES.map((item) => item.value);

  return {
    ...base,
    date: dateValue(source, "date", path),
    dayType: enumValue(source, "dayType", path, dayTypeValues),
    sleepStart: nullableTime(source, "sleepStart", path),
    wakeTime: nullableTime(source, "wakeTime", path),
    mood: nullableNumber(source, "mood", path, 1, 10, true),
    motivation: nullableNumber(source, "motivation", path, 1, 10, true),
    stress: nullableNumber(source, "stress", path, 1, 10, true),
    note: nullableString(source, "note", path),
  };
}

function parseDailyScore(value: unknown, path: string) {
  const { source, base } = baseRecord(value, path);

  return {
    ...base,
    date: dateValue(source, "date", path),
    sleepScore: numberValue(source, "sleepScore", path, 0, 100),
    focusScore: numberValue(source, "focusScore", path, 0, 100),
    habitScore: numberValue(source, "habitScore", path, 0, 100),
    restScore: numberValue(source, "restScore", path, 0, 100),
    moodScore: numberValue(source, "moodScore", path, 0, 100),
    priorityScore: numberValue(source, "priorityScore", path, 0, 100),
    totalScore: numberValue(source, "totalScore", path, 0, 100),
    warningLevel: enumValue(source, "warningLevel", path, WARNING_LEVELS),
    advice: nullableString(source, "advice", path),
  };
}

function parseDailyPriority(value: unknown, path: string) {
  const { source, base } = baseRecord(value, path);

  return {
    ...base,
    date: dateValue(source, "date", path),
    title: stringValue(source, "title", path, { min: 2, max: 120 }),
    status: enumValue(source, "status", path, DAILY_PRIORITY_STATUSES),
    priorityOrder: numberValue(
      source,
      "priorityOrder",
      path,
      1,
      3,
      true
    ),
    note: nullableString(source, "note", path),
  };
}

function parseWeeklyGoal(value: unknown, path: string) {
  const { source, base } = baseRecord(value, path);

  return {
    ...base,
    weekStartDate: dateValue(source, "weekStartDate", path),
    title: stringValue(source, "title", path, { min: 2, max: 120 }),
    category: stringValue(source, "category", path, { max: 80 }),
    targetValue: numberValue(source, "targetValue", path, 0.1, 1000),
    currentValue: numberValue(source, "currentValue", path, 0, 1000),
    unit: stringValue(source, "unit", path, { max: 80 }),
  };
}

function ensureUnique(values: string[], path: string) {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      fail(path, `duplicate value "${value}"`);
    }

    seen.add(value);
  }
}

export function parseBackupSnapshot(value: unknown): BackupSnapshot {
  const root = record(value, "backup");
  const rawVersion = root.schemaVersion ?? root.version;

  if (rawVersion !== BACKUP_SCHEMA_VERSION) {
    fail(
      "backup.schemaVersion",
      `expected version ${BACKUP_SCHEMA_VERSION}`
    );
  }

  const data = record(root.data, "backup.data");
  const app = stringValue(root, "app", "backup", { max: 200 });

  if (app !== BACKUP_APP_NAME) {
    fail("backup.app", "backup belongs to a different application");
  }

  const snapshot: BackupSnapshot = {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: dateValue(root, "exportedAt", "backup"),
    app,
    data: {
      habits: arrayValue(data.habits, "backup.data.habits", parseHabit),
      habitLogs: arrayValue(
        data.habitLogs,
        "backup.data.habitLogs",
        parseHabitLog
      ),
      timeBlocks: arrayValue(
        data.timeBlocks,
        "backup.data.timeBlocks",
        parseTimeBlock
      ),
      dailyCheckins: arrayValue(
        data.dailyCheckins,
        "backup.data.dailyCheckins",
        parseDailyCheckin
      ),
      dailyScores: arrayValue(
        data.dailyScores,
        "backup.data.dailyScores",
        parseDailyScore
      ),
      dailyPriorities: arrayValue(
        data.dailyPriorities,
        "backup.data.dailyPriorities",
        parseDailyPriority
      ),
      weeklyGoals: arrayValue(
        data.weeklyGoals,
        "backup.data.weeklyGoals",
        parseWeeklyGoal
      ),
    },
  };

  const collections = Object.entries(snapshot.data) as Array<
    [string, Array<{ id: string }>]
  >;

  for (const [name, rows] of collections) {
    ensureUnique(
      rows.map((row) => row.id),
      `backup.data.${name}.id`
    );
  }

  ensureUnique(
    snapshot.data.habits.map((habit) => habit.name.toLowerCase()),
    "backup.data.habits.name"
  );
  ensureUnique(
    snapshot.data.habitLogs.map((log) => `${log.habitId}:${log.date}`),
    "backup.data.habitLogs habit/date"
  );
  ensureUnique(
    snapshot.data.dailyCheckins.map((checkin) => checkin.date),
    "backup.data.dailyCheckins.date"
  );
  ensureUnique(
    snapshot.data.dailyScores.map((score) => score.date),
    "backup.data.dailyScores.date"
  );
  ensureUnique(
    snapshot.data.dailyPriorities.map(
      (priority) => `${priority.date}:${priority.priorityOrder}`
    ),
    "backup.data.dailyPriorities date/order"
  );
  ensureUnique(
    snapshot.data.weeklyGoals.map(
      (goal) => `${goal.weekStartDate}:${goal.title.toLowerCase()}`
    ),
    "backup.data.weeklyGoals date/title"
  );

  const habitIds = new Set(snapshot.data.habits.map((habit) => habit.id));

  for (const log of snapshot.data.habitLogs) {
    if (!habitIds.has(log.habitId)) {
      fail(
        "backup.data.habitLogs.habitId",
        `habit "${log.habitId}" is missing`
      );
    }
  }

  return snapshot;
}

export function parseBackupSnapshotText(text: string) {
  let value: unknown;

  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("Backup file is not valid JSON.");
  }

  return parseBackupSnapshot(value);
}

export function getBackupRecordCounts(snapshot: BackupSnapshot) {
  return {
    habits: snapshot.data.habits.length,
    habitLogs: snapshot.data.habitLogs.length,
    timeBlocks: snapshot.data.timeBlocks.length,
    dailyCheckins: snapshot.data.dailyCheckins.length,
    dailyScores: snapshot.data.dailyScores.length,
    dailyPriorities: snapshot.data.dailyPriorities.length,
    weeklyGoals: snapshot.data.weeklyGoals.length,
  };
}
