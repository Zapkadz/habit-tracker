import { buildExportFileName, downloadHeaders, toJsonExport } from "@/lib/export/json-export";
import { getExportSnapshot } from "@/server/export";

export async function GET() {
  const snapshot = await getExportSnapshot();

  return new Response(toJsonExport(snapshot), {
    headers: downloadHeaders(
      buildExportFileName("full", "json"),
      "application/json; charset=utf-8"
    ),
  });
}
