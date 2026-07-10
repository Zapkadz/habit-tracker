"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_HABIT_WEIGHT,
  DEFAULT_TARGET_PER_WEEK,
  HABIT_CATEGORIES,
  MAX_HABIT_WEIGHT,
  MAX_TARGET_PER_WEEK,
  MIN_HABIT_WEIGHT,
  MIN_TARGET_PER_WEEK,
  type HabitCategory,
} from "@/lib/constants/habits";

const HABITS_PATH = "/habits";

function firstFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function parseHabitCategory(value: FormDataEntryValue | null): HabitCategory {
  const category = firstFormValue(value);

  if (HABIT_CATEGORIES.includes(category as HabitCategory)) {
    return category as HabitCategory;
  }

  return "personal";
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

function redirectWithMessage(type: "notice" | "error", message: string): never {
  redirect(`${HABITS_PATH}?${type}=${encodeURIComponent(message)}`);
}

function parseHabitForm(formData: FormData) {
  const name = firstFormValue(formData.get("name"));
  const icon = firstFormValue(formData.get("icon")) || "circle-check";

  if (name.length < 2) {
    throw new Error("Habit name must be at least 2 characters.");
  }

  return {
    name,
    icon,
    category: parseHabitCategory(formData.get("category")),
    weight: parseBoundedInteger(
      formData.get("weight"),
      DEFAULT_HABIT_WEIGHT,
      MIN_HABIT_WEIGHT,
      MAX_HABIT_WEIGHT
    ),
    targetPerWeek: parseBoundedInteger(
      formData.get("targetPerWeek"),
      DEFAULT_TARGET_PER_WEEK,
      MIN_TARGET_PER_WEEK,
      MAX_TARGET_PER_WEEK
    ),
    isActive: formData.get("isActive") === "on",
  };
}

function parseHabitFormOrRedirect(formData: FormData) {
  try {
    return parseHabitForm(formData);
  } catch (error) {
    redirectWithMessage(
      "error",
      error instanceof Error ? error.message : "Habit data is invalid."
    );
  }
}

export async function getHabits() {
  return prisma.habit.findMany({
    orderBy: [
      { isActive: "desc" },
      { category: "asc" },
      { weight: "desc" },
      { name: "asc" },
    ],
    include: {
      _count: {
        select: {
          logs: true,
        },
      },
    },
  });
}

export async function createHabit(formData: FormData) {
  const data = parseHabitFormOrRedirect(formData);

  try {
    await prisma.habit.create({ data });
  } catch {
    redirectWithMessage(
      "error",
      "Could not create habit. Check if the habit name already exists."
    );
  }

  revalidatePath(HABITS_PATH);
  revalidatePath("/today");
  redirectWithMessage("notice", "Habit created.");
}

export async function updateHabit(formData: FormData) {
  const id = firstFormValue(formData.get("id"));

  if (!id) {
    redirectWithMessage("error", "Missing habit id.");
  }

  const data = parseHabitFormOrRedirect(formData);

  try {
    await prisma.habit.update({
      where: { id },
      data,
    });
  } catch {
    redirectWithMessage("error", "Could not update habit.");
  }

  revalidatePath(HABITS_PATH);
  revalidatePath("/today");
  redirectWithMessage("notice", "Habit updated.");
}

export async function toggleHabitActive(formData: FormData) {
  const id = firstFormValue(formData.get("id"));
  const isActive = formData.get("isActive") === "true";

  if (!id) {
    redirectWithMessage("error", "Missing habit id.");
  }

  try {
    await prisma.habit.update({
      where: { id },
      data: { isActive },
    });
  } catch {
    redirectWithMessage("error", "Could not change habit active state.");
  }

  revalidatePath(HABITS_PATH);
  revalidatePath("/today");
  redirectWithMessage(
    "notice",
    isActive ? "Habit activated." : "Habit deactivated."
  );
}

export async function deleteHabit(formData: FormData) {
  const id = firstFormValue(formData.get("id"));

  if (!id) {
    redirectWithMessage("error", "Missing habit id.");
  }

  try {
    await prisma.habit.delete({
      where: { id },
    });
  } catch {
    redirectWithMessage("error", "Could not delete habit.");
  }

  revalidatePath(HABITS_PATH);
  revalidatePath("/today");
  redirectWithMessage("notice", "Habit deleted.");
}
