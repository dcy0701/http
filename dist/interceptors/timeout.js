'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (next, request) {
    return next().catch(function (error) {
        var codes = ['ECONNREFUSED', 'ECONNABORTED'];

        if (!!~codes.indexOf(error.code) || error.message === 'Network Error') {
            error = new Error('网络超时');
        }

        return _promise2.default.reject(error);
    });
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }