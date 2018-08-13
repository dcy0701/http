import axios from 'axios'

export function noop() {}

export function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]'
}

export function getRequest(url, method, data, options) {
    const source = axios.CancelToken.source()

    url = `${options.root}${url}`
    options.withCredentials = options.credentials

    if (isFunction(options.headers)) {
        options.headers = options.headers()
    }

    options.cancelToken = source.token

    return {
        url,
        data,
        method,
        source,
        options,        
        id: getRequestId(url, method, data)
    }
}

export function compose(context, middleware, request) {
    return function (next) {
        let index = -1
        return dispatch(0)
        function dispatch (i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))
            index = i
            let fn = middleware[i]
            if (i === middleware.length) fn = next
            if (!fn) return Promise.resolve()
            try {
                return Promise.resolve(fn.call(context, dispatch.bind(null, i + 1), request))
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}

export class RequestFailedError extends Error {
    constructor(opts) {
        super()
        
        this.url = opts.url
        this.data = opts.data
        this.time = opts.time
        this.method = opts.method
        this.options = opts.options
        this.message = opts.message
        this.name = 'Request failed'

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

function getRequestId(url, method, data) {
    if (typeof FormData === 'function' && data instanceof FormData) {
        data = formDataToPlainObject(data)
    }

    return `${method.toLowerCase()}${url}${data ? JSON.stringify(data) : ''}`
}

function formDataToPlainObject(formData, object = {}) {
    formData.forEach((value, key) => { object[key] = value })
    return object
}