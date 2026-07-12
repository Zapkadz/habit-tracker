import "server-only";

import type { BackupSnapshot } from "@/lib/backup/backup-schema";
import { prisma } from "@/lib/prisma";

function toDate(value: string) {
  return new Date(value);
}

export async function replaceDatabaseFromBackup(snapshot: BackupSnapshot) {
  await prisma.$transaction(async (transaction) => {
    await transaction.habitLog.deleteMany();
    await transaction.timeBlock.deleteMany();
    await transaction.dailyCheckin.deleteMany();
    await transaction.dailyScore.deleteMany();
    await transaction.dailyPriority.deleteMany();
    await transaction.weeklyGoal.deleteMany();
    await transaction.habit.deleteMany();

    if (snapshot.data.habits.length > 0) {
      await transaction.habit.createMany({
        data: snapshot.data.habits.map((habit) => ({
          ...habit,
          createdAt: toDate(habit.createdAt),
          updatedAt: toDate(habit.updatedAt),
        })),
      });
    }

    if (snapshot.data.habitLogs.length > 0) {
      await transaction.habitLog.createMany({
        data: snapshot.data.habitLogs.map((log) => ({
          ...log,
          date: toDate(log.date),
          createdAt: toDate(log.createdAt),
          updatedAt: toDate(log.updatedAt),
        })),
      });
    }

    if (snapshot.data.timeBlocks.length > 0) {
      await transaction.timeBlock.createMany({
        data: snapshot.data.timeBlocks.map((block) => ({
          ...block,
          date: toDate(block.date),
          createdAt: toDate(block.createdAt),
          updatedAt: toDate(block.updatedAt),
        })),
      });
    }

    if (snapshot.data.dailyCheckins.length > 0) {
      await transaction.dailyCheckin.createMany({
        data: snapshot.data.dailyCheckins.map((checkin) => ({
          ...checkin,
          date: toDate(checkin.date),
          createdAt: toDate(checkin.createdAt),
          updatedAt: toDate(checkin.updatedAt),
        })),
      });
    }

    if (snapshot.data.dailyScores.length > 0) {
      await transaction.dailyScore.createMany({
        data: snapshot.data.dailyScores.map((score) => ({
          ...score,
          date: toDate(score.date),
          createdAt: toDate(score.createdAt),
          updatedAt: toDate(score.updatedAt),
        })),
      });
    }

    if (snapshot.data.dailyPriorities.length > 0) {
      await transaction.dailyPriority.createMany({
        data: snapshot.data.dailyPriorities.map((priority) => ({
          ...priority,
          date: toDate(priority.date),
          createdAt: toDate(priority.createdAt),
          updatedAt: toDate(priority.updatedAt),
        })),
      });
    }

    if (snapshot.data.weeklyGoals.length > 0) {
      await transaction.weeklyGoal.createMany({
        data: snapshot.data.weeklyGoals.map((goal) => ({
          ...goal,
          weekStartDate: toDate(goal.weekStartDate),
          createdAt: toDate(goal.createdAt),
          updatedAt: toDate(goal.updatedAt),
        })),
      });
    }
  });
}
