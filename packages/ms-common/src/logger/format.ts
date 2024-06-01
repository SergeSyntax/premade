import chalk from "chalk";
import { MorganEcsMessagePayload } from "./types";
import { TransformableInfo } from "logform";

const formatMessage = (message: unknown) => {
  if (Array.isArray(message) && !(message[0] instanceof Error))
    return message.map(formatMessage).join("\n");
  return typeof message === "object" ? JSON.stringify(message, null, 4) : message;
};

const formatTag = (message: unknown) => {
  try {
    if (Array.isArray(message)) {
      return formatMessage(message.shift());
    }

    if (typeof message === "string") {
      return formatMessage(message.split(" ").shift());
    }

    return "";
  } catch (error) {
    return "";
  }
};

enum MessageKeys {
  TIMESTAMP_KEY = "@timestamp",
  LEVEL_KEY = "log.level",
  MESSAGE_KEY = "message",
  TAG_KEY = "tag",
}

export const formatLogMessage =
  (isJSONFormat = false) =>
  ({ timestamp, level, message, stack }: TransformableInfo) => {
    // extract the tag from the message or the first message in an array
    const tag = formatTag(message);

    const messagePayload = {
      [MessageKeys.TIMESTAMP_KEY]: timestamp ?? "",
      [MessageKeys.LEVEL_KEY]: level,
      [MessageKeys.TAG_KEY]: tag,
      [MessageKeys.MESSAGE_KEY]: formatMessage(stack ?? message),
    };

    if (isJSONFormat) {
      if (timestamp) messagePayload[MessageKeys.TIMESTAMP_KEY] = timestamp;
      return JSON.stringify(messagePayload);
    }

    return `${messagePayload[MessageKeys.TIMESTAMP_KEY]}[${
      messagePayload[MessageKeys.LEVEL_KEY]
    }]: ${chalk.grey(messagePayload[MessageKeys.TAG_KEY])} ${
      messagePayload[MessageKeys.MESSAGE_KEY]
    }`;
  };

export const formatMorganMessage = (morganEcsMessage: string) => {
  const { message }: MorganEcsMessagePayload = JSON.parse(morganEcsMessage);

  return message;
};
