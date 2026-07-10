import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

const seedHabits = [
  {
    name: "Study N2",
    icon: "book-open",
    category: "study",
    weight: 8,
    targetPerWeek: 5,
  },
  {
    name: "Java Spring",
    icon: "code-2",
    category: "study",
    weight: 8,
    targetPerWeek: 5,
  },
  {
    name: "Kaiwa",
    icon: "messages-square",
    category: "study",
    weight: 6,
    targetPerWeek: 3,
  },
  {
    name: "Sleep before 23:30",
    icon: "moon",
    category: "health",
    weight: 10,
    targetPerWeek: 5,
  },
  {
    name: "Exercise",
    icon: "dumbbell",
    category: "health",
    weight: 6,
    targetPerWeek: 3,
  },
  {
    name: "Planning tomorrow",
    icon: "calendar-check",
    category: "discipline",
    weight: 5,
    targetPerWeek: 5,
  },
] as const;

async function main() {
  for (const habit of seedHabits) {
    await prisma.habit.upsert({
      where: { name: habit.name },
      update: {
        icon: habit.icon,
        category: habit.category,
        weight: habit.weight,
        targetPerWeek: habit.targetPerWeek,
        isActive: true,
      },
      create: {
        ...habit,
        isActive: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
