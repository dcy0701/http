'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (next, payload) {
    return next().catch(function (error) {
        return _promise2.default.reject(error.message ? new _utils.RequestFailedError({
            time: new Date(),
            url: payload.url,
            data: payload.data,
            method: payload.method,
            message: error.message,
            options: payload.options
        }) : null);
    });
};

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }