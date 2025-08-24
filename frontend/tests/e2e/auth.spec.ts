import { test, expect } from "@playwright/test";
import users from "../../../fixtures/auth.json" assert { type: "json" };
import notes from "../../../fixtures/notes.json" assert { type: "json" };

const testUser = users[0];
const testNotes = notes[testUser.id];

const response = (status: number, body?: any) =>
	body === undefined
		? { status } // e.g. 204
		: {
				status,
				headers: { "content-type": "application/json" },
				body: JSON.stringify(body),
		  };

test.describe("Auth on first load", () => {
	test("No User -> Show Login", async ({ page }) => {
		await page.route("**/api/auth/me", (r) => {
			return r.fulfill(response(404, { message: "Unauthorized" }));
		});

		await page.goto("/");

		// Login component visible
		await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
	});
	test("User Found -> Show Notes", async ({ page }) => {
		await page.route("**/api/auth/me", (r) => {
			return r.fulfill(response(200, testUser));
		});
		await page.route("**/api/notes", (r) =>
			r.fulfill(response(200, testNotes))
		);

		await page.goto("/");

		// Notes component visible
		await expect(
			page.getByRole("heading", { name: /my notes/i })
		).toBeVisible();
	});
});

test.describe("Login", () => {
	test("failed login", async ({ page }) => {
		await page.route("**/api/auth/me", (r) => {
			return r.fulfill(response(401, { message: "User not logged in" }));
		});
		await page.route("**/api/auth/login", async (r) => {
			return r.fulfill(response(401, { message: "Invalid Credentials" }));
		});

		// visit app and ensure login component is present
		await page.goto("/");
		await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();

		await page.getByLabel(/username/i).fill(testUser.username);
		await page.getByLabel(/password/i).fill(testUser.password);
		await page.getByRole("button", { name: /submit/i }).click();

		// Ensure login component is visible and error element
		await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
		await expect(page.getByRole("alert")).toBeVisible();
	});
	test("successful login", async ({ page }) => {
		// await page.route("**/api/auth/me", async (r) => {
		// 	return r.fulfill(response(401, { message: "User not logged in" }));
		// });

		// await page.route("**/api/auth/login", async (r) => {
		// 	return r.fulfill(response(204));
		// });
		// await page.route("**/api/notes", (r) =>
		// 	r.fulfill(response(200, testNotes))
		// );

		let loggedIn = false;

		// /auth/login → succeed and flip state
		await page.route("**/api/auth/login", (r) => {
			loggedIn = true;
			return r.fulfill(response(204)); // no body on 204
		});

		// /auth/me → 401 before login, 200 after
		await page.route("**/api/auth/me", (r) => {
			if (!loggedIn)
				return r.fulfill(response(401, { message: "User not logged in" }));
			return r.fulfill(response(200, testUser));
		});

		// visit app and ensure login component is present
		await page.goto("/");
		await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();

		// await page.unroute("**/api/auth/me");
		// await page.route("**/api/auth/me", (r) => {
		// 	return r.fulfill(response(200, testUser));
		// });

		await page.getByLabel(/username/i).fill(testUser.username);
		await page.getByLabel(/password/i).fill(testUser.password);
		await page.getByRole("button", { name: /submit/i }).click();

		// Make sure notes component is rendered
		await expect(
			page.getByRole("heading", { name: /my notes/i })
		).toBeVisible();
	});
});
