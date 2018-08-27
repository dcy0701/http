'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = function (Vue) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var interceptors = _ref.interceptors,
        opts = (0, _objectWithoutProperties3.default)(_ref, ['interceptors']);

    var http = new _http2.default(opts);

    http.use(_interceptors.repeat);
    http.use(_interceptors.status);
    http.use(_interceptors.timeout);
    http.use(_interceptors.loading);
    http.use(_interceptors.timestamp);

    if (interceptors && Array.isArray(interceptors)) {
        interceptors.forEach(function (interceptor) {
            return http.use(interceptor);
        });
    }

    Vue.http = http;
    Vue.prototype.$http = http;
};

var _http = require('./http');

var _http2 = _interopRequireDefault(_http);

var _interceptors = require('./interceptors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }