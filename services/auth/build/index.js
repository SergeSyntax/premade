"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const utils_1 = require("./utils");
utils_1.logger.info(`Listening on port ${config_1.PORT}`);
utils_1.logger.error(new Error('test'));
