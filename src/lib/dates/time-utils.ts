const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isTimeString(value: unknown): value is string {
  return typeof value === "string" && TIME_PATTERN.test(value);
}

export function parseTimeString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  return isTimeString(trimmed) ? trimmed : "";
}

export function timeStringToMinutes(value: string) {
  if (!isTimeString(value)) {
    return 0;
  }

  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

export function minutesBetween(startTime: string, endTime: string) {
  if (!isTimeString(startTime) || !isTimeString(endTime)) {
    return 0;
  }

  const start = timeStringToMinutes(startTime);
  const end = timeStringToMinutes(endTime);

  if (end >= start) {
    return end - start;
  }

  return 24 * 60 - start + end;
}

export function formatDuration(totalMinutes: number) {
  const safeMinutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

export function minutesToHours(totalMinutes: number) {
  return Math.round((totalMinutes / 60) * 10) / 10;
}
