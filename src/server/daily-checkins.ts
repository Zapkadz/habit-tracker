"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DAY_TYPES, type DayType } from "@/lib/constants/day-types";
import { dateStringToUtcDate, parseDateString } from "@/lib/dates/date-utils";
import { parseTimeString } from "@/lib/dates/time-utils";

function firstFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: FormDataEntryValue | null) {
  const text = firstFormValue(value);

  return text.length > 0 ? text : null;
}

function parseDayType(value: FormDataEntryValue | null): DayType {
  const dayType = firstFormValue(value);

  if (DAY_TYPES.some((item) => item.value === dayType)) {
    return dayType as DayType;
  }

  return "normal";
}

function parseRating(value: FormDataEntryValue | null) {
  const parsed = Number.parseInt(firstFormValue(value), 10);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.min(Math.max(parsed, 1), 10);
}

function todayRedirect(date: string, type: "notice" | "error", message: string): never {
  redirect(
    `/today?date=${encodeURIComponent(date)}&${type}=${encodeURIComponent(
      message
    )}`
  );
}

export async function getDailyCheckin(dateString: string) {
  return prisma.dailyCheckin.findUnique({
    where: {
      date: dateStringToUtcDate(dateString),
    },
  });
}

export async function upsertDailyCheckin(formData: FormData) {
  const dateString = parseDateString(firstFormValue(formData.get("date")));
  const sleepStart = parseTimeString(formData.get("sleepStart")) || null;
  const wakeTime = parseTimeString(formData.get("wakeTime")) || null;
  const date = dateStringToUtcDate(dateString);

  try {
    await prisma.dailyCheckin.upsert({
      where: { date },
      update: {
        dayType: parseDayType(formData.get("dayType")),
        sleepStart,
        wakeTime,
        mood: parseRating(formData.get("mood")),
        motivation: parseRating(formData.get("motivation")),
        stress: parseRating(formData.get("stress")),
        note: nullableText(formData.get("note")),
      },
      create: {
        date,
        dayType: parseDayType(formData.get("dayType")),
        sleepStart,
        wakeTime,
        mood: parseRating(formData.get("mood")),
        motivation: parseRating(formData.get("motivation")),
        stress: parseRating(formData.get("stress")),
        note: nullableText(formData.get("note")),
      },
    });
  } catch {
    todayRedirect(dateString, "error", "Could not save daily check-in.");
  }

  revalidatePath("/today");
  todayRedirect(dateString, "notice", "Daily check-in saved.");
}
