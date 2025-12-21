import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".vue"],
        sourceType: "module",
      },
    },
    rules: {
      // Règles d"indentation
      "indent": ["error", "tab", { SwitchCase: 1 }],
      "function-paren-newline": ["error", "consistent"],
      "no-multi-spaces": ["error", { ignoreEOLComments: true }],
      "vue/html-indent": ["error", "tab"],
      "vue/script-indent": ["error", "tab", { baseIndent: 0, switchCase: 1 }],

      // Règles Vue personnalisées
      "vue/multi-word-component-names": "warn",
      "vue/no-unused-vars": "error",
      "vue/max-attributes-per-line": ["warn", {
        singleline: 5,
        multiline: 1
      }],

      // Règles TypeScript personnalisées
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],

      // Non nécessaire avec l"utilisation de typescript
      "no-undef": "off",

      // Désactivé car trop strict avec les composants Vue
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".vue"],
      },
    },
  },
  {
    ignores: ["dist", "node_modules", ".gitignore", "public", "*.config.js", "*.config.ts"],
  }
];