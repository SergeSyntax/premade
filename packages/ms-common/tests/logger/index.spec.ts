import { describe, expect, it } from '@jest/globals';

import { logger } from '../../src/logger';

describe('Logger', () => {
  it('should not throw an error when debug is invoked with no arguments', () => {
    expect(() => {
      logger.debug();
    }).not.toThrow();
  });
});
