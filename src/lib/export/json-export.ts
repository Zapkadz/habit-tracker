export function buildExportFileName(prefix: string, extension: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return `habit-tracker-${prefix}-${timestamp}.${extension}`;
}

export function toJsonExport(data: unknown) {
  return JSON.stringify(data, null, 2);
}

export function downloadHeaders(fileName: string, contentType: string) {
  return {
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${fileName}"`,
    "Cache-Control": "no-store",
  };
}
