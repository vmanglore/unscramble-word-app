import { expect, test } from "@playwright/test";

test.describe("Release 1.2 Playwright smoke coverage", () => {
  test("TR-005 homepage search loads grouped results and can open the result route", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Unscramble Words" })).toBeVisible();
    const searchInput = page.locator("#letters");
    await expect(searchInput).toBeVisible();

    await searchInput.fill("aelpp");
    await page.getByRole("button", { name: "Unscramble" }).click();

    await expect(page.getByRole("heading", { name: "Matching Words" })).toBeVisible();
    await expect(page.getByText(/words found for AELPP/i)).toBeVisible();
    await expect(page.getByText(/\d+ Letter Words \(\d+\)/).first()).toBeVisible();

    await page.getByRole("button", { name: "Open result page" }).click();
    await expect(page).toHaveURL(/\/unscramble\/aelpp$/);
    await expect(page.getByRole("heading", { name: "Unscramble AELPP" })).toBeVisible();
  });

  test("TR-005 dynamic unscramble route renders grouped collapsible results", async ({
    page,
  }) => {
    await page.goto("/unscramble/aelpp");

    await expect(page.getByRole("heading", { name: "Unscramble AELPP" })).toBeVisible();
    await expect(page.getByText(/\d+ words? found/i)).toBeVisible();

    const groups = page.locator("details");
    await expect(groups.first()).toBeVisible();
    await expect(groups.first()).toHaveAttribute("open", "");
    await expect(page.getByText(/\d+ Letter Words \(\d+\)/).first()).toBeVisible();

    await groups.first().locator("summary").click();
    await expect(groups.first()).not.toHaveAttribute("open", "");

    await groups.first().locator("summary").click();
    await expect(groups.first()).toHaveAttribute("open", "");
  });

  test("TR-005 words from letters route and internal navigation remain functional", async ({
    page,
  }) => {
    await page.goto("/words-from-letters/aelpp");

    await expect(
      page.getByRole("heading", { name: "Words From Letters AELPP" }),
    ).toBeVisible();
    await expect(page.getByText(/Total Words Found: \d+/i)).toBeVisible();
    await expect(page.getByText(/\d+ Letter Words \(\d+\)/).first()).toBeVisible();

    await page.getByRole("link", { name: "Word Finder" }).click();
    await expect(page).toHaveURL(/\/word-finder$/);
    await expect(page.getByRole("heading", { name: "Word Finder" })).toBeVisible();

    await page.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Unscramble Words" })).toBeVisible();
  });
});
