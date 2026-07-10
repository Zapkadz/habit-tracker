import {
  BarChart3,
  CalendarDays,
  Grid3X3,
  LineChart,
  Medal,
  TrendingDown,
} from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function MonthPage() {
  return (
    <PagePlaceholder
      eyebrow="Monthly Habit Dashboard"
      title="Review consistency and progress trends"
      description="The month page will be the review surface: habit grid, charts, stats, top habits, weak habits, mood trend, and sleep trend."
      metrics={[
        {
          label: "Completion",
          value: "--%",
          caption: "Monthly weighted habit completion.",
          tone: "blue",
        },
        {
          label: "Best Streak",
          value: "--",
          caption: "Soft streaks will avoid harsh resets.",
          tone: "green",
        },
        {
          label: "Weak Habits",
          value: "--",
          caption: "Habits needing attention.",
          tone: "amber",
        },
        {
          label: "Sleep Trend",
          value: "--",
          caption: "Monthly sleep direction.",
          tone: "neutral",
        },
      ]}
      sections={[
        {
          title: "Monthly Habit Grid",
          description:
            "A compact Excel-style grid will show habit consistency across the month.",
          icon: Grid3X3,
        },
        {
          title: "Daily Progress Chart",
          description:
            "Daily completion percentages will make momentum and dips easy to scan.",
          icon: BarChart3,
        },
        {
          title: "Weekly Progress Chart",
          description:
            "Weeks will be compared so the month does not hide overloaded periods.",
          icon: LineChart,
        },
        {
          title: "Top Habits",
          description:
            "Strong habits will be separated from habits that need a different plan.",
          icon: Medal,
        },
        {
          title: "Weak Habits",
          description:
            "Skipped and missed patterns will be reviewed without turning the app into a blame machine.",
          icon: TrendingDown,
        },
        {
          title: "Monthly Summary",
          description:
            "The review will answer whether sleep, mood, motivation, and routine consistency improved.",
          icon: CalendarDays,
        },
      ]}
    />
  );
}
