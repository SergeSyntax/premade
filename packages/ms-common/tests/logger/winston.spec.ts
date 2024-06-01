import { describe, expect, it } from '@jest/globals';
import { createWinstonLogger } from '../../src/logger/winston';

describe('createWinstonLogger', () => {
  it('should not throw an error when invoked with no arguments', () => {
    expect(() => {
      createWinstonLogger({});
    }).not.toThrow();
  });
});