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
			"@stylistic/object-curly-newline": ["error", { "consistent": true }],
			"@stylistic/array-bracket-newline": ["error", "consistent"],
			"@stylistic/function-paren-newline": ["error", "consistent"],
			"@stylistic/object-curly-newline": ["error", {
				"ImportDeclaration": { "consistent": true },
				"ExportDeclaration": { "consistent": true },
			}],
			"@stylistic/jsx-wrap-multilines": ["error", {
				declaration: "consistent",
				assignment: "ignore",
				return: "ignore",
				arrow: "ignore",
			}]
		},
	},
];
