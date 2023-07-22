module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/?(*.)+(spec|test).+(ts|tsx|js)"],
  transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
  }
};
