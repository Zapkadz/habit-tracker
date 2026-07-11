import { Copy, DatabaseBackup } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BackupPanelProps = {
  databaseUrl: string;
};

export function BackupPanel({ databaseUrl }: BackupPanelProps) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <DatabaseBackup className="size-4" aria-hidden="true" />
          Backup Guidance
        </CardTitle>
        <CardDescription>
          Manual backup notes for the local SQLite file.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm leading-6 text-amber-950">
          Close the dev server before copying the database file. The app does
          not automatically move, delete, or overwrite your SQLite database.
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-950">Database URL</p>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <Copy className="size-4 text-slate-400" aria-hidden="true" />
            <code>{databaseUrl}</code>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-950">
            Simple backup steps
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-600">
            <li>Stop `npm run dev` so SQLite is not actively being used.</li>
            <li>Copy `dev.db` or the file pointed to by `DATABASE_URL`.</li>
            <li>Store the copy outside the repo, for example in a dated backup folder.</li>
            <li>Use JSON export too if you want a readable backup snapshot.</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
