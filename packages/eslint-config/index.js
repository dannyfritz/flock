/** @type {import("eslint").Linter.BaseConfig} */
const config = {
  extends: ["airbnb-base", "airbnb-typescript/base", "prettier"],
  parserOptions: {
    extraFileExtensions: [".cjs"],
    project: "./tsconfig.json",
  },
  rules: {
    "import/no-default-export": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["test/**", "**/*.spec.js", "**/*.spec.ts"],
      },
    ],
    "import/prefer-default-export": "off",
  },
  overrides: [
    {
      files: ["test/**", "**/*.spec.js", "**/*.spec.ts"],
      env: { mocha: true },
    },
  ],
  env: {
    browser: true,
  },
};

module.exports = config;
