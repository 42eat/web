// @ts-check
import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config(
	{
		ignores: ["eslint.config.mjs"],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			sourceType: "commonjs",
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		plugins: {
			"@stylistic": stylistic,
		},
		rules: {
			"@stylistic/array-bracket-newline": ["error", "consistent"],
			"@stylistic/function-paren-newline": ["error", "consistent"],
			"@stylistic/object-curly-newline": ["error", {
				"consistent": true,
			}],
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-floating-promises": "warn",
			"@typescript-eslint/no-unsafe-argument": "warn",
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/no-tabs": "off",
			"@stylistic/linebreak-style": ["error", "unix"],
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "typeLike",
					format: ["PascalCase"],
				},
			],
		},
	},
);
