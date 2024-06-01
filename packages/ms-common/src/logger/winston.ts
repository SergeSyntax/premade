import winston from "winston";
import { ALL_LOGS_TRANSPORTER, ERROR_LOGS_TRANSPORTER, TIMESTAMP_FORMAT, colors, levels } from "./config";
import { LevelType } from "../types";
import { formatLogMessage } from "./format";

const { File, Console } = winston.transports;
const { printf, colorize, combine, timestamp } = winston.format;

const timestampFormat = timestamp({ format: TIMESTAMP_FORMAT });

export const createWinstonLogger = ({
  level = LevelType.DEBUG,
  createLogFile = false,
  isJSONFormat = false,
}) => {
  const printFormat = printf(formatLogMessage(isJSONFormat));
  const format = isJSONFormat
    ? combine(timestampFormat, printFormat)
    : combine(colorize({ level: true }), printFormat);

  const consoleTransport = new Console({
    level,
    format,
  });

  const fileFormat = combine(timestampFormat, printFormat)
  const fileTransporters = createLogFile
    ? [
        new File({
          format: fileFormat,
          ...ALL_LOGS_TRANSPORTER,
        }),
        new File({
          format: fileFormat,
          ...ERROR_LOGS_TRANSPORTER,
        }),
      ]
    : [];

  winston.addColors(colors);

  const createWinstonLogger = winston.createLogger({
    levels,
    format: winston.format.errors({ stack: true }),
    transports: [consoleTransport, ...fileTransporters],
  });

  return createWinstonLogger
};
