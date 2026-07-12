import { expect, test } from "@playwright/test";

test("versioned backup restores the database to its snapshot", async ({
  page,
  request,
}) => {
  const response = await request.get("/export/full");

  expect(response.ok()).toBeTruthy();
  const backup = await response.json();
  expect(backup.schemaVersion).toBe(1);
  expect(backup.exportedAt).toBeTruthy();

  await page.goto("/today?date=2026-07-12");
  await page
    .getByPlaceholder("Finish Java Spring lesson")
    .fill("Temporary restore record");
  await page.getByRole("button", { name: "Add priority" }).click();
  await expect(
    page.getByText("Temporary restore record", { exact: true })
  ).toBeVisible();

  await page.goto("/settings");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Full JSON backup").setInputFiles({
    name: "habit-tracker-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(backup)),
  });

  await expect(page.getByText("Backup passed validation")).toBeVisible();
  const restoreButton = page.getByRole("button", {
    name: "Restore and replace data",
  });
  await expect(restoreButton).toBeDisabled();

  await page.getByRole("checkbox").check();
  await expect(restoreButton).toBeEnabled();
  page.once("dialog", (dialog) => dialog.accept());
  await restoreButton.click();
  await expect(page.getByText("Backup restored successfully.")).toBeVisible();

  const restoredResponse = await request.get("/export/full");
  const restoredBackup = await restoredResponse.json();
  expect(restoredBackup.data.dailyPriorities).toHaveLength(0);
  expect(restoredBackup.data.habits).toHaveLength(backup.data.habits.length);
});

test("daily priority and time block happy path works", async ({ page }) => {
  const date = "2026-07-12";
  const priorityTitle = "Finish release readiness review";
  const blockTitle = "Release readiness review";

  await page.goto(`/today?date=${date}`);
  await page.getByPlaceholder("Finish Java Spring lesson").fill(priorityTitle);
  await page.getByRole("button", { name: "Add priority" }).click();
  await expect(page.getByText(priorityTitle, { exact: true })).toBeVisible();

  await page.getByPlaceholder("N2 vocabulary").fill(blockTitle);
  await page.getByLabel("Start", { exact: true }).fill("09:00");
  await page.getByLabel("End", { exact: true }).fill("10:00");
  await page.getByRole("button", { name: "Add block" }).click();

  const block = page
    .getByTestId("time-block-item")
    .filter({ hasText: blockTitle });
  await expect(block).toBeVisible();
  await block.getByRole("button", { name: "Done" }).click();
  await expect(
    page
      .getByTestId("time-block-item")
      .filter({ hasText: blockTitle })
      .getByText("Actual: 09:00 to 10:00 - 1h")
  ).toBeVisible();
});

test("Today remains free of horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/today?date=2026-07-12");

  const widths = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(widths.scrollWidth).toBeLessThanOrEqual(widths.clientWidth + 1);
});

test("Settings cards do not overflow in the desktop two-column layout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1365, height: 768 });
  await page.goto("/settings");
  await expect(page.getByText("Restore Backup", { exact: true })).toBeVisible();

  const overflow = await page.evaluate(() => {
    const main = document.querySelector("main");
    const elements = Array.from(main?.querySelectorAll("*") ?? []);

    return elements
      .filter((element) => element.scrollWidth > element.clientWidth + 1)
      .map((element) => ({
        tag: element.tagName,
        text: element.textContent?.trim().slice(0, 80),
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }));
  });

  expect(overflow).toEqual([]);
});

test("core pages load after restoring an empty database", async ({
  page,
  request,
}) => {
  const response = await request.get("/export/full");
  const emptyBackup = await response.json();

  for (const key of Object.keys(emptyBackup.data)) {
    emptyBackup.data[key] = [];
  }

  await page.goto("/settings");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Full JSON backup").setInputFiles({
    name: "empty-habit-tracker-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(emptyBackup)),
  });
  await expect(page.getByText("Backup passed validation")).toBeVisible();
  await page.getByRole("checkbox").check();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Restore and replace data" })
    .click();
  await expect(page.getByText("Backup restored successfully.")).toBeVisible();

  for (const path of [
    "/today?date=2026-07-12",
    "/habits",
    "/week",
    "/month",
    "/analytics",
  ]) {
    await page.goto(path);
    await expect(page.locator("main").getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Something went wrong")).toHaveCount(0);
  }
});
