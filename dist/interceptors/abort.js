'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (next, payload) {
    var _this = this;

    if (payload.options.abort) {
        var source = CancelToken.source();

        this.TOKENS[payload.requestId] = source;
        payload.options.cancelToken = source.token;
    }

    return next().then(function (data) {
        _this.TOKENS[payload.requestId] = null;
        delete _this.TOKENS[payload.requestId];
        return _promise2.default.resolve(data);
    }).catch(function (error) {
        _this.TOKENS[payload.requestId] = null;
        delete _this.TOKENS[payload.requestId];
        return _promise2.default.reject(error);
    });
};

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CancelToken = _axios2.default.CancelToken;