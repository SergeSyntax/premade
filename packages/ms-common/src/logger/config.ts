import winston, { config } from "winston";

import { LevelType } from "../enums";

export const levels = Object.freeze<config.AbstractConfigSetLevels>({
  [LevelType.ERROR]: 0,
  [LevelType.WARN]: 1,
  [LevelType.INFO]: 2,
  [LevelType.HTTP]: 3,
  [LevelType.DEBUG]: 5,
});

export const colors = Object.freeze<config.AbstractConfigSetColors>({
  [LevelType.ERROR]: "red",
  [LevelType.WARN]: "yellow",
  [LevelType.INFO]: "green",
  [LevelType.HTTP]: "magenta",
  [LevelType.DEBUG]: "white",
});

export const TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss:ms";
export const MB = 1048576;

export const ALL_LOGS_TRANSPORTER = Object.freeze<winston.transports.FileTransportOptions>({
  maxsize: 5 * MB,
  filename: "logs/all.log",
  level: LevelType.DEBUG,
});

export const ERROR_LOGS_TRANSPORTER = Object.freeze<winston.transports.FileTransportOptions>({
  maxsize: 5 * MB,
  filename: "logs/error.log",
  level: LevelType.ERROR,
});

export const MORGAN_TAG = "LOGGER/MORGAN";
