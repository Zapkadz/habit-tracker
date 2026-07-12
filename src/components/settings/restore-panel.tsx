"use client";

import { useState, type ChangeEvent } from "react";
import { AlertTriangle, FileCheck2, Import } from "lucide-react";
import {
  BACKUP_MAX_FILE_BYTES,
  getBackupRecordCounts,
  parseBackupSnapshotText,
} from "@/lib/backup/backup-schema";
import { restoreBackup } from "@/server/backup";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PreviewCounts = ReturnType<typeof getBackupRecordCounts>;

const countLabels: Array<[keyof PreviewCounts, string]> = [
  ["habits", "Habits"],
  ["habitLogs", "Habit logs"],
  ["timeBlocks", "Time blocks"],
  ["dailyCheckins", "Check-ins"],
  ["dailyPriorities", "Priorities"],
  ["weeklyGoals", "Weekly goals"],
];

export function RestorePanel() {
  const [preview, setPreview] = useState<PreviewCounts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setPreview(null);
    setError(null);
    setConfirmed(false);

    if (!file) {
      return;
    }

    if (file.size > BACKUP_MAX_FILE_BYTES) {
      setError("Backup file must be 5 MB or smaller.");
      return;
    }

    try {
      const snapshot = parseBackupSnapshotText(await file.text());
      setPreview(getBackupRecordCounts(snapshot));
    } catch (fileError) {
      setError(
        fileError instanceof Error
          ? fileError.message
          : "Could not read this backup file."
      );
    }
  };

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Import className="size-4" aria-hidden="true" />
          Restore Backup
        </CardTitle>
        <CardDescription>
          Validate a full JSON export, review its contents, then replace the
          current local database in one transaction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={restoreBackup} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="backup-file"
              className="text-sm font-semibold text-slate-950"
            >
              Full JSON backup
            </label>
            <input
              id="backup-file"
              name="backupFile"
              type="file"
              accept=".json,application/json"
              required
              onChange={handleFileChange}
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium"
            />
            <p className="text-xs leading-5 text-slate-500">
              Maximum 5 MB. Only versioned Full JSON exports are accepted.
            </p>
          </div>

          {error ? (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
              <AlertTriangle
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <p className="min-w-0 break-words">{error}</p>
            </div>
          ) : null}

          {preview ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
                <FileCheck2 className="size-4" aria-hidden="true" />
                Backup passed validation
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {countLabels.map(([key, label]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-emerald-200 bg-white px-2.5 py-2"
                  >
                    <dt className="text-xs text-slate-500">{label}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-slate-950">
                      {preview[key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <label className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm leading-6 text-amber-950">
            <input
              name="confirmation"
              type="checkbox"
              value="replace"
              checked={confirmed}
              disabled={!preview}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-1 size-4 shrink-0"
            />
            <span>
              I understand this replaces all current local data. I have
              downloaded a current backup if I need to return to it.
            </span>
          </label>

          <ConfirmSubmitButton
            confirmMessage="Replace all current local data with this validated backup?"
            pendingLabel="Restoring..."
            disabled={!preview || !confirmed}
            variant="destructive"
            size="lg"
          >
            <Import className="size-4" aria-hidden="true" />
            Restore and replace data
          </ConfirmSubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
