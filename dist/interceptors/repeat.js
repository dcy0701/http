'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (next, request) {
    if (this.queue.filter(function (item) {
        return item.id === request.id;
    }).length === 1) {
        return next();
    } else {
        return _promise2.default.reject(new Error('请勿重复操作'));
    }
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }