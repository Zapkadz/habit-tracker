export const DAY_TYPES = [
  {
    value: "normal",
    label: "Normal",
    description: "Balanced day with healthy sleep, moderate focus, and rest.",
  },
  {
    value: "study_sprint",
    label: "Study Sprint",
    description: "Higher study load is acceptable with sleep and rest checks.",
  },
  {
    value: "work_heavy",
    label: "Work Heavy",
    description: "Higher work load is acceptable with recovery guardrails.",
  },
  {
    value: "recovery",
    label: "Recovery",
    description: "Lower focus expectations and more rest encouraged.",
  },
  {
    value: "rest",
    label: "Rest",
    description: "Light routine with sleep, rest, and recovery as priority.",
  },
  {
    value: "deadline",
    label: "Deadline",
    description: "Higher workload allowed while watching dangerous fatigue.",
  },
  {
    value: "travel",
    label: "Travel",
    description: "Flexible routine with lower habit expectations.",
  },
] as const;

export type DayType = (typeof DAY_TYPES)[number]["value"];
