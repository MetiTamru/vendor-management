// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
	{
		ignores: [
			"src/__tests__/**",
			"src/features/**/tests/**",
			"src/__mocks__/**",
			"jest.config.js",
			"jest.env.ts",
			"jest.setup.ts",
		],
	},
	...compat.extends(
		"next/core-web-vitals",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"prettier"
	),
	...pluginQuery.configs["flat/recommended"],
	{
		files: ["**/*.ts", "**/*.tsx"],
		plugins: {
			"@typescript-eslint": tsPlugin,
			react: reactPlugin,
		},
		languageOptions: {
			globals: {
				React: "readonly",
				JSX: "readonly",
			},
			parser: tsParser,
			parserOptions: {
				project: "./tsconfig.json",
				ecmaFeatures: {
					jsx: true,
				},
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			"no-console": "warn",
			"prefer-arrow-callback": "error",
			"prefer-template": "error",
			quotes: "off",
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
			"@typescript-eslint/ban-ts-comment": [
				"error",
				{
					"ts-expect-error": "allow-with-description",
					minimumDescriptionLength: 10,
				},
			],
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/consistent-type-exports": "error",
			"@typescript-eslint/consistent-type-imports": [
				"warn",
				{
					fixStyle: "inline-type-imports",
					prefer: "type-imports",
				},
			],
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					args: "after-used",
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-empty-interface": "off",
			"@typescript-eslint/no-empty-object-type": "off",
		},
	},
];

export default eslintConfig;
