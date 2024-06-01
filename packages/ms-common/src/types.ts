import { LevelType } from "./config";
import winston from "winston";

type MessageHandler = (...unknown: unknown[]) => winston.Logger;

export interface CustomLogger extends winston.Logger {
  error: MessageHandler;
  warn: MessageHandler;
  info: MessageHandler;
  http: MessageHandler;
  debug: MessageHandler;
}

export interface MorganEcsMessagePayload {
  "@timestamp": Date;
  "log.level": LevelType;
  message: string;
  ecs: {
    version: string;
  };
  http: {
    version: "1.1";
    request: {
      method: string;
      headers: {
        host: string;
        connection: string;
        "cache-control": string;
        dnt: string;
        "upgrade-insecure-requests": string;
        "user-agent": string;
        accept: string;
        "sec-fetch-site": string;
        "sec-fetch-mode": string;
        "sec-fetch-user": string;
        "sec-fetch-dest": string;
        "accept-encoding": string;
        "accept-language": string;
        "sec-gpc": string;
      };
    };
    response: {
      status_code: number;
      headers: {
        "x-powered-by": string;
        "content-security-policy": string;
        "x-content-type-options": string;
        "content-type": string;
        "content-length": number;
      };
      body: {
        bytes: number;
      };
    };
  };
  url: {
    path: string;
    domain: string;
    full: string;
  };
  client: {
    address: string;
    ip: string;
    port: number;
  };
  user_agent: {
    original: string;
  };
}
