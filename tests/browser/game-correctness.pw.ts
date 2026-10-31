import { expect, test, type Page } from "@playwright/test";

async function queueRolls(page: Page, rolls: string) {
  await page.getByRole("button", { name: "Open settings", exact: true }).click();
  await page.getByRole("button", { name: /Debug Rolls/ }).click();
  await page.locator("textarea").fill(rolls);
  await page.getByRole("button", { name: "Close", exact: true }).click();
}

async function startComputerTurn(page: Page, computerRoll: string) {
  await page.goto("/");
  await queueRolls(page, `1 2 2 3 4 6\n${computerRoll}\n1 2 2 3 4 6`);
  await page.getByRole("button", { name: "Start Game", exact: true }).click();
  await page.getByRole("button", { name: "Die 1: 1", exact: true }).click();
  await page.getByRole("button", { name: "Bank 100 points", exact: true }).click();
}

test("computer banks a winning all-scoring hand instead of rerolling", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await startComputerTurn(page, "1 1 1 1 1 1");
  const summary = page.getByRole("dialog");
  await expect(summary.getByText("Computer won the game.", { exact: true })).toBeVisible({ timeout: 12000 });
  await expect(summary.getByText("4000", { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("computer-banks-winning-hand.png") });
  await summary.getByRole("button", { name: "New Game", exact: true }).click();
  await expect(summary).toHaveCount(0);
  await expect(page.locator("main")).toContainText("Your Turn");
  expect(errors).toEqual([]);
});

test("computer still rerolls hot dice below the winning score", async ({ page }) => {
  await startComputerTurn(page, "1 2 3 4 5 6");
  await expect(page.getByText("Hot dice!", { exact: true })).toBeVisible({ timeout: 12000 });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("main").getByText("1500", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Die 3: 2", exact: true })).toBeVisible();
});

test("computer includes spare scoring singles before banking a win", async ({ page }) => {
  await startComputerTurn(page, "1 1 1 1 5 2");
  const summary = page.getByRole("dialog");
  await expect(summary.getByText("Computer won the game.", { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(summary.getByText("2050", { exact: true })).toBeVisible();
});

test("First to 6 preserves historical records and completes after six wins", async ({ page }, testInfo) => {
  test.setTimeout(60000);
  await page.addInitScript(() => {
    localStorage.setItem("velocidice.records", JSON.stringify({ vsComputer: {
      wins: 7, losses: 2, highestPlayerScore: 4000, matchesWonByLength: { 1: 1, 3: 2, 10: 4 },
    } }));
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Stats", exact: true }).click();
  const statsTile = page.getByText("First to 6 Wins", { exact: true }).locator("..");
  await expect(statsTile).toContainText("4");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Change game settings", exact: true }).click();
  await page.getByRole("button", { name: "First to 6", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.locator("#menu-config-summary")).toContainText("First to 6");
  await queueRolls(page, Array(7).fill("1 1 1 1 1 1").join("\n"));
  await page.getByRole("button", { name: "Start Game", exact: true }).click();
  await expect(page.locator("main")).toContainText("First to 6");
  for (let game = 1; game <= 6; game++) {
    for (let die = 1; die <= 6; die++) {
      await page.getByRole("button", { name: `Die ${die}: 1`, exact: true }).click();
    }
    await page.getByRole("button", { name: "Bank 4,000 & Win", exact: true }).click();
    const summary = page.getByRole("dialog");
    await expect(summary).toContainText("First to 6");
    if (game < 6) {
      await expect(summary.getByRole("heading", { name: "Game Complete" })).toBeVisible();
      await summary.getByRole("button", { name: "Next Game", exact: true }).click();
    } else {
      await expect(summary.getByRole("heading", { name: "Match Complete" })).toBeVisible();
      await expect(summary.getByText("You won the First to 6 match.", { exact: true })).toBeVisible();
      await page.screenshot({ path: testInfo.outputPath("first-to-six-complete.png") });
    }
  }
  const records = await page.evaluate(() => JSON.parse(localStorage.getItem("velocidice.records")!));
  expect(records.vsComputer.matchesWonByLength[10]).toBe(5);
  await page.getByRole("dialog").getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Rules", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toContainText("Best of 10");
});

test("rules explain two triplets and Farkle automatically passes the turn", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Rules", exact: true }).first().click();
  const rules = page.getByRole("dialog");
  const triplets = rules.getByText("Two triplets", { exact: true }).locator("../..");
  await expect(triplets).toContainText("2,500 points");
  await expect(rules).toContainText("automatically switches to the next player after a short pause");
  await expect(rules).toContainText("you can bank your points or choose Hold & Reroll");
  await triplets.scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("rules-two-triplets.png") });
  await rules.getByRole("button", { name: "Close", exact: true }).click();
  await queueRolls(page, "2 2 3 3 4 6\n1 2 2 3 4 6");
  await page.getByRole("button", { name: "Start Game", exact: true }).click();
  await expect(page.getByRole("button", { name: "Hold & Reroll", exact: true })).toBeDisabled();
  await expect(page.locator("main")).toContainText("Computer Turn", { timeout: 6000 });
});
