# Project Rules

## Product Direction

Build a local-first Routine Balance Dashboard, not a generic checklist app.

The app should stay:

- Daily-first
- Weekly-balanced
- Monthly-reviewed

## MVP Boundaries

Do not add these in the MVP foundation:

- Authentication
- Deployment
- AI analysis
- Cloud sync
- Complex automation

Prefer useful, maintainable local features over broad scope.

## Architecture

- Use Next.js App Router.
- Use TypeScript strictly.
- Use Prisma with SQLite for local storage.
- Keep business logic out of UI components.
- Put scoring logic in `src/lib/scoring`.
- Put warning logic in `src/lib/warnings`.
- Put shared constants in `src/lib/constants`.
- Keep server/database helpers in `src/server` or `src/lib` as appropriate.

## UI Direction

- Clean dashboard layout.
- Light gray or off-white background.
- Compact cards.
- Tables and charts where useful.
- Serious and modern tone.
- Avoid childish or gamified UI.
- Use subtle colors and readable typography.

## Workflow

For each phase:

1. Explain the goal.
2. Provide a short implementation plan.
3. List files to create or modify.
4. List database or schema changes.
5. List manual test steps.
6. Wait for confirmation when the task is large.
7. Implement only the confirmed scope.
8. Run `npm run lint`.
9. Run `npm run build`.
10. Fix errors before closing the phase.

## Git

Branch strategy:

- `main`: stable version
- `develop`: development version
- `feature/*`: new features
- `fix/*`: bug fixes
- `refactor/*`: refactoring

Use Conventional Commits.

Examples:

- `chore: setup local routine balance dashboard`
- `feat: add habit CRUD`
- `feat: add today command center`
- `fix: correct sleep duration calculation`
