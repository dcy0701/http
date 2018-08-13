import axios from 'axios'
import { noop, isFunction, compose, getRequest, RequestFailedError } from './utils'

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
    constructor({ router, ...options } = {}) {
        this.queue = []
        this.middleware = []
        this.http = axios.create()
        this.options = Object.assign({}, OPTIONS, options)

        this.mountedHttpMethod(this.options)
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
                return new Promise((resolve, reject) => {
                    const request = getRequest(url, method, data, options = Object.assign({}, opts, options))
                    
                    this.queue = [...this.queue, request]

                    compose(this, this.middleware, request)((next, request) => {
                        if (/^(post|put|patch)$/.test(request.method)) {
                            return this.http[request.method](request.url, request.data, request.options)
                        }
                        
                        if (/^(get|head|delete)$/.test(request.method)) {
                            return this.http[request.method](request.url, request.data ? Object.assign({}, { params: request.data }, request.options) : request.options)
                        }
                    }).then((result) => {
                        this.queue = this.queue.filter((item) => item.id !== request.id)
                        
                        resolve(result)
                    }).catch((error) => {
                        this.queue = this.queue.filter((item) => item.id !== request.id)

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
                this.queue.filter((item) => item.options.abort).forEach((item) => item.source.cancel())
                next()
            })
        }
    }
}