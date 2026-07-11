import { buildExportFileName, downloadHeaders } from "@/lib/export/json-export";
import { getTimeBlocksCsv } from "@/server/export";

export async function GET() {
  const csv = await getTimeBlocksCsv();

  return new Response(csv, {
    headers: downloadHeaders(
      buildExportFileName("time-blocks", "csv"),
      "text/csv; charset=utf-8"
    ),
  });
}
