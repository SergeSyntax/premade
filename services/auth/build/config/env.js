"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_HOST = exports.MONGO_PORT = exports.MONGO_DB_NAME = exports.MONGO_PASSWORD = exports.MONGO_USERNAME = exports.JWT_SECRET = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    // services/auth/.env
    path: '.env',
});
_a = process.env, 
// common
_b = _a.NODE_ENV, 
// common
exports.NODE_ENV = _b === void 0 ? "development" /* Env.Development */ : _b, _c = _a.PORT, exports.PORT = _c === void 0 ? '3000' : _c, exports.JWT_SECRET = _a.JWT_SECRET, 
// mongodb
exports.MONGO_USERNAME = _a.MONGO_USERNAME, exports.MONGO_PASSWORD = _a.MONGO_PASSWORD, exports.MONGO_DB_NAME = _a.MONGO_DB_NAME, _d = _a.MONGO_PORT, exports.MONGO_PORT = _d === void 0 ? '27017' : _d, exports.MONGO_HOST = _a.MONGO_HOST;
