import { buildExportFileName, downloadHeaders } from "@/lib/export/json-export";
import { getDailyCheckinsCsv } from "@/server/export";

export async function GET() {
  const csv = await getDailyCheckinsCsv();

  return new Response(csv, {
    headers: downloadHeaders(
      buildExportFileName("checkins", "csv"),
      "text/csv; charset=utf-8"
    ),
  });
}
