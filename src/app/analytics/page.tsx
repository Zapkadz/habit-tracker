import {
  Activity,
  BarChart3,
  Brain,
  Gauge,
  LineChart,
  Moon,
} from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function AnalyticsPage() {
  return (
    <PagePlaceholder
      eyebrow="Routine Analytics"
      title="Understand long-term routine patterns"
      description="Analytics will start basic in the MVP and grow into sleep, focus, rest, mood, stress, plan accuracy, and burnout risk trends."
      metrics={[
        {
          label: "Sleep Trend",
          value: "--",
          caption: "Daily check-in data required.",
          tone: "green",
        },
        {
          label: "Focus Trend",
          value: "--",
          caption: "TimeBlock data required.",
          tone: "blue",
        },
        {
          label: "Stress Trend",
          value: "--",
          caption: "Check-in history required.",
          tone: "amber",
        },
        {
          label: "Plan Accuracy",
          value: "--",
          caption: "Plan vs actual data required.",
          tone: "neutral",
        },
      ]}
      sections={[
        {
          title: "Sleep",
          description:
            "Sleep duration and debt patterns will be tracked across days and weeks.",
          icon: Moon,
        },
        {
          title: "Focus Time",
          description:
            "Study, work, and deep work trends will show whether workload is realistic.",
          icon: BarChart3,
        },
        {
          title: "Rest Time",
          description:
            "Rest and recovery time will be compared with focus load.",
          icon: Activity,
        },
        {
          title: "Mood and Motivation",
          description:
            "Mood, motivation, and stress will add human context to routine data.",
          icon: Brain,
        },
        {
          title: "Burnout Risk",
          description:
            "Risk will be rule-based first, using sleep, focus, rest, and stress signals.",
          icon: Gauge,
        },
        {
          title: "Plan Accuracy",
          description:
            "Planned versus actual duration will reveal recurring estimation problems.",
          icon: LineChart,
        },
      ]}
    />
  );
}
