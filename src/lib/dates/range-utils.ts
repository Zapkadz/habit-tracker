import {
  dateStringToUtcDate,
  getTodayDateString,
  isDateString,
} from "@/lib/dates/date-utils";
import { addDaysToDateString } from "@/lib/dates/week-utils";

export const ANALYTICS_RANGE_OPTIONS = [7, 30, 60, 90] as const;
export const DEFAULT_ANALYTICS_RANGE_DAYS = 30;
export const MAX_ANALYTICS_RANGE_DAYS = 180;

export type AnalyticsRangeDays = (typeof ANALYTICS_RANGE_OPTIONS)[number];

export type AnalyticsRangeInput = {
  start?: string;
  end?: string;
  range?: string;
};

export type AnalyticsDateRange = {
  startDate: string;
  endDate: string;
  presetDays: number | null;
  dayCount: number;
  label: string;
};

function parsePresetDays(value: unknown) {
  const parsed = Number.parseInt(typeof value === "string" ? value : "", 10);

  if (ANALYTICS_RANGE_OPTIONS.includes(parsed as AnalyticsRangeDays)) {
    return parsed;
  }

  return DEFAULT_ANALYTICS_RANGE_DAYS;
}

export function getInclusiveDayCount(startDate: string, endDate: string) {
  const start = dateStringToUtcDate(startDate).getTime();
  const end = dateStringToUtcDate(endDate).getTime();

  return Math.floor((end - start) / (24 * 60 * 60 * 1000)) + 1;
}

function normalizeDateRange(startDate: string, endDate: string) {
  let safeStart = startDate;
  let safeEnd = endDate;

  if (safeStart > safeEnd) {
    [safeStart, safeEnd] = [safeEnd, safeStart];
  }

  const dayCount = getInclusiveDayCount(safeStart, safeEnd);

  if (dayCount > MAX_ANALYTICS_RANGE_DAYS) {
    safeStart = addDaysToDateString(safeEnd, -MAX_ANALYTICS_RANGE_DAYS + 1);
  }

  return {
    startDate: safeStart,
    endDate: safeEnd,
    dayCount: getInclusiveDayCount(safeStart, safeEnd),
  };
}

export function parseAnalyticsDateRange(
  input: AnalyticsRangeInput = {}
): AnalyticsDateRange {
  if (isDateString(input.start) && isDateString(input.end)) {
    const normalized = normalizeDateRange(input.start, input.end);

    return {
      ...normalized,
      presetDays: null,
      label: `${normalized.startDate} to ${normalized.endDate}`,
    };
  }

  const presetDays = parsePresetDays(input.range);
  const endDate = getTodayDateString();
  const startDate = addDaysToDateString(endDate, -presetDays + 1);

  return {
    startDate,
    endDate,
    presetDays,
    dayCount: presetDays,
    label: `Last ${presetDays} days`,
  };
}

export function getDateRangeDates(startDate: string, endDate: string) {
  const normalized = normalizeDateRange(startDate, endDate);
  const dates: string[] = [];
  let cursor = normalized.startDate;

  while (cursor <= normalized.endDate) {
    dates.push(cursor);
    cursor = addDaysToDateString(cursor, 1);
  }

  return dates;
}
