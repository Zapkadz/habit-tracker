"use server";

import type { DayType } from "@/lib/constants/day-types";
import { dateStringToUtcDate } from "@/lib/dates/date-utils";
import {
  addDaysToDateString,
  dateToDateString,
  formatShortDateLabel,
  formatWeekdayLabel,
  getElapsedWeekPercent,
  getWeekDates,
  getWeekEndDateString,
  getWeekStartDateString,
} from "@/lib/dates/week-utils";
import { prisma } from "@/lib/prisma";
import { calculateDailyBalance } from "@/lib/scoring/daily-score";
import { calculateWeeklyBalance } from "@/lib/scoring/weekly-score";
import {
  calculateWeeklyWarnings,
  getHighestWeeklyWarningLevel,
} from "@/lib/warnings/weekly-warnings";

export async function getWeeklyBalance(inputWeekStartDate?: string) {
  const weekStartDate = getWeekStartDateString(inputWeekStartDate);
  const weekEndDate = getWeekEndDateString(weekStartDate);
  const weekDates = getWeekDates(weekStartDate);
  const startDate = dateStringToUtcDate(weekStartDate);
  const endExclusiveDate = dateStringToUtcDate(
    addDaysToDateString(weekStartDate, 7)
  );

  const [habits, checkins, priorities, timeBlocks, goals] = await Promise.all([
    prisma.habit.findMany({
      where: {
        OR: [
          { isActive: true },
          {
            logs: {
              some: {
                date: {
                  gte: startDate,
                  lt: endExclusiveDate,
                },
              },
            },
          },
        ],
      },
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
    prisma.weeklyGoal.findMany({
      where: {
        weekStartDate: startDate,
      },
      orderBy: [{ category: "asc" }, { title: "asc" }],
    }),
  ]);

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

  const days = weekDates.map((date) => {
    const checkin = checkinsByDate.get(date) ?? null;
    const dayPriorities = prioritiesByDate.get(date) ?? [];
    const dayTimeBlocks = timeBlocksByDate.get(date) ?? [];
    const dayHabits = habits
      .map(({ logs, ...habit }) => ({
        ...habit,
        log: logs.find((log) => dateToDateString(log.date) === date) ?? null,
      }))
      .filter(
        (habit) =>
          dateToDateString(habit.createdAt) <= date &&
          (habit.isActive || Boolean(habit.log))
      );
    const hasHabitLog = dayHabits.some((habit) => habit.log);
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
      weekdayLabel: formatWeekdayLabel(date),
      shortDateLabel: formatShortDateLabel(date),
      dayType,
      hasData:
        Boolean(checkin) ||
        dayPriorities.length > 0 ||
        dayTimeBlocks.length > 0 ||
        hasHabitLog,
      score,
    };
  });

  const balance = calculateWeeklyBalance({
    weekStartDate,
    weekEndDate,
      days,
      goals,
      expectedGoalProgressPercent: getElapsedWeekPercent(weekStartDate),
    });
  const warnings = calculateWeeklyWarnings(balance);

  return {
    ...balance,
    warnings,
    warningLevel: getHighestWeeklyWarningLevel(warnings),
  };
}
