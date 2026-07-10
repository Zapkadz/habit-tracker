import {
  Bell,
  DatabaseBackup,
  Gauge,
  Moon,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function SettingsPage() {
  return (
    <PagePlaceholder
      eyebrow="Local Settings"
      title="Tune app preferences and score thresholds"
      description="Settings stay simple in the MVP: defaults, thresholds, and local backup/export notes. No authentication or deployment."
      metrics={[
        {
          label: "Sleep Target",
          value: "7-9h",
          caption: "Default target for normal days.",
          tone: "green",
        },
        {
          label: "Focus Target",
          value: "3-6h",
          caption: "Default productive focus range.",
          tone: "blue",
        },
        {
          label: "Rest Target",
          value: "60m+",
          caption: "Default minimum recovery signal.",
          tone: "amber",
        },
        {
          label: "Storage",
          value: "SQLite",
          caption: "Local database first.",
          tone: "neutral",
        },
      ]}
      sections={[
        {
          title: "Preferences",
          description:
            "Display density and basic app preferences will live here later.",
          icon: Settings,
        },
        {
          title: "Score Thresholds",
          description:
            "Excellent, good, okay, warning, and burnout risk thresholds will be configurable later.",
          icon: Gauge,
        },
        {
          title: "Default Targets",
          description:
            "Sleep, focus, and rest targets will provide the starting point for scoring.",
          icon: SlidersHorizontal,
        },
        {
          title: "Sleep Defaults",
          description:
            "Default sleep expectations can stay strict on normal days and flexible on travel days.",
          icon: Moon,
        },
        {
          title: "Reminders",
          description:
            "Reminders are out of MVP scope, but the settings surface leaves room for them.",
          icon: Bell,
        },
        {
          title: "Backup and Export",
          description:
            "JSON or CSV export can be added in local polish after core tracking is useful.",
          icon: DatabaseBackup,
        },
      ]}
    />
  );
}
