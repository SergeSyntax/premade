import { app } from './app';
import { PORT } from './config';
import { initMongoConnection } from './db';
import { logger } from './utils';

await initMongoConnection();
app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
