export function calculateSleepScore(sleepMinutes: number) {
  const sleepHours = sleepMinutes / 60;

  if (sleepMinutes <= 0) {
    return 0;
  }

  if (sleepHours >= 7 && sleepHours <= 9) {
    return 100;
  }

  if (sleepHours >= 6 && sleepHours < 7) {
    return 70;
  }

  if (sleepHours >= 5 && sleepHours < 6) {
    return 40;
  }

  if (sleepHours < 5) {
    return 20;
  }

  if (sleepHours > 10) {
    return 70;
  }

  return 90;
}
