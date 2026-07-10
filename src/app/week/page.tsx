import {
  Activity,
  BatteryCharging,
  CalendarRange,
  Moon,
  Target,
  Timer,
} from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function WeekPage() {
  return (
    <PagePlaceholder
      eyebrow="Weekly Balance"
      title="Balance workload, sleep, and recovery"
      description="The week page will show seven-day balance, weekly goals, overload count, recovery coverage, and simple warnings."
      metrics={[
        {
          label: "Week Score",
          value: "--",
          caption: "Aggregate balance arrives after daily scoring.",
          tone: "blue",
        },
        {
          label: "Average Sleep",
          value: "--",
          caption: "Calculated from daily check-ins.",
          tone: "green",
        },
        {
          label: "Focus Total",
          value: "0h",
          caption: "Study, work, and deep work blocks.",
          tone: "neutral",
        },
        {
          label: "Recovery",
          value: "0d",
          caption: "Recovery and rest days across the week.",
          tone: "amber",
        },
      ]}
      sections={[
        {
          title: "7-Day Overview",
          description:
            "Each day will show day type, balance score, sleep, focus, rest, and warning state.",
          icon: CalendarRange,
        },
        {
          title: "Weekly Goals",
          description:
            "Targets like N2 hours, Java Spring hours, and Kaiwa sessions will track progress.",
          icon: Target,
        },
        {
          title: "Sleep Average",
          description:
            "Weekly sleep patterns will help catch repeated sleep debt before it becomes normal.",
          icon: Moon,
        },
        {
          title: "Focus Load",
          description:
            "Total focus time will separate productive challenge from unsustainable overload.",
          icon: Timer,
        },
        {
          title: "Recovery Coverage",
          description:
            "The page will make it obvious when a lighter day or recovery block is needed.",
          icon: BatteryCharging,
        },
        {
          title: "Weekly Warnings",
          description:
            "Warnings will flag too many heavy days, low recovery, poor sleep average, and behind goals.",
          icon: Activity,
        },
      ]}
    />
  );
}
