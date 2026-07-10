const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const DEFAULT_TIME_ZONE = "Asia/Saigon";

export function getTodayDateString(timeZone = DEFAULT_TIME_ZONE) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isDateString(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_ONLY_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

export function parseDateString(value: unknown) {
  return isDateString(value) ? value : getTodayDateString();
}

export function dateStringToUtcDate(value: string) {
  if (!isDateString(value)) {
    throw new Error("Invalid date string. Expected YYYY-MM-DD.");
  }

  return new Date(`${value}T00:00:00.000Z`);
}

export function formatReadableDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(dateStringToUtcDate(value));
}
