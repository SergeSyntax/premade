export const mockLocalStack = `
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
`;

export const mockServiceStack = `
Error
    at getTag (file:///home/sergway/workspace/premade/packages/ms-common/build/logger/helpers.js:12:26)
    at Proxy.<anonymous> (file:///home/sergway/workspace/premade/packages/ms-common/build/logger/index.js:15:46)
    at Server.<anonymous> (file:///home/sergway/workspace/premade/services/auth/src/index.ts:5:31)
    at Object.onceWrapper (node:events:633:28)
    at Server.emit (node:events:531:35)
    at emitListeningNT (node:net:1932:10)
    at process.processTicksAndRejections (node:internal/process/task_queues:81:21)
`;
