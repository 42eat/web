import globals from "globals"
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin"
import { localPlugin } from "@42eat-web/shared/eslint-plugin";
import solid from "eslint-plugin-solid"
import eslint from "@eslint/js"

export default tseslint.config(
	{
		ignores: ["eslint.config.js"]
	},
	eslint.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			globals: globals.browser,
			sourceType: "module",
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			"@stylistic": stylistic,
			"local": localPlugin,
			// solid
		},
		extends: [solid.configs["flat/typescript"]],
		rules: {
			"no-empty": ["error", { allowEmptyCatch: true }],
			"no-unassigned-vars": "off",
			"preserve-caught-error": "off",
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/indent-binary-ops": ["error", "tab"],
			"@stylistic/no-tabs": "off",
			"@stylistic/eol-last": ["error", "always"],
			"@stylistic/linebreak-style": ["error", "unix"],

			"@stylistic/lines-between-class-members": ["error", "always", { exceptAfterOverload: true, exceptAfterSingleLine: true }],
			"@stylistic/new-parens": "error",

			"@stylistic/function-call-argument-newline": ["error", "consistent"],
			"@stylistic/function-call-spacing": ["error", "never"],
			"@stylistic/function-paren-newline": ["error", "consistent"],
			"@stylistic/newline-per-chained-call": ["error", { "ignoreChainWithDepth": 3 }],
			"@stylistic/space-before-function-paren": ["error", {
				anonymous: "always",
				named: "never",
				asyncArrow: "always",
				catch: "always",
			}],
			"@stylistic/nonblock-statement-body-position": ["error", "beside"],
			"@stylistic/space-before-blocks": "error",
			"@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
			"@stylistic/arrow-parens": ["error", "always"],
			"@stylistic/arrow-spacing": "error",
			"@stylistic/block-spacing": "off",
			"local/block-spacing-better": "error",
			"@stylistic/implicit-arrow-linebreak": ["error", "beside"],

			"@stylistic/comma-dangle": ["error", "always-multiline"],
			"@stylistic/comma-spacing": ["error", { "before": false, "after": true }],
			"@stylistic/comma-style": ["error", "last"],

			"@stylistic/object-curly-newline": ["error", { "consistent": true }],
			"@stylistic/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
			"@stylistic/object-curly-spacing": ["error", "always"],
			"@stylistic/computed-property-spacing": ["error", "never"],
			"@stylistic/key-spacing": "error",
			"@stylistic/no-floating-decimal": "error",
			"@stylistic/dot-location": ["error", "object"],
			"@stylistic/no-whitespace-before-property": "error",
			"local/object-newline-key-value": "error",

			"@stylistic/array-bracket-newline": ["error", "consistent"],

			"@stylistic/jsx-curly-spacing": ["error", { "when": "never" }],
			"@stylistic/semi": ["error", "always"],
			"@stylistic/no-extra-semi": "error",
			"@stylistic/semi-style": ["error", "last"],
			"@stylistic/semi-spacing": ["error", { "before": false, "after": true }],
			"@stylistic/operator-linebreak": ["error", "before"],
			"@stylistic/quotes": ["error", "double"],
			"@stylistic/multiline-ternary": ["error", "always"],
			"@stylistic/no-floating-decimal": "error",
			"@stylistic/no-multi-spaces": "error",
			"@stylistic/no-multiple-empty-lines": ["error", { max: 2 }],
			"@stylistic/no-trailing-spaces": "error",
			"@stylistic/max-statements-per-line": ["error", { max: 2 }],
			"@stylistic/rest-spread-spacing": ["error", "never"],
			"@stylistic/semi-spacing": "error",
			"@stylistic/space-in-parens": ["error", "never"],
			"@stylistic/space-infix-ops": "error",
			"@stylistic/space-unary-ops": "error",
			"@stylistic/spaced-comment": ["error", "always"],
			"@stylistic/switch-colon-spacing": "error",
			"@stylistic/template-curly-spacing": "error",


			"@stylistic/type-annotation-spacing": "error",
			"@stylistic/type-generic-spacing": "error",
			"@stylistic/type-named-tuple-spacing": "error",
			"@stylistic/member-delimiter-style": "error",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-floating-promises": "warn",
			"@typescript-eslint/no-unsafe-argument": "warn",
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "typeLike",
					format: ["PascalCase"],
				},
			],
			"@typescript-eslint/no-unused-vars": ["error", {
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_",
			}],
			"@stylistic/jsx-wrap-multilines": ["error", {
				declaration: "ignore",
				assignment: "ignore",
				return: "ignore",
				arrow: "ignore",
				condition: "ignore",
				logical: "ignore",
				prop: "ignore",
				propertyValue: "ignore"
			}]
		},
	},
);
