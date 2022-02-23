module.exports = {
  pipeline: {
    build: ["^build"],
    format: [],
    "lint:eslint": [],
    "lint:prettier": [],
    "lint:tsc": [],
    "publish:check": ["build"],
    "publish:dev": ["build"],
    "publish:release": ["build"],
    "test:mocha": [],
  },
  npmClient: "pnpm",
};