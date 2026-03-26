import * as tsParser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin"

export default [
	{
		files: ["**/*.{ts,tsx}"],
		plugins: {
			"@stylistic": stylistic
		},
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: "tsconfig.json",
			},
		},
		rules: {
			"@stylistic/jsx-wrap-multilines": ["error", {
				declaration: "ignore",
				assignment: "ignore",
				return: "ignore",
				arrow: "ignore",
			}]
		},
	},
];
