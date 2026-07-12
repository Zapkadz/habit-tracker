import { execFileSync } from "node:child_process";
import path from "node:path";

const env = {
  ...process.env,
  NEXT_DIST_DIR: ".next-verify",
};
const prismaCli = path.join(
  process.cwd(),
  "node_modules",
  "prisma",
  "build",
  "index.js"
);
const nextCli = path.join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);

execFileSync(process.execPath, [prismaCli, "generate"], {
  cwd: process.cwd(),
  env,
  stdio: "inherit",
});
execFileSync(process.execPath, [nextCli, "build"], {
  cwd: process.cwd(),
  env,
  stdio: "inherit",
});
