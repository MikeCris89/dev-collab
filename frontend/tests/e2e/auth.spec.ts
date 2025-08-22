import { test, expect } from "@playwright/test";

const response = (code: number, body: any) => {
	return {
		status: code,
		headers: { "content-type": "application/json" },
		body: JSON.stringify(body),
	};
};

test.describe("Auth", () => {
	test("No User -> Show Login", async ({ page }) => {
		// no user found
		await page.route("**/auth/me", (r) => {
			return r.fulfill(response(401, { message: "Unauthorized" }));
		});

		// Visit the app
		await page.goto("/");

		// Login component visible
		expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
	});
	test("User Found -> Show Notes", async ({ page }) => {
		// user found
		await page.route("**/auth/me", (r) => {
			return r.fulfill(response(204, {}));
		});

		// Visit the app
		await page.goto("/");

		// Notes component visible
		expect(page.getByRole("heading", { name: "My Notes" })).toBeVisible();
	});
});
