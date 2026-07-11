type CsvValue = string | number | boolean | Date | null | undefined;

export type CsvColumn<T> = {
  header: string;
  value: (row: T) => CsvValue;
};

function normalizeCsvValue(value: CsvValue) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value === null || typeof value === "undefined") {
    return "";
  }

  return String(value);
}

function escapeCsvValue(value: CsvValue) {
  const normalized = normalizeCsvValue(value);

  if (/[",\r\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }

  return normalized;
}

export function rowsToCsv<T>(rows: T[], columns: CsvColumn<T>[]) {
  const header = columns.map((column) => escapeCsvValue(column.header)).join(",");
  const body = rows.map((row) =>
    columns.map((column) => escapeCsvValue(column.value(row))).join(",")
  );

  return [header, ...body].join("\r\n");
}
