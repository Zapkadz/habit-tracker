export const ROUTINE_RANKS = [
  {
    key: "S",
    label: "Ready",
    minScore: 90,
    description: "Strong routine with recovery signals under control.",
  },
  {
    key: "A",
    label: "Strong Routine",
    minScore: 80,
    description: "Consistent and balanced enough to trust the system.",
  },
  {
    key: "B",
    label: "Disciplined",
    minScore: 68,
    description: "Solid routine with a few recovery or consistency gaps.",
  },
  {
    key: "C",
    label: "Consistent",
    minScore: 55,
    description: "The pattern is forming. Keep the plan simple and repeatable.",
  },
  {
    key: "D",
    label: "Started",
    minScore: 35,
    description: "Enough data to begin improving one thing at a time.",
  },
  {
    key: "E",
    label: "Chaotic",
    minScore: 0,
    description: "The routine needs fewer moving parts and more recovery.",
  },
] as const;

export const IDENTITY_REMINDERS = {
  steady: "A deliberate day beats a perfect plan.",
  recovery:
    "Protecting recovery is part of serious preparation, not a pause from it.",
  lowData: "Start with one honest log. The pattern can only improve after it is visible.",
  behind: "A smaller plan completed cleanly is stronger than an overloaded one.",
  strong: "Do not raise the difficulty just because the system is working.",
} as const;

export type RoutineRankKey = (typeof ROUTINE_RANKS)[number]["key"];
export type IdentityReminderKey = keyof typeof IDENTITY_REMINDERS;
