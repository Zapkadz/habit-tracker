# Habit Tracker - Routine Balance Dashboard

Local-first web app for planning daily routines, tracking habits, balancing work, study, rest, and sleep, and reviewing consistency over time.

## Current Phase

Phase 1: Data models and seed data.

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

## Navigation

The initial app shell includes:

- Today
- Week
- Month
- Habits
- Analytics
- Settings

The root route redirects to `/today`.
