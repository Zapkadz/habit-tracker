# Habit Tracker - Routine Balance Dashboard

Local-first web app for planning daily routines, tracking habits, balancing work, study, rest, and sleep, and reviewing consistency over time.

## Current Phase

Phase 10: Core correctness and stabilization.

The foundation includes:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma configured for SQLite
- App shell with sidebar navigation
- Placeholder pages for Today, Week, Month, Habits, Analytics, and Settings
- Prisma models for habits, logs, time blocks, check-ins, scores, priorities, and weekly goals
- Seed habits for the first local dataset
- Habit management UI
- Daily habit checklist with saved habit logs
- Daily check-in with day type, sleep, mood, motivation, stress, and notes
- Top 3 daily priorities
- Time block planning with planned and actual time fields
- Basic daily totals for sleep, focus, rest, and planned time
- Daily Balance Score
- Rule-based warnings and supportive advice
- Weekly balance dashboard with goals, 7-day overview, and weekly warnings
- Monthly habit review dashboard with grid, charts, stats, and trend warnings
- Analytics dashboard with date ranges, long-range trends, plan accuracy, category breakdown, and insights
- Motivation system with soft streak, routine rank, recovery guidance, weekly mission, identity reminders, and 90-day challenge concept
- Local Settings page with JSON/CSV export, backup guidance, app defaults, loading states, and error handling
- Stabilized scoring rules for incomplete days, planned vs actual time, skipped habits, and weekly habit targets
- Safe habit removal that archives habits with history instead of deleting logs
- Node test coverage for core scoring, analytics, motivation, and habit safety rules

No authentication, deployment, AI, or full feature logic is included in the MVP foundation.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma ORM
- SQLite

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
copy .env.example .env
```

Generate the Prisma client:

```bash
npm run db:generate
```

Create and apply local database migrations:

```bash
npm run db:migrate
```

Seed the local database:

```bash
npm run db:seed
```

Run the local development server:

```bash
npm run dev
```

Open the local URL printed by Next.js.

## Daily Use Flow

1. Open `Today`.
2. Pick the current date and set the day type in the daily check-in.
3. Add up to 3 priorities.
4. Add time blocks for sleep, focus, rest, meals, and personal time.
5. Mark habit status during or at the end of the day.
6. Fill mood, motivation, stress, sleep start, and wake time.
7. Record actual time on completed time blocks when possible.
8. Review Week, Month, and Analytics after several complete days.

## Validation

Run lint:

```bash
npm run lint
```

Run tests:

```bash
npm run test
```

Run production build:

```bash
npm run build
```

## Database

SQLite is configured through Prisma.

The local database URL is:

```env
DATABASE_URL="file:./dev.db"
```

The initial schema includes:

- `Habit`
- `HabitLog`
- `TimeBlock`
- `DailyCheckin`
- `DailyScore`
- `DailyPriority`
- `WeeklyGoal`

The local SQLite database file is ignored by Git.

## Export and Backup

Open `Settings` to download:

- Full JSON export
- Habit logs CSV
- Time blocks CSV
- Check-ins CSV

For a database backup, stop the dev server first, then copy `dev.db` or the file pointed to by `DATABASE_URL`.

## Phase 2 Features

- Create, edit, delete, activate, and deactivate habits.
- Set habit category, icon key, weight, and weekly target.
- Track daily habit status from the Today page.
- Supported daily statuses: `done`, `partial`, `skipped`, and `missed`.
- Clear a habit log when a date should return to an unrecorded state.

## Phase 3 Features

- Select a date on the Today page.
- Save a daily check-in with day type and personal context.
- Create, update, and delete up to 3 daily priorities.
- Create, update, and delete time blocks for the selected date.
- Track planned and actual time for each block.
- Review basic daily totals before full scoring arrives.

## Phase 4 Features

- Calculate Sleep, Focus, Habit, Rest, Mood, and Priority scores.
- Calculate Daily Balance Score from weighted component scores.
- Adjust focus and rest expectations by day type.
- Show supportive warnings for low sleep, overwork, low rest, unrealistic plans, low motivation, and high stress.
- Show a good balance message when the day has healthy signals.
- Treat days with missing core signals as `Incomplete` instead of scoring them as poor days.
- Count actual time for focus, rest, and sleep; planned time stays a planning signal only.
- Treat skipped or missing habit logs as neutral for scoring, while `missed` remains zero.

## Phase 5 Features

- Select and review a Monday-based week.
- Show 7-day overview cards with day type, Daily Balance Score, sleep, focus, rest, and warning state.
- Calculate weekly score, average sleep, total focus, total rest, overloaded days, and recovery coverage.
- Create, update, and delete weekly goals with current progress and target values.
- Flag weekly goals that are behind the expected pace.
- Show weekly warnings for overloaded weeks, low average sleep, weak recovery, and behind goals.

## Phase 6 Features

- Select and review a calendar month.
- Show compact Excel-style habit grid across all days in the month.
- Calculate monthly completion, complete days, average sleep, best streak, weak days, and weak habits.
- Show daily progress, weekly progress, mood/motivation, and sleep/focus/rest charts.
- Highlight top habits and weak habits.
- Show monthly warnings for low consistency, low sleep, high stress, weak habits, and declining recent progress.
- Use `targetPerWeek` when calculating habit progress.

## Phase 7 Features

- Select analytics ranges using 7, 30, 60, 90 day presets or custom start/end dates.
- Show long-range summary cards for average score, sleep, focus, rest, plan accuracy, and risk days.
- Chart Daily Balance Score, habit completion, sleep, focus/rest, mood/motivation/stress, and plan accuracy.
- Compare planned and recorded actual time by day.
- Break down planned and actual time by time block category.
- Show rule-based insights for repeated risk days, low sleep, high stress, low rest with heavy focus, weak plan accuracy, and declining habit trends.

## Phase 8 Features

- Show a soft streak that counts steady days without harsh resets.
- Calculate a 30-day routine rank from score, habit completion, sleep, and risk days.
- Show recovery guidance based on recent sleep, stress, focus, rest, and planning signals.
- Reuse Weekly Goals as Weekly Missions, with suggestions when no mission exists.
- Show serious identity reminders on Today.
- Add a lightweight 90-day challenge concept card for future campaign mode without treating 30-day data as 90-day progress.

## Phase 9 Features

- Replace Settings placeholder with local app info, database info, score defaults, export tools, and backup guidance.
- Add full JSON export for core local tables.
- Add CSV export for habit logs, time blocks, and daily check-ins.
- Add route-level loading states for daily, weekly, monthly, analytics, habits, and settings pages.
- Add a simple app error boundary for recoverable page failures.

## Phase 10 Features

- Add automated tests with `tsx --test`.
- Separate planned and actual time in Daily Balance scoring.
- Mark empty or partially logged days as `Incomplete` and exclude them from score averages, streaks, and rank.
- Preserve habit history by archiving habits with logs instead of hard deleting them.
- Keep inactive habits visible in historical analytics when they have logs.
- Apply weekly habit targets to monthly habit completion.
- Prevent weekly recovery suggestions from selecting past days.
- Show `Unranked` until at least 7 complete days exist.
- Fix Month grid horizontal overflow on small screens.

## Navigation

The initial app shell includes:

- Today
- Week
- Month
- Habits
- Analytics
- Settings

The root route redirects to `/today`.
