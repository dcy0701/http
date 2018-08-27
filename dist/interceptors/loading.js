"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (next, request) {
    request.options.timerId = setTimeout(function () {
        return request.options.loading(true);
    }, request.options.delay);

    return next().then(function (data) {
        request.options.loading(false);
        clearTimeout(request.options.timerId);
        return _promise2.default.resolve(data);
    }).catch(function (error) {
        request.options.loading(false);
        clearTimeout(request.options.timerId);
        return _promise2.default.reject(error);
    });
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }