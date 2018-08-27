'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RequestFailedError = exports.isServer = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.noop = noop;
exports.isError = isError;
exports.isFunction = isFunction;
exports.getRequest = getRequest;
exports.compose = compose;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop() {}

var isServer = exports.isServer = typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]';

function isError(err) {
    return Object.prototype.toString.call(err).indexOf('Error') > -1;
}

function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]';
}

function getRequest(url, method, data, options) {
    var source = _axios2.default.CancelToken.source();

    url = '' + options.root + url;
    options.cancelToken = source.token;
    options.headers = toObject(options.headers);
    options.withCredentials = options.credentials;

    return {
        url: url,
        data: data,
        method: method,
        source: source,
        options: options,
        id: getRequestId(url, method, data)
    };
}

function compose(context, middleware, request) {
    return function (next) {
        var index = -1;
        return dispatch(0);
        function dispatch(i) {
            if (i <= index) return _promise2.default.reject(new Error('next() called multiple times'));
            index = i;
            var fn = middleware[i];
            if (i === middleware.length) fn = next;
            if (!fn) return _promise2.default.resolve();
            try {
                return _promise2.default.resolve(fn.call(context, dispatch.bind(null, i + 1), request));
            } catch (err) {
                return _promise2.default.reject(err);
            }
        }
    };
}

var RequestFailedError = exports.RequestFailedError = function (_Error) {
    (0, _inherits3.default)(RequestFailedError, _Error);

    function RequestFailedError(opts) {
        (0, _classCallCheck3.default)(this, RequestFailedError);

        var _this = (0, _possibleConstructorReturn3.default)(this, (RequestFailedError.__proto__ || (0, _getPrototypeOf2.default)(RequestFailedError)).call(this));

        _this.url = opts.url;
        _this.data = opts.data;
        _this.time = opts.time;
        _this.method = opts.method;
        _this.options = opts.options;
        _this.message = opts.message;
        _this.name = 'Request failed';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, _this.constructor);
        }
        return _this;
    }

    return RequestFailedError;
}(Error);

function toObject(obj) {
    return isFunction(obj) ? obj() : obj;
}

function getRequestId(url, method, data) {
    if (typeof FormData === 'function' && data instanceof FormData) {
        data = formDataToPlainObject(data);
    }

    return '' + method.toLowerCase() + url + (data ? (0, _stringify2.default)(data) : '');
}

function formDataToPlainObject(formData) {
    var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    formData.forEach(function (value, key) {
        object[key] = value;
    });
    return object;
}