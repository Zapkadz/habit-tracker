-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 5,
    "targetPerWeek" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HabitLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habitId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'missed',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HabitLog_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimeBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "plannedStartTime" TEXT NOT NULL,
    "plannedEndTime" TEXT NOT NULL,
    "actualStartTime" TEXT,
    "actualEndTime" TEXT,
    "actualDurationMinutes" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "energyLevel" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DailyCheckin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "dayType" TEXT NOT NULL DEFAULT 'normal',
    "sleepStart" TEXT,
    "wakeTime" TEXT,
    "mood" INTEGER,
    "motivation" INTEGER,
    "stress" INTEGER,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DailyScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "sleepScore" REAL NOT NULL DEFAULT 0,
    "focusScore" REAL NOT NULL DEFAULT 0,
    "habitScore" REAL NOT NULL DEFAULT 0,
    "restScore" REAL NOT NULL DEFAULT 0,
    "moodScore" REAL NOT NULL DEFAULT 0,
    "priorityScore" REAL NOT NULL DEFAULT 0,
    "totalScore" REAL NOT NULL DEFAULT 0,
    "warningLevel" TEXT NOT NULL DEFAULT 'good',
    "advice" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DailyPriority" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "priorityOrder" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WeeklyGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekStartDate" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "targetValue" REAL NOT NULL,
    "currentValue" REAL NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Habit_name_key" ON "Habit"("name");

-- CreateIndex
CREATE INDEX "Habit_category_idx" ON "Habit"("category");

-- CreateIndex
CREATE INDEX "Habit_isActive_idx" ON "Habit"("isActive");

-- CreateIndex
CREATE INDEX "HabitLog_date_idx" ON "HabitLog"("date");

-- CreateIndex
CREATE INDEX "HabitLog_status_idx" ON "HabitLog"("status");

-- CreateIndex
CREATE UNIQUE INDEX "HabitLog_habitId_date_key" ON "HabitLog"("habitId", "date");

-- CreateIndex
CREATE INDEX "TimeBlock_date_idx" ON "TimeBlock"("date");

-- CreateIndex
CREATE INDEX "TimeBlock_category_idx" ON "TimeBlock"("category");

-- CreateIndex
CREATE INDEX "TimeBlock_status_idx" ON "TimeBlock"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DailyCheckin_date_key" ON "DailyCheckin"("date");

-- CreateIndex
CREATE INDEX "DailyCheckin_dayType_idx" ON "DailyCheckin"("dayType");

-- CreateIndex
CREATE UNIQUE INDEX "DailyScore_date_key" ON "DailyScore"("date");

-- CreateIndex
CREATE INDEX "DailyScore_warningLevel_idx" ON "DailyScore"("warningLevel");

-- CreateIndex
CREATE INDEX "DailyPriority_date_idx" ON "DailyPriority"("date");

-- CreateIndex
CREATE INDEX "DailyPriority_status_idx" ON "DailyPriority"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DailyPriority_date_priorityOrder_key" ON "DailyPriority"("date", "priorityOrder");

-- CreateIndex
CREATE INDEX "WeeklyGoal_weekStartDate_idx" ON "WeeklyGoal"("weekStartDate");

-- CreateIndex
CREATE INDEX "WeeklyGoal_category_idx" ON "WeeklyGoal"("category");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyGoal_weekStartDate_title_key" ON "WeeklyGoal"("weekStartDate", "title");
