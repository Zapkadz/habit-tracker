import { execFileSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const databasePath = path.join(process.cwd(), "e2e.db");
const journalPaths = [
  databasePath,
  `${databasePath}-journal`,
  `${databasePath}-shm`,
  `${databasePath}-wal`,
];

for (const filePath of journalPaths) {
  rmSync(filePath, { force: true });
}

// Prisma 7's SQLite migration engine expects the target file to exist.
writeFileSync(databasePath, "");

const prismaCli = path.join(
  process.cwd(),
  "node_modules",
  "prisma",
  "build",
  "index.js"
);

execFileSync(process.execPath, [prismaCli, "migrate", "deploy"], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
});
execFileSync(process.execPath, [prismaCli, "db", "seed"], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
});
