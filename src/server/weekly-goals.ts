"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  DEFAULT_WEEKLY_GOAL_UNIT,
  WEEKLY_GOAL_CATEGORIES,
  WEEKLY_GOAL_UNITS,
  type WeeklyGoalCategory,
} from "@/lib/constants/weekly-goals";
import { dateStringToUtcDate } from "@/lib/dates/date-utils";
import { getWeekStartDateString } from "@/lib/dates/week-utils";
import { prisma } from "@/lib/prisma";
import { validateRequiredText } from "@/lib/validation/text";

function firstFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function parseCategory(value: FormDataEntryValue | null): WeeklyGoalCategory {
  const category = firstFormValue(value);

  if (WEEKLY_GOAL_CATEGORIES.includes(category as WeeklyGoalCategory)) {
    return category as WeeklyGoalCategory;
  }

  return "personal";
}

function parseUnit(value: FormDataEntryValue | null) {
  const unit = firstFormValue(value);

  if (WEEKLY_GOAL_UNITS.includes(unit as (typeof WEEKLY_GOAL_UNITS)[number])) {
    return unit;
  }

  return DEFAULT_WEEKLY_GOAL_UNIT;
}

function parseGoalValue(
  value: FormDataEntryValue | null,
  fallback: number,
  min: number,
  max: number
) {
  const parsed = Number.parseFloat(firstFormValue(value));

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}

function validateTitle(title: string) {
  return validateRequiredText(title, "Weekly goal title");
}

function weekRedirect(
  weekStartDate: string,
  type: "notice" | "error",
  message: string
): never {
  redirect(
    `/week?weekStart=${encodeURIComponent(
      weekStartDate
    )}&${type}=${encodeURIComponent(message)}`
  );
}

function parseGoalForm(formData: FormData) {
  const targetValue = parseGoalValue(formData.get("targetValue"), 1, 0.1, 1000);

  return {
    title: validateTitle(firstFormValue(formData.get("title"))),
    category: parseCategory(formData.get("category")),
    targetValue,
    currentValue: parseGoalValue(formData.get("currentValue"), 0, 0, 1000),
    unit: parseUnit(formData.get("unit")),
  };
}

export async function createWeeklyGoal(formData: FormData) {
  const weekStartDate = getWeekStartDateString(
    firstFormValue(formData.get("weekStartDate"))
  );
  const date = dateStringToUtcDate(weekStartDate);

  try {
    await prisma.weeklyGoal.create({
      data: {
        weekStartDate: date,
        ...parseGoalForm(formData),
      },
    });
  } catch (error) {
    weekRedirect(
      weekStartDate,
      "error",
      error instanceof Error ? error.message : "Could not create weekly goal."
    );
  }

  revalidatePath("/week");
  weekRedirect(weekStartDate, "notice", "Weekly goal created.");
}

export async function updateWeeklyGoal(formData: FormData) {
  const id = firstFormValue(formData.get("id"));
  const weekStartDate = getWeekStartDateString(
    firstFormValue(formData.get("weekStartDate"))
  );

  if (!id) {
    weekRedirect(weekStartDate, "error", "Missing weekly goal id.");
  }

  try {
    await prisma.weeklyGoal.update({
      where: { id },
      data: parseGoalForm(formData),
    });
  } catch (error) {
    weekRedirect(
      weekStartDate,
      "error",
      error instanceof Error ? error.message : "Could not update weekly goal."
    );
  }

  revalidatePath("/week");
  weekRedirect(weekStartDate, "notice", "Weekly goal updated.");
}

export async function deleteWeeklyGoal(formData: FormData) {
  const id = firstFormValue(formData.get("id"));
  const weekStartDate = getWeekStartDateString(
    firstFormValue(formData.get("weekStartDate"))
  );

  if (!id) {
    weekRedirect(weekStartDate, "error", "Missing weekly goal id.");
  }

  try {
    await prisma.weeklyGoal.delete({
      where: { id },
    });
  } catch {
    weekRedirect(weekStartDate, "error", "Could not delete weekly goal.");
  }

  revalidatePath("/week");
  weekRedirect(weekStartDate, "notice", "Weekly goal deleted.");
}
