import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importXPlugin from "eslint-plugin-import-x";
import jestPlugin from "eslint-plugin-jest";
import nodePlugin from "eslint-plugin-n";
import * as regexpPlugin from "eslint-plugin-regexp";
import pluginSecurity from "eslint-plugin-security";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginYml from "eslint-plugin-yml";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

// https://www.youtube.com/watch?v=MvnTwjAjhic
// https://github.com/michey85/react-starter/blob/master/eslint.config.js
/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...typescriptEslint.configs.recommended,
  ...typescriptEslint.configs.stylistic,
  // https://www.npmjs.com/package/eslint-plugin-security
  { ...pluginSecurity.configs.recommended },
  // https://github.com/ota-meshi/eslint-plugin-yml
  ...eslintPluginYml.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    ignores: ["build", "*.test.ts", "*.spec.ts"],
    // https://github.com/eslint/eslint/issues/18391
    plugins: {
      // https://www.npmjs.com/package/eslint-plugin-import-x
      "import-x": importXPlugin.configs["typescript"],
      // https://www.npmjs.com/package/eslint-plugin-n
      node: nodePlugin.configs["flat/recommended-module"],
      // https://www.npmjs.com/package/eslint-plugin-regexp
      regexp: regexpPlugin.configs["flat/recommended"],
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }, // Ignore vars and args starting with `_`
      ],
    },
  },
  {
    files: [".ts"],
  },
  {
    files: ["*.test.ts", "*.spec.ts"],
    // https://www.npmjs.com/package/eslint-plugin-jest
    plugins: {
      jest: jestPlugin.configs["flat/recommended"],
    },
  },
];
