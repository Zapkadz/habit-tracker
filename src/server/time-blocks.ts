"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  TIME_BLOCK_CATEGORIES,
  TIME_BLOCK_STATUSES,
  type TimeBlockCategory,
  type TimeBlockStatus,
} from "@/lib/constants/planner";
import { dateStringToUtcDate, parseDateString } from "@/lib/dates/date-utils";
import { minutesBetween, parseTimeString } from "@/lib/dates/time-utils";

function firstFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: FormDataEntryValue | null) {
  const text = firstFormValue(value);

  return text.length > 0 ? text : null;
}

function parseCategory(value: FormDataEntryValue | null): TimeBlockCategory {
  const category = firstFormValue(value);

  if (TIME_BLOCK_CATEGORIES.includes(category as TimeBlockCategory)) {
    return category as TimeBlockCategory;
  }

  return "other";
}

function parseStatus(value: FormDataEntryValue | null): TimeBlockStatus {
  const status = firstFormValue(value);

  if (TIME_BLOCK_STATUSES.includes(status as TimeBlockStatus)) {
    return status as TimeBlockStatus;
  }

  return "planned";
}

function parseBoundedInteger(
  value: FormDataEntryValue | null,
  fallback: number,
  min: number,
  max: number
) {
  const parsed = Number.parseInt(firstFormValue(value), 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}

function parseNullableBoundedInteger(
  value: FormDataEntryValue | null,
  min: number,
  max: number
) {
  const raw = firstFormValue(value);

  if (!raw) {
    return null;
  }

  const parsed = Number.parseInt(raw, 10);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.min(Math.max(parsed, min), max);
}

function todayRedirect(date: string, type: "notice" | "error", message: string): never {
  redirect(
    `/today?date=${encodeURIComponent(date)}&${type}=${encodeURIComponent(
      message
    )}`
  );
}

function parseTimeBlockForm(formData: FormData) {
  const title = firstFormValue(formData.get("title"));
  const plannedStartTime = parseTimeString(formData.get("plannedStartTime"));
  const plannedEndTime = parseTimeString(formData.get("plannedEndTime"));
  const actualStartTime = parseTimeString(formData.get("actualStartTime")) || null;
  const actualEndTime = parseTimeString(formData.get("actualEndTime")) || null;
  const explicitDuration = parseNullableBoundedInteger(
    formData.get("actualDurationMinutes"),
    0,
    24 * 60
  );

  if (title.length < 2) {
    throw new Error("Time block title must be at least 2 characters.");
  }

  if (!plannedStartTime || !plannedEndTime) {
    throw new Error("Planned start and end time are required.");
  }

  return {
    title,
    category: parseCategory(formData.get("category")),
    plannedStartTime,
    plannedEndTime,
    actualStartTime,
    actualEndTime,
    actualDurationMinutes:
      explicitDuration ??
      (actualStartTime && actualEndTime
        ? minutesBetween(actualStartTime, actualEndTime)
        : null),
    priority: parseBoundedInteger(formData.get("priority"), 3, 1, 5),
    energyLevel: parseNullableBoundedInteger(formData.get("energyLevel"), 1, 10),
    status: parseStatus(formData.get("status")),
    note: nullableText(formData.get("note")),
  };
}

export async function getTimeBlocks(dateString: string) {
  return prisma.timeBlock.findMany({
    where: {
      date: dateStringToUtcDate(dateString),
    },
    orderBy: [{ plannedStartTime: "asc" }, { plannedEndTime: "asc" }],
  });
}

export async function createTimeBlock(formData: FormData) {
  const dateString = parseDateString(firstFormValue(formData.get("date")));
  const date = dateStringToUtcDate(dateString);

  try {
    await prisma.timeBlock.create({
      data: {
        date,
        ...parseTimeBlockForm(formData),
      },
    });
  } catch (error) {
    todayRedirect(
      dateString,
      "error",
      error instanceof Error ? error.message : "Could not create time block."
    );
  }

  revalidatePath("/today");
  todayRedirect(dateString, "notice", "Time block created.");
}

export async function updateTimeBlock(formData: FormData) {
  const id = firstFormValue(formData.get("id"));
  const dateString = parseDateString(firstFormValue(formData.get("date")));

  if (!id) {
    todayRedirect(dateString, "error", "Missing time block id.");
  }

  try {
    await prisma.timeBlock.update({
      where: { id },
      data: parseTimeBlockForm(formData),
    });
  } catch (error) {
    todayRedirect(
      dateString,
      "error",
      error instanceof Error ? error.message : "Could not update time block."
    );
  }

  revalidatePath("/today");
  todayRedirect(dateString, "notice", "Time block updated.");
}

export async function deleteTimeBlock(formData: FormData) {
  const id = firstFormValue(formData.get("id"));
  const dateString = parseDateString(firstFormValue(formData.get("date")));

  if (!id) {
    todayRedirect(dateString, "error", "Missing time block id.");
  }

  try {
    await prisma.timeBlock.delete({
      where: { id },
    });
  } catch {
    todayRedirect(dateString, "error", "Could not delete time block.");
  }

  revalidatePath("/today");
  todayRedirect(dateString, "notice", "Time block deleted.");
}
