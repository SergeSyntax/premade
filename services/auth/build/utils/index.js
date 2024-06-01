"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.logHTTPRequests = void 0;
const ms_common_1 = require("@premade/ms-common");
const config_1 = require("../config");
const { logHTTPRequests, logger } = (0, ms_common_1.createLogger)({
    NODE_ENV: config_1.NODE_ENV,
    LOG_TYPE: "json" /* LogType.JSON */
});
exports.logHTTPRequests = logHTTPRequests;
exports.logger = logger;
