import { logger } from '@devops-premade/ms-common/src/logger';
import mongoose from 'mongoose';

export const mongoConnectionCheck = async() => {
  try {
    return mongoose.connection.db.admin().ping()
  } catch (err) {
    logger.error('mongo connection check failed')
    throw err
  }
}
