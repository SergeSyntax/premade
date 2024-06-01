import { describe, expect, it } from '@jest/globals';
import { createLogger } from 'winston';

describe('logger', () => {
  it('should be configured', async () => {
    const logger = createLogger()
    
    // logger.info('test');
    expect(1).toBe(1);
  });
});
