import { buildExportFileName, downloadHeaders } from "@/lib/export/json-export";
import { getHabitLogsCsv } from "@/server/export";

export async function GET() {
  const csv = await getHabitLogsCsv();

  return new Response(csv, {
    headers: downloadHeaders(
      buildExportFileName("habit-logs", "csv"),
      "text/csv; charset=utf-8"
    ),
  });
}
