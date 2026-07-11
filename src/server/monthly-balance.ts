"use server";

import type { HabitCategory, HabitStatus } from "@/lib/constants/habits";
import type { DayType } from "@/lib/constants/day-types";
import {
  formatCompactWeekdayLabel,
  formatMonthDayLabel,
  getMonthDates,
  getMonthEndDateString,
  getMonthStartDateString,
  getMonthWeekKey,
  getNextMonthStartDateString,
  isFutureDateString,
  parseMonthString,
} from "@/lib/dates/month-utils";
import { dateToDateString } from "@/lib/dates/week-utils";
import { dateStringToUtcDate } from "@/lib/dates/date-utils";
import { prisma } from "@/lib/prisma";
import { calculateDailyBalance } from "@/lib/scoring/daily-score";
import {
  calculateHabitCompletionPercent,
  calculateMonthlyReview,
  type MonthlyHabitDayStatus,
} from "@/lib/scoring/monthly-score";
import {
  calculateMonthlyWarnings,
  getHighestMonthlyWarningLevel,
} from "@/lib/warnings/monthly-warnings";

function countStatus(statuses: MonthlyHabitDayStatus[], status: HabitStatus) {
  return statuses.filter((item) => item === status).length;
}

function getHabitBestStreak(statuses: MonthlyHabitDayStatus[]) {
  let currentStreak = 0;
  let bestStreak = 0;

  for (const status of statuses) {
    if (status === "done" || status === "partial") {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return bestStreak;
}

export async function getMonthlyBalance(inputMonth?: string) {
  const month = parseMonthString(inputMonth);
  const startDateString = getMonthStartDateString(month);
  const endDateString = getMonthEndDateString(month);
  const nextMonthStartDateString = getNextMonthStartDateString(month);
  const startDate = dateStringToUtcDate(startDateString);
  const endExclusiveDate = dateStringToUtcDate(nextMonthStartDateString);
  const monthDates = getMonthDates(month);
  const elapsedDates = monthDates.filter((date) => !isFutureDateString(date));

  const [habits, checkins, priorities, timeBlocks] = await Promise.all([
    prisma.habit.findMany({
      orderBy: [
        { isActive: "desc" },
        { weight: "desc" },
        { category: "asc" },
        { name: "asc" },
      ],
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

  const displayHabits = habits.filter(
    (habit) => habit.isActive || habit.logs.length > 0
  );
  const activeHabits = habits.filter((habit) => habit.isActive);
  const checkinsByDate = new Map(
    checkins.map((checkin) => [dateToDateString(checkin.date), checkin])
  );
  const prioritiesByDate = new Map<string, typeof priorities>();
  const timeBlocksByDate = new Map<string, typeof timeBlocks>();

  for (const priority of priorities) {
    const date = dateToDateString(priority.date);
    prioritiesByDate.set(date, [...(prioritiesByDate.get(date) ?? []), priority]);
  }

  for (const block of timeBlocks) {
    const date = dateToDateString(block.date);
    timeBlocksByDate.set(date, [...(timeBlocksByDate.get(date) ?? []), block]);
  }

  const days = monthDates.map((date) => {
    const checkin = checkinsByDate.get(date) ?? null;
    const dayPriorities = prioritiesByDate.get(date) ?? [];
    const dayTimeBlocks = timeBlocksByDate.get(date) ?? [];
    const dayHabits = activeHabits.map(({ logs, ...habit }) => ({
      ...habit,
      log: logs.find((log) => dateToDateString(log.date) === date) ?? null,
    }));
    const hasHabitLog = displayHabits.some((habit) =>
      habit.logs.some((log) => dateToDateString(log.date) === date)
    );
    const dayType = (checkin?.dayType ?? "normal") as DayType;
    const score = calculateDailyBalance({
      dayType,
      checkin,
      habits: dayHabits,
      priorities: dayPriorities,
      timeBlocks: dayTimeBlocks,
    });

    return {
      date,
      dayOfMonth: formatMonthDayLabel(date),
      weekdayLabel: formatCompactWeekdayLabel(date),
      weekKey: getMonthWeekKey(date),
      dayType,
      hasData:
        Boolean(checkin) ||
        dayPriorities.length > 0 ||
        dayTimeBlocks.length > 0 ||
        hasHabitLog,
      isFuture: isFutureDateString(date),
      score,
      mood: checkin?.mood ?? null,
      motivation: checkin?.motivation ?? null,
      stress: checkin?.stress ?? null,
    };
  });

  const habitReviews = displayHabits.map((habit) => {
    const statuses = monthDates.reduce<Record<string, MonthlyHabitDayStatus>>(
      (result, date) => {
        const log = habit.logs.find((item) => dateToDateString(item.date) === date);
        result[date] = log?.status ?? null;

        return result;
      },
      {}
    );
    const elapsedStatuses = elapsedDates.map((date) => statuses[date]);
    const denominator = habit.isActive ? elapsedDates.length : habit.logs.length;

    return {
      id: habit.id,
      name: habit.name,
      category: habit.category as HabitCategory,
      weight: habit.weight,
      targetPerWeek: habit.targetPerWeek,
      isActive: habit.isActive,
      statuses,
      doneCount: countStatus(elapsedStatuses, "done"),
      partialCount: countStatus(elapsedStatuses, "partial"),
      skippedCount: countStatus(elapsedStatuses, "skipped"),
      missedCount: countStatus(elapsedStatuses, "missed"),
      emptyCount: elapsedStatuses.filter((status) => !status).length,
      completionPercent: calculateHabitCompletionPercent(
        elapsedStatuses,
        denominator
      ),
      bestStreak: getHabitBestStreak(elapsedStatuses),
    };
  });

  const review = calculateMonthlyReview({
    month,
    days,
    habits: habitReviews,
  });
  const warnings = calculateMonthlyWarnings(review);

  return {
    ...review,
    startDate: startDateString,
    endDate: endDateString,
    warnings,
    warningLevel: getHighestMonthlyWarningLevel(warnings),
  };
}
