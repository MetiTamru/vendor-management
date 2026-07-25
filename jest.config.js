/** @type {import('jest').Config} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	setupFiles: ["<rootDir>/jest.env.ts"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	moduleNameMapper: {
		"^@/env$": "<rootDir>/src/__mocks__/env.ts",
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	modulePathIgnorePatterns: ["<rootDir>/.next/"],
	testPathIgnorePatterns: [
		"<rootDir>/.next/",
		"<rootDir>/node_modules/",
		"<rootDir>/e2e/",
	],
	transformIgnorePatterns: ["/node_modules/(?!(jose|next-intl|use-intl)/)"],
};
