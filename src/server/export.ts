"use server";

import { prisma } from "@/lib/prisma";
import { rowsToCsv } from "@/lib/export/csv-export";

export async function getExportSnapshot() {
  const [
    habits,
    habitLogs,
    timeBlocks,
    dailyCheckins,
    dailyScores,
    dailyPriorities,
    weeklyGoals,
  ] = await Promise.all([
    prisma.habit.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    prisma.habitLog.findMany({
      orderBy: [{ date: "asc" }],
      include: { habit: { select: { name: true } } },
    }),
    prisma.timeBlock.findMany({
      orderBy: [{ date: "asc" }, { plannedStartTime: "asc" }],
    }),
    prisma.dailyCheckin.findMany({ orderBy: [{ date: "asc" }] }),
    prisma.dailyScore.findMany({ orderBy: [{ date: "asc" }] }),
    prisma.dailyPriority.findMany({
      orderBy: [{ date: "asc" }, { priorityOrder: "asc" }],
    }),
    prisma.weeklyGoal.findMany({ orderBy: [{ weekStartDate: "asc" }] }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    app: "Habit Tracker - Routine Balance Dashboard",
    version: 1,
    data: {
      habits,
      habitLogs,
      timeBlocks,
      dailyCheckins,
      dailyScores,
      dailyPriorities,
      weeklyGoals,
    },
  };
}

export async function getSettingsOverview() {
  const [
    habitCount,
    habitLogCount,
    timeBlockCount,
    checkinCount,
    priorityCount,
    weeklyGoalCount,
  ] = await Promise.all([
    prisma.habit.count(),
    prisma.habitLog.count(),
    prisma.timeBlock.count(),
    prisma.dailyCheckin.count(),
    prisma.dailyPriority.count(),
    prisma.weeklyGoal.count(),
  ]);

  return {
    databaseUrl: process.env.DATABASE_URL ?? "file:./dev.db",
    counts: {
      habits: habitCount,
      habitLogs: habitLogCount,
      timeBlocks: timeBlockCount,
      dailyCheckins: checkinCount,
      dailyPriorities: priorityCount,
      weeklyGoals: weeklyGoalCount,
    },
  };
}

export async function getHabitLogsCsv() {
  const rows = await prisma.habitLog.findMany({
    orderBy: [{ date: "asc" }],
    include: { habit: { select: { name: true, category: true } } },
  });

  return rowsToCsv(rows, [
    { header: "date", value: (row) => row.date },
    { header: "habit", value: (row) => row.habit.name },
    { header: "category", value: (row) => row.habit.category },
    { header: "status", value: (row) => row.status },
    { header: "note", value: (row) => row.note },
    { header: "createdAt", value: (row) => row.createdAt },
    { header: "updatedAt", value: (row) => row.updatedAt },
  ]);
}

export async function getTimeBlocksCsv() {
  const rows = await prisma.timeBlock.findMany({
    orderBy: [{ date: "asc" }, { plannedStartTime: "asc" }],
  });

  return rowsToCsv(rows, [
    { header: "date", value: (row) => row.date },
    { header: "title", value: (row) => row.title },
    { header: "category", value: (row) => row.category },
    { header: "status", value: (row) => row.status },
    { header: "plannedStartTime", value: (row) => row.plannedStartTime },
    { header: "plannedEndTime", value: (row) => row.plannedEndTime },
    { header: "actualStartTime", value: (row) => row.actualStartTime },
    { header: "actualEndTime", value: (row) => row.actualEndTime },
    {
      header: "actualDurationMinutes",
      value: (row) => row.actualDurationMinutes,
    },
    { header: "priority", value: (row) => row.priority },
    { header: "energyLevel", value: (row) => row.energyLevel },
    { header: "note", value: (row) => row.note },
  ]);
}

export async function getDailyCheckinsCsv() {
  const rows = await prisma.dailyCheckin.findMany({
    orderBy: [{ date: "asc" }],
  });

  return rowsToCsv(rows, [
    { header: "date", value: (row) => row.date },
    { header: "dayType", value: (row) => row.dayType },
    { header: "sleepStart", value: (row) => row.sleepStart },
    { header: "wakeTime", value: (row) => row.wakeTime },
    { header: "mood", value: (row) => row.mood },
    { header: "motivation", value: (row) => row.motivation },
    { header: "stress", value: (row) => row.stress },
    { header: "note", value: (row) => row.note },
  ]);
}
