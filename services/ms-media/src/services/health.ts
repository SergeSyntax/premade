import mongoose from 'mongoose';

import { logger } from '../utils';

export const mongoConnectionCheck = async() => {
  try {
    return mongoose.connection.db.admin().ping()
  } catch (err) {
    logger.error('mongo connection check failed')
    throw err
  }
}
