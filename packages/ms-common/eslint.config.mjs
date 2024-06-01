import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

// https://www.youtube.com/watch?v=MvnTwjAjhic
// https://github.com/michey85/react-starter/blob/master/eslint.config.js
/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  eslintConfigPrettier,
  {
    ignores: ["build"],
  },
];
