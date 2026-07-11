"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  HABIT_STATUSES,
  type HabitStatus,
} from "@/lib/constants/habits";
import { dateStringToUtcDate, parseDateString } from "@/lib/dates/date-utils";
import { dateToDateString } from "@/lib/dates/week-utils";

function firstFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function parseHabitStatus(value: FormDataEntryValue | null): HabitStatus {
  const status = firstFormValue(value);

  if (!HABIT_STATUSES.includes(status as HabitStatus)) {
    throw new Error("Invalid habit status.");
  }

  return status as HabitStatus;
}

function todayRedirect(date: string, type: "notice" | "error", message: string) {
  redirect(
    `/today?date=${encodeURIComponent(date)}&${type}=${encodeURIComponent(
      message
    )}`
  );
}

export async function getHabitChecklist(dateString: string) {
  const date = dateStringToUtcDate(dateString);
  const habits = await prisma.habit.findMany({
    where: { isActive: true },
    orderBy: [{ weight: "desc" }, { category: "asc" }, { name: "asc" }],
    include: {
      logs: {
        where: { date },
        take: 1,
      },
    },
  });

  return habits
    .filter((habit) => dateToDateString(habit.createdAt) <= dateString)
    .map(({ logs, ...habit }) => ({
      ...habit,
      log: logs[0] ?? null,
    }));
}

export async function updateHabitLogStatus(formData: FormData) {
  const habitId = firstFormValue(formData.get("habitId"));
  const dateString = parseDateString(firstFormValue(formData.get("date")));

  if (!habitId) {
    todayRedirect(dateString, "error", "Missing habit id.");
  }

  let status: HabitStatus = "missed";

  try {
    status = parseHabitStatus(formData.get("status"));
  } catch {
    todayRedirect(dateString, "error", "Invalid habit status.");
  }

  const date = dateStringToUtcDate(dateString);

  try {
    await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
      update: { status },
      create: {
        habitId,
        date,
        status,
      },
    });
  } catch {
    todayRedirect(dateString, "error", "Could not update habit log.");
  }

  revalidatePath("/today");
  revalidatePath("/habits");
  todayRedirect(dateString, "notice", "Habit log updated.");
}

export async function clearHabitLog(formData: FormData) {
  const habitId = firstFormValue(formData.get("habitId"));
  const dateString = parseDateString(firstFormValue(formData.get("date")));

  if (!habitId) {
    todayRedirect(dateString, "error", "Missing habit id.");
  }

  const date = dateStringToUtcDate(dateString);

  try {
    await prisma.habitLog.delete({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
    });
  } catch {
    todayRedirect(dateString, "error", "Could not clear habit log.");
  }

  revalidatePath("/today");
  revalidatePath("/habits");
  todayRedirect(dateString, "notice", "Habit log cleared.");
}
