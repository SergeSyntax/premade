import { PORT } from './config'
import { logger } from './utils';

logger.info(`Listening on port ${PORT}`)

logger.error(new Error('test'))