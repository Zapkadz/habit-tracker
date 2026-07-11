"use server";

import { getAnalyticsReview } from "@/server/analytics";
import { getWeeklyBalance } from "@/server/weekly-balance";
import { addDaysToDateString, getWeekStartDateString } from "@/lib/dates/week-utils";
import { getTodayDateString, parseDateString } from "@/lib/dates/date-utils";
import { calculateRecoveryMessage } from "@/lib/motivation/recovery";
import { calculateRoutineRank } from "@/lib/motivation/rank";
import { calculateSoftStreak } from "@/lib/motivation/soft-streaks";

export async function getMotivationSummary(inputDate?: string) {
  const endDate = parseDateString(inputDate ?? getTodayDateString());
  const startDate = addDaysToDateString(endDate, -29);
  const [analytics, week] = await Promise.all([
    getAnalyticsReview({ start: startDate, end: endDate }),
    getWeeklyBalance(getWeekStartDateString(endDate)),
  ]);
  const softStreak = calculateSoftStreak(analytics.days);
  const rank = calculateRoutineRank(analytics.summary);
  const recovery = calculateRecoveryMessage(analytics.days, analytics.summary);
  const missionSuggestions =
    week.goals.length > 0
      ? []
      : [
          "Create one study goal for this week.",
          "Add one recovery or sleep goal.",
          "Keep the mission count small enough to finish.",
        ];

  return {
    date: endDate,
    analytics,
    week,
    softStreak,
    rank,
    recovery,
    weeklyMissions: week.goals,
    missionSuggestions,
  };
}
