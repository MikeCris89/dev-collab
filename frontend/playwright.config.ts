import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	use: {
		baseURL: "http://localhost:5173",
		headless: true,
	},
	webServer: [
		{
			command: "npm --prefix ../backend run dev",
			url: "http://localhost:4001/health",
			reuseExistingServer: true,
		},
		{
			command: "npm run dev",
			url: "http://localhost:5173",
			reuseExistingServer: true,
		},
	],
});
