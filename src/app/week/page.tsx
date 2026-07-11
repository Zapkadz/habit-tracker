import { SoftStreakCard } from "@/components/motivation/soft-streak-card";
import { WeeklyMissionCard } from "@/components/motivation/weekly-mission-card";
import { WeekSelector } from "@/components/week/week-selector";
import { WeeklyDayOverview } from "@/components/week/weekly-day-overview";
import { WeeklyGoalPanel } from "@/components/week/weekly-goal-panel";
import { WeeklySummaryCards } from "@/components/week/weekly-summary-cards";
import { WeeklyWarningPanel } from "@/components/week/weekly-warning-panel";
import { getMotivationSummary } from "@/server/motivation";
import { getWeeklyBalance } from "@/server/weekly-balance";

type WeekPageProps = {
  searchParams?: Promise<{
    weekStart?: string;
    notice?: string;
    error?: string;
  }>;
};

export default async function WeekPage({ searchParams }: WeekPageProps) {
  const params = searchParams ? await searchParams : {};
  const balance = await getWeeklyBalance(params.weekStart);
  const motivation = await getMotivationSummary(balance.weekEndDate);

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <WeekSelector weekStartDate={balance.weekStartDate} />
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

      <WeeklySummaryCards balance={balance} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">
        <div className="space-y-4">
          <WeeklyDayOverview days={balance.days} />
          <WeeklyGoalPanel
            weekStartDate={balance.weekStartDate}
            goals={balance.goals}
          />
        </div>
        <div className="space-y-4">
          <WeeklyMissionCard motivation={motivation} />
          <SoftStreakCard motivation={motivation} />
          <WeeklyWarningPanel balance={balance} />
        </div>
      </section>
    </div>
  );
}
