import {
  Archive,
  Dumbbell,
  Edit3,
  ListChecks,
  Plus,
  Weight,
} from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function HabitsPage() {
  return (
    <PagePlaceholder
      eyebrow="Habit Management"
      title="Create and tune recurring habits"
      description="The habits page will manage active habits, categories, icons, weights, and weekly targets. CRUD starts in Phase 2."
      metrics={[
        {
          label: "Active Habits",
          value: "0",
          caption: "Seed data arrives in Phase 1.",
          tone: "blue",
        },
        {
          label: "Categories",
          value: "7",
          caption: "Health, study, work, lifestyle, rest, discipline, personal.",
          tone: "neutral",
        },
        {
          label: "Weighted Score",
          value: "Ready",
          caption: "Important habits will matter more.",
          tone: "green",
        },
        {
          label: "Target / Week",
          value: "--",
          caption: "Weekly targets arrive with habit CRUD.",
          tone: "amber",
        },
      ]}
      sections={[
        {
          title: "Create Habit",
          description:
            "New habits will include name, icon, category, weight, target per week, and active state.",
          icon: Plus,
        },
        {
          title: "Edit Habit",
          description:
            "Habit details can be tuned as routines become more realistic.",
          icon: Edit3,
        },
        {
          title: "Activate or Archive",
          description:
            "Inactive habits will stay out of daily checklists without losing history.",
          icon: Archive,
        },
        {
          title: "Categories",
          description:
            "Habit categories keep health, study, work, rest, and discipline visible.",
          icon: Dumbbell,
        },
        {
          title: "Weights",
          description:
            "Sleep before 23:30 can count more than a small maintenance habit.",
          icon: Weight,
        },
        {
          title: "Habit Logs",
          description:
            "Daily logs will support done, partial, skipped, and missed states.",
          icon: ListChecks,
        },
      ]}
    />
  );
}
