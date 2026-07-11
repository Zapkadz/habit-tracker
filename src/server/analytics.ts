"use server";

import type { DayType } from "@/lib/constants/day-types";
import type { TimeBlockCategory } from "@/lib/constants/planner";
import { dateStringToUtcDate } from "@/lib/dates/date-utils";
import {
  getDateRangeDates,
  parseAnalyticsDateRange,
  type AnalyticsRangeInput,
} from "@/lib/dates/range-utils";
import { addDaysToDateString, dateToDateString } from "@/lib/dates/week-utils";
import { minutesBetween } from "@/lib/dates/time-utils";
import { prisma } from "@/lib/prisma";
import { buildCategoryBreakdown, calculateAnalyticsReview } from "@/lib/analytics/trends";
import { calculateDailyBalance } from "@/lib/scoring/daily-score";
import {
  calculateAnalyticsWarnings,
  getHighestAnalyticsWarningLevel,
} from "@/lib/warnings/analytics-warnings";

function getBlockPlannedMinutes(block: {
  plannedStartTime: string;
  plannedEndTime: string;
}) {
  return minutesBetween(block.plannedStartTime, block.plannedEndTime);
}

function getBlockActualMinutes(block: {
  actualDurationMinutes?: number | null;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
  status: string;
}) {
  if (block.status === "skipped") {
    return 0;
  }

  if (typeof block.actualDurationMinutes === "number") {
    return block.actualDurationMinutes;
  }

  if (block.actualStartTime && block.actualEndTime) {
    return minutesBetween(block.actualStartTime, block.actualEndTime);
  }

  return null;
}

function formatRangeDayLabel(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(dateStringToUtcDate(date));
}

export async function getAnalyticsReview(input: AnalyticsRangeInput = {}) {
  const range = parseAnalyticsDateRange(input);
  const rangeDates = getDateRangeDates(range.startDate, range.endDate);
  const startDate = dateStringToUtcDate(range.startDate);
  const endExclusiveDate = dateStringToUtcDate(
    addDaysToDateString(range.endDate, 1)
  );

  const [habits, checkins, priorities, timeBlocks] = await Promise.all([
    prisma.habit.findMany({
      where: { isActive: true },
      orderBy: [{ weight: "desc" }, { category: "asc" }, { name: "asc" }],
      include: {
        logs: {
          where: {
            date: {
              gte: startDate,
              lt: endExclusiveDate,
            },
          },
        },
      },
    }),
    prisma.dailyCheckin.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endExclusiveDate,
        },
      },
    }),
    prisma.dailyPriority.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endExclusiveDate,
        },
      },
      orderBy: [{ date: "asc" }, { priorityOrder: "asc" }],
    }),
    prisma.timeBlock.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endExclusiveDate,
        },
      },
      orderBy: [{ date: "asc" }, { plannedStartTime: "asc" }],
    }),
  ]);

  const checkinsByDate = new Map(
    checkins.map((checkin) => [dateToDateString(checkin.date), checkin])
  );
  const prioritiesByDate = new Map<string, typeof priorities>();
  const timeBlocksByDate = new Map<string, typeof timeBlocks>();
  const categoryTotals = new Map<
    TimeBlockCategory,
    {
      plannedMinutes: number;
      actualMinutes: number;
      actualCoverageMinutes: number;
      blockCount: number;
      skippedCount: number;
    }
  >();

  for (const priority of priorities) {
    const date = dateToDateString(priority.date);
    prioritiesByDate.set(date, [...(prioritiesByDate.get(date) ?? []), priority]);
  }

  for (const block of timeBlocks) {
    const date = dateToDateString(block.date);
    const plannedMinutes = getBlockPlannedMinutes(block);
    const actualMinutes = getBlockActualMinutes(block);
    const category = block.category as TimeBlockCategory;
    const current = categoryTotals.get(category) ?? {
      plannedMinutes: 0,
      actualMinutes: 0,
      actualCoverageMinutes: 0,
      blockCount: 0,
      skippedCount: 0,
    };

    timeBlocksByDate.set(date, [...(timeBlocksByDate.get(date) ?? []), block]);
    categoryTotals.set(category, {
      plannedMinutes: current.plannedMinutes + plannedMinutes,
      actualMinutes: current.actualMinutes + (actualMinutes ?? 0),
      actualCoverageMinutes:
        current.actualCoverageMinutes +
        (actualMinutes === null ? 0 : plannedMinutes),
      blockCount: current.blockCount + 1,
      skippedCount: current.skippedCount + (block.status === "skipped" ? 1 : 0),
    });
  }

  const days = rangeDates.map((date) => {
    const checkin = checkinsByDate.get(date) ?? null;
    const dayPriorities = prioritiesByDate.get(date) ?? [];
    const dayTimeBlocks = timeBlocksByDate.get(date) ?? [];
    const dayHabits = habits.map(({ logs, ...habit }) => ({
      ...habit,
      log: logs.find((log) => dateToDateString(log.date) === date) ?? null,
    }));
    const dayType = (checkin?.dayType ?? "normal") as DayType;
    const score = calculateDailyBalance({
      dayType,
      checkin,
      habits: dayHabits,
      priorities: dayPriorities,
      timeBlocks: dayTimeBlocks,
    });
    const plannedMinutes = dayTimeBlocks.reduce(
      (sum, block) => sum + getBlockPlannedMinutes(block),
      0
    );
    const actualValues = dayTimeBlocks.map((block) => ({
      plannedMinutes: getBlockPlannedMinutes(block),
      actualMinutes: getBlockActualMinutes(block),
    }));
    const actualCoverageMinutes = actualValues.reduce(
      (sum, value) =>
        sum + (value.actualMinutes === null ? 0 : value.plannedMinutes),
      0
    );
    const actualMinutes =
      actualCoverageMinutes > 0
        ? actualValues.reduce(
            (sum, value) => sum + (value.actualMinutes ?? 0),
            0
          )
        : null;
    const hasHabitLog = dayHabits.some((habit) => habit.log);

    return {
      date,
      label: formatRangeDayLabel(date),
      dayType,
      hasData:
        Boolean(checkin) ||
        dayPriorities.length > 0 ||
        dayTimeBlocks.length > 0 ||
        hasHabitLog,
      score,
      mood: checkin?.mood ?? null,
      motivation: checkin?.motivation ?? null,
      stress: checkin?.stress ?? null,
      plannedMinutes,
      actualMinutes,
      actualCoverageMinutes,
      planAccuracyPercent:
        actualCoverageMinutes > 0
          ? Math.max(
              0,
              Math.round(
                100 -
                  (Math.abs(actualCoverageMinutes - (actualMinutes ?? 0)) /
                    actualCoverageMinutes) *
                    100
              )
            )
          : null,
      skippedBlockCount: dayTimeBlocks.filter((block) => block.status === "skipped")
        .length,
    };
  });

  const review = calculateAnalyticsReview({
    startDate: range.startDate,
    endDate: range.endDate,
    presetDays: range.presetDays,
    label: range.label,
    days,
    categoryBreakdown: buildCategoryBreakdown(categoryTotals),
  });
  const warnings = calculateAnalyticsWarnings(review);

  return {
    ...review,
    dayCount: range.dayCount,
    warnings,
    warningLevel: getHighestAnalyticsWarningLevel(warnings),
  };
}
