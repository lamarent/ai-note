import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: 2020,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {},
  },
];
