let koaMiddlewares = require('./middlewares')
let webpackTestConfig = require('./webpack.test.conf')

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
    config.set({
        browsers: ['ChromeHeadless'],
        frameworks: ['mocha', 'promise', 'sinon', 'koa'],
        files: ['./index.js'],
        preprocessors: {
            './index.js': ['webpack', 'sourcemap']
        },
        reporters: ['spec', 'coverage'],
        coverageReporter: {
            dir: './coverage',
            reporters: [{
                type: 'text'
            }, {
                type: 'lcov',
                subdir: '.'
            }, {
                type: 'json',
                subdir: '.'
            }]
        },
        plugins: [
            'karma-koa',
            'karma-mocha',
            'karma-sinon',
            'karma-promise',
            'karma-webpack',
            'karma-coverage',
            'karma-spec-reporter',
            'karma-sourcemap-loader',
            'karma-chrome-launcher'
        ],
        koa: {
            port: 9877,
            middlewares: koaMiddlewares
        },
        webpack: webpackTestConfig,
        webpackMiddleware: {
            noInfo: true
        },
        singleRun: true
    })
}