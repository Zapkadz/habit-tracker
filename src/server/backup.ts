"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BACKUP_MAX_FILE_BYTES,
  parseBackupSnapshotText,
} from "@/lib/backup/backup-schema";
import { replaceDatabaseFromBackup } from "@/lib/backup/restore-database";

function settingsRedirect(
  type: "notice" | "error",
  message: string
): never {
  redirect(`/settings?${type}=${encodeURIComponent(message)}`);
}

export async function restoreBackup(formData: FormData) {
  const confirmation = formData.get("confirmation");
  const file = formData.get("backupFile");

  if (confirmation !== "replace") {
    settingsRedirect(
      "error",
      "Confirm that you understand the restore will replace local data."
    );
  }

  if (!(file instanceof File) || file.size === 0) {
    settingsRedirect("error", "Choose a JSON backup file first.");
  }

  if (file.size > BACKUP_MAX_FILE_BYTES) {
    settingsRedirect("error", "Backup file must be 5 MB or smaller.");
  }

  try {
    const snapshot = parseBackupSnapshotText(await file.text());
    await replaceDatabaseFromBackup(snapshot);
  } catch (error) {
    settingsRedirect(
      "error",
      error instanceof Error ? error.message : "Could not restore backup."
    );
  }

  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath("/week");
  revalidatePath("/month");
  revalidatePath("/habits");
  revalidatePath("/analytics");
  revalidatePath("/settings");
  settingsRedirect("notice", "Backup restored successfully.");
}
