"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const api_error_1 = require("../utils/api-error");
const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof api_error_1.ApiError) {
        res.status(err.statusCode).json({
            errorCode: err.errorCode,
            message: err.message,
        });
        return;
    }
    console.error('Unhandled error:', err);
    res.status(500).json({
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.',
    });
};
exports.globalErrorHandler = globalErrorHandler;
