import { test, expect } from "@playwright/test";

/**
 * Smoke: VMS admin vendors list loads under e2e session.
 * Requires NEXT_PUBLIC_E2E / e2e-session cookie (see admin-groups.spec.ts).
 */
test.describe("VMS admin smoke", () => {
	test.beforeEach(async ({ page, context }) => {
		await context.addCookies([
			{
				name: "e2e-session",
				value: "1",
				domain: "localhost",
				path: "/",
			},
		]);
		await page.goto("/en/admin/vendors");
	});

	test("vendors list renders", async ({ page }) => {
		await expect(page.getByRole("heading", { name: "Vendors" })).toBeVisible();
		await expect(page.getByText(/Apex Industrial Supply/i)).toBeVisible({
			timeout: 15_000,
		});
	});
});

test.describe("VMS vendor smoke", () => {
	test.beforeEach(async ({ page, context }) => {
		await context.addCookies([
			{
				name: "e2e-session",
				value: "1",
				domain: "localhost",
				path: "/",
			},
		]);
		await page.goto("/en/vendor");
	});

	test("vendor dashboard renders", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: /dashboard|workspace|Apex/i }).first()
		).toBeVisible({ timeout: 15_000 });
	});
});
