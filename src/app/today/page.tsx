import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListChecks,
  Target,
} from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function TodayPage() {
  return (
    <PagePlaceholder
      eyebrow="Today Command Center"
      title="Plan and review the current day"
      description="The main working screen will combine day type, top priorities, time blocks, habit status, check-in data, and balance analysis."
      metrics={[
        {
          label: "Daily Score",
          value: "--",
          caption: "Score calculation starts in Phase 4.",
          tone: "blue",
        },
        {
          label: "Priorities",
          value: "0 / 3",
          caption: "Daily priority CRUD arrives in Phase 3.",
          tone: "neutral",
        },
        {
          label: "Focus Blocks",
          value: "0h",
          caption: "Timeline data arrives with TimeBlock CRUD.",
          tone: "green",
        },
        {
          label: "Warnings",
          value: "--",
          caption: "Rule-based advice arrives in Phase 4.",
          tone: "amber",
        },
      ]}
      sections={[
        {
          title: "Date and Day Type",
          description:
            "Normal, study sprint, work heavy, recovery, rest, deadline, and travel days will use different scoring expectations.",
          icon: CalendarDays,
        },
        {
          title: "Timeline",
          description:
            "Planned and actual time blocks will track sleep, study, work, rest, exercise, meals, commute, and personal time.",
          icon: Clock3,
        },
        {
          title: "Top Priorities",
          description:
            "A day can still count as successful when the important priorities are completed, even if minor habits move.",
          icon: Target,
        },
        {
          title: "Habit Checklist",
          description:
            "Active habits will support done, partial, skipped, and missed statuses with weight-aware scoring.",
          icon: ListChecks,
        },
        {
          title: "Daily Check-in",
          description:
            "Mood, motivation, stress, sleep start, wake time, and notes will provide context for the score.",
          icon: CheckCircle2,
        },
        {
          title: "Warnings and Advice",
          description:
            "Supportive messages will flag low sleep, overwork, low rest, high stress, and unrealistic plans.",
          icon: AlertTriangle,
        },
      ]}
    />
  );
}
