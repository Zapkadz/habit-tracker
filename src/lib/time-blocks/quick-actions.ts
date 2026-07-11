import type { TimeBlockStatus } from "@/lib/constants/planner";
import { minutesBetween } from "@/lib/dates/time-utils";

export type TimeBlockQuickAction =
  | "mark-done"
  | "mark-partial"
  | "mark-skipped"
  | "actual-planned";

export type QuickActionTimeBlock = {
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
  actualDurationMinutes?: number | null;
};

export type TimeBlockQuickUpdate = {
  status: TimeBlockStatus;
  actualStartTime: string | null;
  actualEndTime: string | null;
  actualDurationMinutes: number;
};

function plannedUpdate(block: QuickActionTimeBlock): TimeBlockQuickUpdate {
  return {
    status: "done",
    actualStartTime: block.plannedStartTime,
    actualEndTime: block.plannedEndTime,
    actualDurationMinutes: minutesBetween(
      block.plannedStartTime,
      block.plannedEndTime
    ),
  };
}

function hasActualTime(block: QuickActionTimeBlock) {
  return (
    typeof block.actualDurationMinutes === "number" ||
    Boolean(block.actualStartTime && block.actualEndTime)
  );
}

export function getTimeBlockQuickUpdate(
  block: QuickActionTimeBlock,
  action: TimeBlockQuickAction
): TimeBlockQuickUpdate {
  const plannedMinutes = minutesBetween(
    block.plannedStartTime,
    block.plannedEndTime
  );

  if (action === "mark-skipped") {
    return {
      status: "skipped",
      actualStartTime: null,
      actualEndTime: null,
      actualDurationMinutes: 0,
    };
  }

  if (action === "actual-planned") {
    return plannedUpdate(block);
  }

  if (action === "mark-partial") {
    return {
      status: "partial",
      actualStartTime: block.actualStartTime ?? block.plannedStartTime,
      actualEndTime: block.actualEndTime ?? null,
      actualDurationMinutes:
        block.actualDurationMinutes ?? Math.round(plannedMinutes / 2),
    };
  }

  if (hasActualTime(block)) {
    return {
      status: "done",
      actualStartTime: block.actualStartTime ?? block.plannedStartTime,
      actualEndTime: block.actualEndTime ?? null,
      actualDurationMinutes:
        block.actualDurationMinutes ??
        (block.actualStartTime && block.actualEndTime
          ? minutesBetween(block.actualStartTime, block.actualEndTime)
          : plannedMinutes),
    };
  }

  return plannedUpdate(block);
}
