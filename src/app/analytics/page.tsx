import { AnalyticsInsightPanel } from "@/components/analytics/analytics-insight-panel";
import { AnalyticsRangeSelector } from "@/components/analytics/analytics-range-selector";
import { AnalyticsSummaryCards } from "@/components/analytics/analytics-summary-cards";
import { CategoryBreakdownChart } from "@/components/analytics/category-breakdown-chart";
import { DailyScoreTrendChart } from "@/components/analytics/daily-score-trend-chart";
import { FocusRestTrendChart } from "@/components/analytics/focus-rest-trend-chart";
import { HabitCompletionTrendChart } from "@/components/analytics/habit-completion-trend-chart";
import { MoodStressTrendChart } from "@/components/analytics/mood-stress-trend-chart";
import { PlanAccuracyChart } from "@/components/analytics/plan-accuracy-chart";
import { SleepTrendChart } from "@/components/analytics/sleep-trend-chart";
import { ChallengeConceptCard } from "@/components/motivation/challenge-concept-card";
import { RecoveryMessageCard } from "@/components/motivation/recovery-message-card";
import { RoutineRankCard } from "@/components/motivation/routine-rank-card";
import { getAnalyticsReview } from "@/server/analytics";
import { getMotivationSummary } from "@/server/motivation";

type AnalyticsPageProps = {
  searchParams?: Promise<{
    range?: string;
    start?: string;
    end?: string;
  }>;
};

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const params = searchParams ? await searchParams : {};
  const review = await getAnalyticsReview(params);
  const motivation = await getMotivationSummary(review.endDate);

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <AnalyticsRangeSelector
          startDate={review.startDate}
          endDate={review.endDate}
          presetDays={review.presetDays}
          label={review.label}
        />
      </section>

      <AnalyticsSummaryCards review={review} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
        <div className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-2">
            <DailyScoreTrendChart data={review.trends} />
            <HabitCompletionTrendChart data={review.trends} />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <SleepTrendChart data={review.trends} />
            <FocusRestTrendChart data={review.trends} />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <MoodStressTrendChart data={review.trends} />
            <PlanAccuracyChart data={review.trends} />
          </div>
          <CategoryBreakdownChart data={review.categoryBreakdown} />
        </div>

        <div className="space-y-4">
          <RoutineRankCard motivation={motivation} />
          <RecoveryMessageCard motivation={motivation} />
          <ChallengeConceptCard motivation={motivation} />
          <AnalyticsInsightPanel review={review} />
        </div>
      </section>
    </div>
  );
}
