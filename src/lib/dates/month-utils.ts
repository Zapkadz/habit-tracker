import {
  dateStringToUtcDate,
  getTodayDateString,
  isDateString,
} from "@/lib/dates/date-utils";
import {
  addDaysToDateString,
  dateToDateString,
  getWeekStartDateString,
} from "@/lib/dates/week-utils";

const MONTH_PATTERN = /^\d{4}-\d{2}$/;

export function isMonthString(value: unknown): value is string {
  if (typeof value !== "string" || !MONTH_PATTERN.test(value)) {
    return false;
  }

  const [year, month] = value.split("-").map(Number);

  return month >= 1 && month <= 12 && year >= 1900 && year <= 9999;
}

export function getCurrentMonthString() {
  return getTodayDateString().slice(0, 7);
}

export function parseMonthString(value: unknown) {
  return isMonthString(value) ? value : getCurrentMonthString();
}

export function getMonthStartDateString(monthString: string) {
  return `${parseMonthString(monthString)}-01`;
}

export function getMonthEndDateString(monthString: string) {
  const [year, month] = parseMonthString(monthString).split("-").map(Number);
  const endDate = new Date(Date.UTC(year, month, 0));

  return dateToDateString(endDate);
}

export function getNextMonthStartDateString(monthString: string) {
  const [year, month] = parseMonthString(monthString).split("-").map(Number);
  const nextMonth = new Date(Date.UTC(year, month, 1));

  return dateToDateString(nextMonth);
}

export function addMonthsToMonthString(monthString: string, months: number) {
  const [year, month] = parseMonthString(monthString).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + months, 1));

  return dateToDateString(date).slice(0, 7);
}

export function getMonthDates(monthString: string) {
  const startDate = getMonthStartDateString(monthString);
  const endDate = getMonthEndDateString(monthString);
  const dates: string[] = [];
  let cursor = startDate;

  while (cursor <= endDate) {
    dates.push(cursor);
    cursor = addDaysToDateString(cursor, 1);
  }

  return dates;
}

export function formatMonthLabel(monthString: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(dateStringToUtcDate(getMonthStartDateString(monthString)));
}

export function formatMonthDayLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    timeZone: "UTC",
  }).format(dateStringToUtcDate(value));
}

export function formatCompactWeekdayLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "narrow",
    timeZone: "UTC",
  }).format(dateStringToUtcDate(value));
}

export function getMonthElapsedDates(monthString: string) {
  const today = getTodayDateString();

  return getMonthDates(monthString).filter((date) => date <= today);
}

export function isFutureDateString(value: string) {
  return isDateString(value) && value > getTodayDateString();
}

export function getMonthWeekKey(value: string) {
  return getWeekStartDateString(value);
}
