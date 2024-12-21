import jestCommonConfig from "@devops-premade/ms-common/jest.config.mjs"

/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {...jestCommonConfig,

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
