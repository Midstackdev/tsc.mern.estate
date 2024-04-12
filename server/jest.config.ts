import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  collectCoverage: false,
  collectCoverageFrom: ["<rootDir>/src/app/**/*.ts"],
  roots: ["<rootDir>/src"],
};

export default config;
