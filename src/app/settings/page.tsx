import { Database, Download, Gauge, Settings } from "lucide-react";
import { AppInfoPanel } from "@/components/settings/app-info-panel";
import { BackupPanel } from "@/components/settings/backup-panel";
import { ExportPanel } from "@/components/settings/export-panel";
import { RestorePanel } from "@/components/settings/restore-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSettingsOverview } from "@/server/export";

export const dynamic = "force-dynamic";

type SettingsPageProps = {
  searchParams?: Promise<{
    notice?: string;
    error?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = searchParams ? await searchParams : {};
  const overview = await getSettingsOverview();

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Local Settings
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
              Export, backup, and app defaults
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Keep the local MVP transparent: export your data, understand the
              SQLite storage, and review the scoring defaults currently used by
              the app.
            </p>
          </div>
        </div>
      </section>

      {params.notice ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          {params.notice}
        </div>
      ) : null}
      {params.error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900">
          {params.error}
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          size="sm"
          className="rounded-lg border border-blue-100 bg-blue-50 text-blue-950 shadow-sm ring-0"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
              <Settings className="size-3.5" aria-hidden="true" />
              Mode
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">Local</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              No auth, no deployment, personal SQLite first.
            </p>
          </CardContent>
        </Card>

        <Card
          size="sm"
          className="rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-950 shadow-sm ring-0"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
              <Database className="size-3.5" aria-hidden="true" />
              Records
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {overview.counts.habitLogs + overview.counts.timeBlocks}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Habit logs and time blocks tracked locally.
            </p>
          </CardContent>
        </Card>

        <Card
          size="sm"
          className="rounded-lg border border-amber-100 bg-amber-50 text-amber-950 shadow-sm ring-0"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
              <Download className="size-3.5" aria-hidden="true" />
              Exports
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">JSON/CSV</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Full snapshot plus spreadsheet-friendly files.
            </p>
          </CardContent>
        </Card>

        <Card
          size="sm"
          className="rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm ring-0"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-current/60">
              <Gauge className="size-3.5" aria-hidden="true" />
              Score config
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">Read-only</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-current/65">
              Defaults are visible here before editable settings.
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div className="space-y-4">
          <ExportPanel counts={overview.counts} />
          <RestorePanel />
          <BackupPanel databaseUrl={overview.databaseUrl} />
        </div>
        <AppInfoPanel databaseUrl={overview.databaseUrl} />
      </div>
    </div>
  );
}
