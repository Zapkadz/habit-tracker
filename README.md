# Habit Tracker - Routine Balance Dashboard

Local-first web app for planning daily routines, tracking habits, balancing work, study, rest, and sleep, and reviewing consistency over time.

## Current Phase

Phase 8: Motivation system.

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

## Validation

Run lint:

```bash
npm run lint
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
- Calculate monthly completion, tracked days, average sleep, best streak, weak days, and weak habits.
- Show daily progress, weekly progress, mood/motivation, and sleep/focus/rest charts.
- Highlight top habits and weak habits.
- Show monthly warnings for low consistency, low sleep, high stress, weak habits, and declining recent progress.

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
- Add a lightweight 90-day challenge concept card for future campaign mode.

## Navigation

The initial app shell includes:

- Today
- Week
- Month
- Habits
- Analytics
- Settings

The root route redirects to `/today`.
