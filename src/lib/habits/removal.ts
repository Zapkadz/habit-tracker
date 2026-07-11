export type HabitRemovalMode = "archive" | "delete";

export function getHabitRemovalMode(logCount: number): HabitRemovalMode {
  return logCount > 0 ? "archive" : "delete";
}
