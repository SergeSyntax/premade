import { config } from 'winston';

export const enum LevelType {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  DEBUG = 'debug',
}

export const enum LogType {
  DEFAULT = 'default',
  JSON = 'json',
}

export const enum Env {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

export const levels = Object.freeze<config.AbstractConfigSetLevels>({
  [LevelType.ERROR]: 0,
  [LevelType.WARN]: 1,
  [LevelType.INFO]: 2,
  [LevelType.HTTP]: 3,
  [LevelType.DEBUG]: 5,
});

export const colors = Object.freeze<config.AbstractConfigSetColors>({
  [LevelType.ERROR]: 'red',
  [LevelType.WARN]: 'yellow',
  [LevelType.INFO]: 'green',
  [LevelType.HTTP]: 'magenta',
  [LevelType.DEBUG]: 'white',
});

export const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss:ms';
export const MB = 1048576;
export const MAX_SIZE = 5 * MB;
export const ALL_FILENAME_LOGS_PATH = 'logs/all.log';
export const ALL_FILENAME_LOGS_LEVEL = 'debug';
export const ERROR_FILENAME_LOGS_PATH = 'logs/error.log';
export const ERROR_FILENAME_LOGS_LEVEL = 'error';
export const MORGAN_TAG = 'LOGGER/MORGAN';
