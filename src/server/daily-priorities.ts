"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  DAILY_PRIORITY_STATUSES,
  MAX_DAILY_PRIORITIES,
  type DailyPriorityStatus,
} from "@/lib/constants/planner";
import { dateStringToUtcDate, parseDateString } from "@/lib/dates/date-utils";

function firstFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: FormDataEntryValue | null) {
  const text = firstFormValue(value);

  return text.length > 0 ? text : null;
}

function parsePriorityStatus(
  value: FormDataEntryValue | null
): DailyPriorityStatus {
  const status = firstFormValue(value);

  if (DAILY_PRIORITY_STATUSES.includes(status as DailyPriorityStatus)) {
    return status as DailyPriorityStatus;
  }

  return "planned";
}

function todayRedirect(date: string, type: "notice" | "error", message: string): never {
  redirect(
    `/today?date=${encodeURIComponent(date)}&${type}=${encodeURIComponent(
      message
    )}`
  );
}

function validateTitle(title: string) {
  if (title.length < 2) {
    throw new Error("Priority title must be at least 2 characters.");
  }

  return title;
}

async function getNextPriorityOrder(date: Date) {
  const priorities = await prisma.dailyPriority.findMany({
    where: { date },
    select: { priorityOrder: true },
    orderBy: { priorityOrder: "asc" },
  });
  const usedOrders = new Set(priorities.map((priority) => priority.priorityOrder));

  for (let order = 1; order <= MAX_DAILY_PRIORITIES; order += 1) {
    if (!usedOrders.has(order)) {
      return order;
    }
  }

  return null;
}

export async function getDailyPriorities(dateString: string) {
  return prisma.dailyPriority.findMany({
    where: {
      date: dateStringToUtcDate(dateString),
    },
    orderBy: {
      priorityOrder: "asc",
    },
  });
}

export async function createDailyPriority(formData: FormData) {
  const dateString = parseDateString(firstFormValue(formData.get("date")));
  const date = dateStringToUtcDate(dateString);
  const priorityOrder = await getNextPriorityOrder(date);

  if (!priorityOrder) {
    todayRedirect(dateString, "error", "Today already has 3 priorities.");
  }

  try {
    await prisma.dailyPriority.create({
      data: {
        date,
        title: validateTitle(firstFormValue(formData.get("title"))),
        priorityOrder,
        status: "planned",
        note: nullableText(formData.get("note")),
      },
    });
  } catch (error) {
    todayRedirect(
      dateString,
      "error",
      error instanceof Error ? error.message : "Could not create priority."
    );
  }

  revalidatePath("/today");
  todayRedirect(dateString, "notice", "Priority created.");
}

export async function updateDailyPriority(formData: FormData) {
  const id = firstFormValue(formData.get("id"));
  const dateString = parseDateString(firstFormValue(formData.get("date")));

  if (!id) {
    todayRedirect(dateString, "error", "Missing priority id.");
  }

  try {
    await prisma.dailyPriority.update({
      where: { id },
      data: {
        title: validateTitle(firstFormValue(formData.get("title"))),
        status: parsePriorityStatus(formData.get("status")),
        note: nullableText(formData.get("note")),
      },
    });
  } catch (error) {
    todayRedirect(
      dateString,
      "error",
      error instanceof Error ? error.message : "Could not update priority."
    );
  }

  revalidatePath("/today");
  todayRedirect(dateString, "notice", "Priority updated.");
}

export async function deleteDailyPriority(formData: FormData) {
  const id = firstFormValue(formData.get("id"));
  const dateString = parseDateString(firstFormValue(formData.get("date")));

  if (!id) {
    todayRedirect(dateString, "error", "Missing priority id.");
  }

  try {
    await prisma.dailyPriority.delete({
      where: { id },
    });
  } catch {
    todayRedirect(dateString, "error", "Could not delete priority.");
  }

  revalidatePath("/today");
  todayRedirect(dateString, "notice", "Priority deleted.");
}
