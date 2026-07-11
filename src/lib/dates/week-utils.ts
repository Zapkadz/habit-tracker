import {
  dateStringToUtcDate,
  getTodayDateString,
  isDateString,
} from "@/lib/dates/date-utils";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_PER_WEEK = 7;

export function dateToDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDaysToDateString(value: string, days: number) {
  const date = dateStringToUtcDate(value);

  date.setUTCDate(date.getUTCDate() + days);

  return dateToDateString(date);
}

export function getWeekStartDateString(value?: string) {
  const baseDateString = isDateString(value) ? value : getTodayDateString();
  const date = dateStringToUtcDate(baseDateString);
  const day = date.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  date.setUTCDate(date.getUTCDate() + mondayOffset);

  return dateToDateString(date);
}

export function addWeeksToDateString(value: string, weeks: number) {
  return getWeekStartDateString(addDaysToDateString(value, weeks * DAYS_PER_WEEK));
}

export function getWeekDates(weekStartDate: string) {
  const start = getWeekStartDateString(weekStartDate);

  return Array.from({ length: DAYS_PER_WEEK }, (_, index) =>
    addDaysToDateString(start, index)
  );
}

export function getWeekEndDateString(weekStartDate: string) {
  return addDaysToDateString(getWeekStartDateString(weekStartDate), 6);
}

export function formatWeekRange(weekStartDate: string) {
  const start = dateStringToUtcDate(getWeekStartDateString(weekStartDate));
  const end = dateStringToUtcDate(getWeekEndDateString(weekStartDate));
  const startLabel = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(end);

  return `${startLabel} - ${endLabel}`;
}

export function formatWeekdayLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    timeZone: "UTC",
  }).format(dateStringToUtcDate(value));
}

export function formatShortDateLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(dateStringToUtcDate(value));
}

export function getElapsedWeekPercent(
  weekStartDate: string,
  referenceDateString = getTodayDateString()
) {
  const start = dateStringToUtcDate(getWeekStartDateString(weekStartDate));
  const end = dateStringToUtcDate(addDaysToDateString(dateToDateString(start), 6));
  const reference = dateStringToUtcDate(
    isDateString(referenceDateString) ? referenceDateString : getTodayDateString()
  );

  if (reference < start) {
    return 0;
  }

  if (reference > end) {
    return 100;
  }

  const elapsedDays = Math.floor((reference.getTime() - start.getTime()) / MS_PER_DAY) + 1;

  return Math.round((elapsedDays / DAYS_PER_WEEK) * 100);
}
