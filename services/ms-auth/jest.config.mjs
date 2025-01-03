import jestCommonConfig from "@media-premade/ms-common/jest.config.mjs"

/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {...jestCommonConfig,
    // A path to a module which exports an async function that is triggered once before all test suites
    globalSetup: '<rootDir>/jest.setup.js',

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
