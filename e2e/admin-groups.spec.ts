import { expect, test } from "@playwright/test";

const sessionUrl = /\/api\/auth\/get-session/;
const E2E_SESSION_COOKIE = "e2e-session";

test.describe("admin groups access", () => {
	test("redirects unauthenticated users to login", async ({ page }) => {
		await page.route(sessionUrl, async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ user: null }),
			});
		});

		await page.goto("/en/admin/groups", { waitUntil: "domcontentloaded" });
		await expect(page).toHaveURL(/\/en\/auth\/login/);
	});

	test("shows groups page when session exists", async ({ page, context }) => {
		await context.addCookies([
			{
				name: E2E_SESSION_COOKIE,
				value: "1",
				domain: "localhost",
				path: "/",
			},
		]);

		await page.goto("/en/admin/groups", { waitUntil: "domcontentloaded" });
		await expect(page).toHaveURL(/\/en\/admin\/groups/);
		await expect(
			page.getByRole("heading", { level: 1, name: /^groups$/i })
		).toBeVisible();
	});
});
