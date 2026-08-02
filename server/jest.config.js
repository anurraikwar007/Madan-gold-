export default {
  testEnvironment: "node",

  transform: {},

  verbose: true,

  setupFilesAfterEnv: [
    "<rootDir>/tests/setup.js"
  ],

  testMatch: [
    "**/tests/**/*.test.js"
  ]
};