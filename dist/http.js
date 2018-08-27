'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OPTIONS = {
    root: '',
    headers: {},
    delay: 3000,
    abort: true,
    error: _utils.noop,
    loading: _utils.noop,
    timeout: 20000,
    timestamp: false,
    credentials: false
};

var Http = function () {
    function Http() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var router = _ref.router,
            options = (0, _objectWithoutProperties3.default)(_ref, ['router']);
        (0, _classCallCheck3.default)(this, Http);

        this.queue = [];
        this.middleware = [];
        this.http = _axios2.default.create();
        this.options = (0, _assign2.default)({}, OPTIONS, options);

        this.routerChange(router);
        this.mountedHttpMethod(this.options);
    }

    (0, _createClass3.default)(Http, [{
        key: 'use',
        value: function use(fn) {
            this.middleware.push(fn);
            return this;
        }
    }, {
        key: 'mountedHttpMethod',
        value: function mountedHttpMethod(opts) {
            var _this = this;

            var METHODS = ['delete', 'get', 'head', 'post', 'put', 'patch'];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var method = _step.value;

                    _this[method] = function () {
                        var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
                        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                        return new _promise2.default(function (resolve, reject) {
                            var request = (0, _utils.getRequest)(url, method, data, options = (0, _assign2.default)({}, opts, options));

                            _this.queue = [].concat((0, _toConsumableArray3.default)(_this.queue), [request]);

                            (0, _utils.compose)(_this, _this.middleware, request)(function (next, request) {
                                if (/^(post|put|patch)$/.test(request.method)) {
                                    return _this.http[request.method](request.url, request.data, request.options);
                                }

                                if (/^(get|head|delete)$/.test(request.method)) {
                                    return _this.http[request.method](request.url, request.data ? (0, _assign2.default)({}, { params: request.data }, request.options) : request.options);
                                }
                            }).then(function (result) {
                                _this.queue = _this.queue.filter(function (item) {
                                    return item.id !== request.id;
                                });

                                resolve(result);
                            }).catch(function (error) {
                                _this.queue = _this.queue.filter(function (item) {
                                    return item.id !== request.id;
                                });

                                if ((0, _utils.isError)(error)) {
                                    if (_utils.isServer || !(0, _utils.isFunction)(options.error)) {
                                        return reject(wrap(error, request));
                                    } else {
                                        options.error(wrap(error, request));
                                    }
                                }
                            });
                        });
                    };
                };

                for (var _iterator = (0, _getIterator3.default)(METHODS), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'routerChange',
        value: function routerChange(router) {
            var _this2 = this;

            if (router && !_utils.isServer) {
                router.beforeEach(function (to, from, next) {
                    _this2.queue.filter(function (item) {
                        return item.options.abort;
                    }).forEach(function (item) {
                        return item.source.cancel();
                    });
                    next();
                });
            }
        }
    }]);
    return Http;
}();

exports.default = Http;


function wrap(error, request) {
    return new _utils.RequestFailedError({
        time: new Date(),
        url: request.url,
        data: request.data,
        method: request.method,
        message: error.message,
        options: request.options
    });
}