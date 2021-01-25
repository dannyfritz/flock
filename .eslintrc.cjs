// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
  },
  extends: ["standard-with-typescript"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    project: "./tsconfig.json",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint"
  ],
  root: true,
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    "@typescript-eslint/quotes": ["error", "double"],
  },
};
