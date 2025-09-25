"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
// utils/api-error.ts
const shared_1 = require("@meal-planner/shared");
class ApiError extends Error {
    statusCode;
    errorCode;
    constructor(code) {
        super(shared_1.ErrorMessages[code].message);
        this.statusCode = shared_1.ErrorMessages[code].statusCode;
        this.errorCode = code;
    }
}
exports.ApiError = ApiError;
