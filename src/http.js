import axios from 'axios'
import { noop, isFunction, compose, getRequestId, RequestFailedError } from './utils'

const OPTIONS = {
    root: '',
    headers: {},
    delay: 3000,
    abort: true,
    error: noop,
    loading: noop,
    timeout: 20000,
    isServer: false,
    timestamp: false,
    credentials: false
}

export default class Http {
    TOKENS = {}
    PENDING = []
    options = {}
    middleware = []
    http = axios.create()
    constructor({ router, ...options } = {}) {
        this.mountedHttpMethod(this.options = Object.assign({}, OPTIONS, options))
        this.routerChange(router, this.options.isServer)
    }
    use(fn) {
        this.middleware.push(fn)
        return this
    }
    mountedHttpMethod(opts) {
        const METHODS = ['delete', 'get', 'head', 'post', 'put', 'patch']

        for (let method of METHODS) {
            this[method] = (url = '', data = {}, options = {}) => {
                options = Object.assign({}, opts, options)
                options.withCredentials = options.credentials

                if (isFunction(options.headers)) {
                    options.headers = options.headers()
                }

                return new Promise((resolve, reject) => {
                    url = `${options.root}${url}`

                    compose(this, this.middleware, {
                        url,
                        data,
                        method,
                        options,
                        requestId: getRequestId(method, url, data)
                    })((next, payload) => {
                        if (/^(post|put|patch)$/.test(payload.method)) {
                            return this.http[payload.method](payload.url, payload.data, payload.options)
                        }
                        
                        if (/^(get|head|delete)$/.test(payload.method)) {
                            return this.http[payload.method](payload.url, payload.data ? Object.assign({}, { params: payload.data }, payload.options) : payload.options)
                        }
                    }).then((result) => resolve(result)).catch((error) => {
                        if (error) {
                            if (options.isServer || !isFunction(options.error)) {
                                return reject(error)
                            } else {
                                options.error(error)
                            }
                        }
                    })
                })
            }
        }
    }
    routerChange(router, isServer) {
        if (router && !isServer) {
            router.beforeEach((to, from, next) => {
                Object.keys(this.TOKENS).forEach((key) => {
                    this.TOKENS[key].cancel()
                    this.PENDING.splice(this.PENDING.indexOf(key), 1)
                })
                
                next()
            })
        }
    }
}