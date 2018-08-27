'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (next, request) {
    return next().catch(function (error) {
        if (/\d{3}/g.test(error.message)) {
            var status = Number(error.message.match(/\d{3}/g)[0]);

            if (400 <= status && status < 500) {
                error = new Error('请求资源不存在');
            }
            if (500 <= status && status < 600) {
                error = new Error('服务器繁忙，请稍后再试');
            }
        }

        return _promise2.default.reject(error);
    });
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }