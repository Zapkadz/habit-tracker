import type { DayType } from "@/lib/constants/day-types";
import {
  DAY_TYPE_TARGET_ADJUSTMENTS,
  DEFAULT_FOCUS_TARGET_HOURS,
  DEFAULT_SLEEP_TARGET_HOURS,
} from "@/lib/constants/scoring";
import {
  WARNING_THRESHOLDS,
  type WarningLevel,
} from "@/lib/constants/warnings";
import type {
  DailyComponentScores,
  DailyDataStatus,
  DailyMetrics,
  DailyWarning,
  ScoringCheckin,
} from "@/lib/scoring/types";

const warningRank: Record<WarningLevel, number> = {
  good: 0,
  notice: 1,
  warning: 2,
  risk: 3,
};

function warning(
  id: string,
  level: WarningLevel,
  title: string,
  message: string
): DailyWarning {
  return { id, level, title, message };
}

export function getHighestWarningLevel(warnings: DailyWarning[]): WarningLevel {
  return warnings.reduce<WarningLevel>((highest, item) => {
    return warningRank[item.level] > warningRank[highest] ? item.level : highest;
  }, "good");
}

export function calculateDailyWarnings({
  dayType,
  metrics,
  checkin,
  scores,
  dataStatus,
}: {
  dayType: DayType;
  metrics: DailyMetrics;
  checkin: ScoringCheckin;
  scores: DailyComponentScores;
  dataStatus: DailyDataStatus;
}) {
  const warnings: DailyWarning[] = [];
  const sleepHours = metrics.sleepMinutes / 60;
  const focusHours = metrics.focusMinutes / 60;
  const plannedHours = metrics.plannedMinutes / 60;
  const dayTypeAdjustment = DAY_TYPE_TARGET_ADJUSTMENTS[dayType];

  if (!dataStatus.isComplete) {
    const missing =
      dataStatus.missingSignals.length > 0
        ? dataStatus.missingSignals.join(", ")
        : "core signals";

    return [
      warning(
        "incomplete-day",
        "notice",
        dataStatus.state === "empty" ? "No data recorded" : "Day is incomplete",
        `Add ${missing} before trusting this day's score.`
      ),
    ];
  }

  if (metrics.sleepMinutes > 0 && sleepHours < WARNING_THRESHOLDS.strongLowSleepHours) {
    warnings.push(
      warning(
        "strong-low-sleep",
        "risk",
        "Sleep is dangerously low",
        "Today needs protection. Consider reducing non-essential work and adding recovery time."
      )
    );
  } else if (metrics.sleepMinutes > 0 && sleepHours < WARNING_THRESHOLDS.lowSleepHours) {
    warnings.push(
      warning(
        "low-sleep",
        "warning",
        "Low sleep",
        "Sleep is below the healthy range. Keep the plan lighter if possible."
      )
    );
  } else if (metrics.sleepMinutes === 0) {
    warnings.push(
      warning(
        "missing-sleep",
        "notice",
        "Sleep not recorded",
        "Add sleep start and wake time or a sleep block to make the score more useful."
      )
    );
  }

  if (
    focusHours > WARNING_THRESHOLDS.strongOverworkFocusHours &&
    metrics.restMinutes < WARNING_THRESHOLDS.minimumRestWithHeavyFocusMinutes
  ) {
    warnings.push(
      warning(
        "strong-overwork",
        "risk",
        "Heavy focus with little recovery",
        "This plan looks overloaded. Remove one lower-priority block or add a real recovery block."
      )
    );
  } else if (focusHours > WARNING_THRESHOLDS.overworkFocusHours) {
    warnings.push(
      warning(
        "overwork",
        "warning",
        "High focus load",
        "Focus time is high. Keep rest visible so the day does not become a grind."
      )
    );
  }

  if (
    dayTypeAdjustment.lowFocusPenalty === "normal" &&
    focusHours < 1
  ) {
    warnings.push(
      warning(
        "low-focus",
        "notice",
        "Low focus progress",
        "Focus time is light for this day type. Pick one small priority to keep momentum."
      )
    );
  }

  if (metrics.restMinutes > 0 && metrics.restMinutes < WARNING_THRESHOLDS.lowRestMinutes) {
    warnings.push(
      warning(
        "low-rest",
        "warning",
        "Not enough rest",
        "Rest is very low. Add at least a short recovery block if the day allows it."
      )
    );
  } else if (metrics.restMinutes === 0 && focusHours >= DEFAULT_FOCUS_TARGET_HOURS.min) {
    warnings.push(
      warning(
        "missing-rest",
        "notice",
        "No rest planned",
        "A focused day still needs visible recovery. Add a short rest block."
      )
    );
  }

  if (metrics.blockCount > WARNING_THRESHOLDS.manyPlannedBlocks) {
    warnings.push(
      warning(
        "too-many-blocks",
        "notice",
        "Many planned blocks",
        "The schedule is dense. Make sure transitions and meals are not squeezed out."
      )
    );
  }

  if (plannedHours > WARNING_THRESHOLDS.unrealisticPlannedHours) {
    warnings.push(
      warning(
        "unrealistic-plan",
        "warning",
        "Plan may be unrealistic",
        "Planned time is very high. Consider trimming or combining lower-value blocks."
      )
    );
  }

  if (typeof checkin?.motivation === "number" && checkin.motivation <= WARNING_THRESHOLDS.lowMotivation) {
    warnings.push(
      warning(
        "low-motivation",
        "notice",
        "Low motivation",
        "Keep the next step smaller. A deliberate light day is better than forcing a brittle plan."
      )
    );
  }

  if (typeof checkin?.stress === "number" && checkin.stress >= WARNING_THRESHOLDS.highStress) {
    warnings.push(
      warning(
        "high-stress",
        "warning",
        "High stress",
        "Stress is high. Reduce optional load or add a clear shutdown point."
      )
    );
  }

  if (
    warnings.length === 0 &&
    sleepHours >= DEFAULT_SLEEP_TARGET_HOURS.min &&
    sleepHours <= DEFAULT_SLEEP_TARGET_HOURS.max &&
    focusHours <= dayTypeAdjustment.focusMaxHours &&
    metrics.restMinutes >= dayTypeAdjustment.restMinMinutes &&
    scores.moodScore >= 60
  ) {
    warnings.push(
      warning(
        "good-balance",
        "good",
        "Good balance",
        "Today looks deliberate: sleep, focus, rest, and mood signals are in a healthy range."
      )
    );
  }

  return warnings;
}

export function getDailyAdvice(warnings: DailyWarning[], totalScore: number) {
  const highestLevel = getHighestWarningLevel(warnings);
  const priorityWarning = warnings.find(
    (item) => item.level === highestLevel && item.level !== "good"
  );

  if (priorityWarning) {
    return priorityWarning.message;
  }

  if (totalScore >= 90) {
    return "Excellent balance. Keep the plan steady and avoid adding unnecessary load.";
  }

  if (totalScore >= 75) {
    return "Good day shape. Keep the important work visible and protect recovery.";
  }

  if (totalScore >= 60) {
    return "The day is workable, but one area needs attention. Adjust before it becomes pressure.";
  }

  if (totalScore >= 40) {
    return "Today needs care. Reduce scope or add rest before pushing harder.";
  }

  return "Burnout risk is high. Prioritize sleep, recovery, and only the most essential task.";
}
