import { DailyProgressChart } from "@/components/month/daily-progress-chart";
import { MonthSelector } from "@/components/month/month-selector";
import { MonthlyAnalysisPanel } from "@/components/month/monthly-analysis-panel";
import { MonthlyHabitGrid } from "@/components/month/monthly-habit-grid";
import { MonthlySummaryCards } from "@/components/month/monthly-summary-cards";
import { MoodTrendChart } from "@/components/month/mood-trend-chart";
import { SleepTrendChart } from "@/components/month/sleep-trend-chart";
import { TopHabits } from "@/components/month/top-habits";
import { WeakHabits } from "@/components/month/weak-habits";
import { WeeklyProgressChart } from "@/components/month/weekly-progress-chart";
import { RoutineRankCard } from "@/components/motivation/routine-rank-card";
import { SoftStreakCard } from "@/components/motivation/soft-streak-card";
import { getMotivationSummary } from "@/server/motivation";
import { getMonthlyBalance } from "@/server/monthly-balance";

type MonthPageProps = {
  searchParams?: Promise<{
    month?: string;
  }>;
};

export default async function MonthPage({ searchParams }: MonthPageProps) {
  const params = searchParams ? await searchParams : {};
  const review = await getMonthlyBalance(params.month);
  const motivation = await getMotivationSummary(review.endDate);

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <MonthSelector month={review.month} />
      </section>

      <MonthlySummaryCards review={review} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
        <div className="min-w-0 space-y-4">
          <div className="grid gap-4 xl:grid-cols-2">
            <DailyProgressChart data={review.dailyProgress} />
            <WeeklyProgressChart data={review.weeklyProgress} />
          </div>
          <MonthlyHabitGrid review={review} />
          <div className="grid gap-4 xl:grid-cols-2">
            <MoodTrendChart data={review.dailyProgress} />
            <SleepTrendChart data={review.dailyProgress} />
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <RoutineRankCard motivation={motivation} />
          <SoftStreakCard motivation={motivation} />
          <MonthlyAnalysisPanel review={review} />
          <TopHabits habits={review.topHabits} />
          <WeakHabits habits={review.weakHabits} />
        </div>
      </section>
    </div>
  );
}
