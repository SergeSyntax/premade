import { describe, expect, it, jest } from '@jest/globals';
import { getTag, isLogLevelProperty, omitFilePathExtension, omitRowIndication } from '../../src/logger/helpers';

export const mockStack = `
Error: 
    at getTag (/home/sergway/workspace/premade/packages/ms-common/src/logger/helpers.ts:25:24)
    at Proxy.<anonymous> (/home/sergway/workspace/premade/packages/ms-common/src/logger/index.ts:19:36)
    at Object.<anonymous> (/home/sergway/workspace/premade/packages/ms-common/tests/logger/helpers.spec.ts:25:12)
    at Promise.then.completed (/home/sergway/workspace/premade/node_modules/.pnpm/jest-circus@29.7.0/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/sergway/workspace/premade/node_modules/.pnpm/jest-circus@29.7.0/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (/home/sergway/workspace/premade/node_modules/.pnpm/jest-circus@29.7.0/node_modules/jest-circus/build/run.js:316:40)
    at _runTest (/home/sergway/workspace/premade/node_modules/.pnpm/jest-circus@29.7.0/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (/home/sergway/workspace/premade/node_modules/.pnpm/jest-circus@29.7.0/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (/home/sergway/workspace/premade/node_modules/.pnpm/jest-circus@29.7.0/node_modules/jest-circus/build/run.js:121:9)
    at run (/home/sergway/workspace/premade/node_modules/.pnpm/jest-circus@29.7.0/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (/home/sergway/workspace/premade/node_modules/.pnpm/jest-circus@29.7.0/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (/home/sergway/workspace/premade/node_modules/.pnpm/jest-circus@29.7.0/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (/home/sergway/workspace/premade/node_modules/.pnpm/jest-runner@29.7.0/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (/home/sergway/workspace/premade/node_modules/.pnpm/jest-runner@29.7.0/node_modules/jest-runner/build/runTest.js:444:34)
`

describe('omitRowIndication', () => {
  it('should omit row indication from a term with a colon', () => {
    const term = "some/path/to/file.ts:25:12";
    const result = omitRowIndication(term);
    expect(result).toBe("some/path/to/file.ts");
  });

  it('should return the term itself if there is no colon', () => {
    const term = "some/path/to/file";
    const result = omitRowIndication(term);
    expect(result).toBe("some/path/to/file");
  });
});

describe('omitFilePathExtension', () => {
  it('should omit the file path extension', () => {
    const filePath = "some/path/to/file.ts";
    const result = omitFilePathExtension(filePath);
    expect(result).toBe("some/path/to/file");
  });

  it('should return the file path without modification if there is no extension', () => {
    const filePath = "some/path/to/file";
    const result = omitFilePathExtension(filePath);
    expect(result).toBe("some/path/to/file");
  });
});

describe('isLogLevelProperty', () => {
  it('should return true for valid log level properties', () => {
    expect(isLogLevelProperty('error')).toBe(true);
    expect(isLogLevelProperty('warn')).toBe(true);
    expect(isLogLevelProperty('info')).toBe(true);
    expect(isLogLevelProperty('http')).toBe(true);
    expect(isLogLevelProperty('debug')).toBe(true);
  });

  it('should return false for invalid log level properties', () => {
    expect(isLogLevelProperty('invalid')).toBe(false);
    expect(isLogLevelProperty(123)).toBe(false);
    expect(isLogLevelProperty({})).toBe(false);
  });
});

describe('getTag', () => {
  it('should return an empty string if no invokePath is available', () => {
    jest.spyOn(global, 'Error').mockImplementation((message?: string) => {
      return {
        stack: undefined,
        name: '',
        message
      } as Error;
    });
    const tag = getTag();
    expect(tag).toBe('');
  });

  it('should convert invocation path to relative path and return uppercase tag', () => {
    const tag = getTag(mockStack);
    expect(tag).toBe('PACKAGES/MS-COMMON/TESTS/LOGGER/HELPERS');
  });
});
