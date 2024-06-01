import { describe, expect, it } from '@jest/globals';
import { createLogger } from '../../src/logger';

describe('createLogger', () => {
  it('should not throw an error when invoked with no arguments', () => {
    expect(() => {
      createLogger({});
    }).not.toThrow();
  });
});
