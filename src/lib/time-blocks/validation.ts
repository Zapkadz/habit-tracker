import type { TimeBlockStatus } from "@/lib/constants/planner";
import {
  isTimeString,
  minutesBetween,
  timeStringToMinutes,
} from "@/lib/dates/time-utils";

export const TIME_BLOCK_TITLE_MAX_LENGTH = 120;
export const TIME_BLOCK_NOTE_MAX_LENGTH = 1000;
export const TIME_BLOCK_MAX_DURATION_MINUTES = 24 * 60;

export type TimeBlockValidationInput = {
  title: string;
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime: string | null;
  actualEndTime: string | null;
  actualDurationMinutes: number | null;
  status: TimeBlockStatus;
  note: string | null;
};

export type TimeBlockScheduleItem = {
  id: string;
  plannedStartTime: string;
  plannedEndTime: string;
};

export function validateTimeBlockInput(input: TimeBlockValidationInput) {
  const title = input.title.trim();
  const note = input.note?.trim() || null;

  if (title.length < 2) {
    throw new Error("Time block title must be at least 2 characters.");
  }

  if (title.length > TIME_BLOCK_TITLE_MAX_LENGTH) {
    throw new Error(
      `Time block title must be ${TIME_BLOCK_TITLE_MAX_LENGTH} characters or fewer.`
    );
  }

  if (note && note.length > TIME_BLOCK_NOTE_MAX_LENGTH) {
    throw new Error(
      `Time block note must be ${TIME_BLOCK_NOTE_MAX_LENGTH} characters or fewer.`
    );
  }

  if (
    !isTimeString(input.plannedStartTime) ||
    !isTimeString(input.plannedEndTime)
  ) {
    throw new Error("Planned start and end time are required.");
  }

  const plannedDuration = minutesBetween(
    input.plannedStartTime,
    input.plannedEndTime
  );

  if (plannedDuration === 0) {
    throw new Error("Planned start and end time must be different.");
  }

  const hasActualStart = Boolean(input.actualStartTime);
  const hasActualEnd = Boolean(input.actualEndTime);

  if (hasActualStart !== hasActualEnd) {
    throw new Error("Actual start and actual end must be provided together.");
  }

  if (
    (input.actualStartTime && !isTimeString(input.actualStartTime)) ||
    (input.actualEndTime && !isTimeString(input.actualEndTime))
  ) {
    throw new Error("Actual time must use the HH:mm format.");
  }

  if (
    input.actualDurationMinutes !== null &&
    (!Number.isInteger(input.actualDurationMinutes) ||
      input.actualDurationMinutes < 0 ||
      input.actualDurationMinutes > TIME_BLOCK_MAX_DURATION_MINUTES)
  ) {
    throw new Error("Actual minutes must be between 0 and 1440.");
  }

  const clockDuration =
    input.actualStartTime && input.actualEndTime
      ? minutesBetween(input.actualStartTime, input.actualEndTime)
      : null;

  if (
    clockDuration !== null &&
    input.actualDurationMinutes !== null &&
    clockDuration !== input.actualDurationMinutes
  ) {
    throw new Error("Actual minutes must match the actual start and end time.");
  }

  const actualDurationMinutes =
    input.actualDurationMinutes ?? clockDuration;

  if (input.status === "skipped") {
    if (hasActualStart || (actualDurationMinutes ?? 0) > 0) {
      throw new Error("Skipped blocks cannot contain actual time.");
    }
  }

  if (
    (input.status === "done" || input.status === "partial") &&
    (!actualDurationMinutes || actualDurationMinutes <= 0)
  ) {
    throw new Error(
      `${input.status === "done" ? "Done" : "Partial"} blocks need actual time.`
    );
  }

  return {
    ...input,
    title,
    note,
    actualDurationMinutes:
      input.status === "skipped" ? 0 : actualDurationMinutes,
  };
}

function getSegments(startTime: string, endTime: string) {
  if (!isTimeString(startTime) || !isTimeString(endTime)) {
    return [];
  }

  const start = timeStringToMinutes(startTime);
  const end = timeStringToMinutes(endTime);

  if (start === end) {
    return [];
  }

  if (end > start) {
    return [[start, end] as const];
  }

  return [
    [start, TIME_BLOCK_MAX_DURATION_MINUTES] as const,
    [0, end] as const,
  ];
}

function schedulesOverlap(
  first: TimeBlockScheduleItem,
  second: TimeBlockScheduleItem
) {
  const firstSegments = getSegments(
    first.plannedStartTime,
    first.plannedEndTime
  );
  const secondSegments = getSegments(
    second.plannedStartTime,
    second.plannedEndTime
  );

  return firstSegments.some(([firstStart, firstEnd]) =>
    secondSegments.some(
      ([secondStart, secondEnd]) =>
        firstStart < secondEnd && secondStart < firstEnd
    )
  );
}

export function getOverlappingTimeBlockIds(
  blocks: TimeBlockScheduleItem[]
) {
  const overlappingIds = new Set<string>();

  for (let firstIndex = 0; firstIndex < blocks.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < blocks.length;
      secondIndex += 1
    ) {
      const first = blocks[firstIndex];
      const second = blocks[secondIndex];

      if (schedulesOverlap(first, second)) {
        overlappingIds.add(first.id);
        overlappingIds.add(second.id);
      }
    }
  }

  return overlappingIds;
}
