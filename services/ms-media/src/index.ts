import { logger } from '@devops-premade/ms-common/src/logger';

import { app } from './app';
import { PORT } from './config';
import { initMongoConnection } from './db';

await initMongoConnection();
app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
