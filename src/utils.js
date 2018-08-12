export function noop() {}

export function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]'
}

export function getRequestId(method, url, data) {
    if (typeof FormData === 'function' && data instanceof FormData) {
        data = formDataToPlainObject(data)
    }

    return `${method.toLowerCase()}${url}${data ? JSON.stringify(data) : ''}`
}

export function compose(context, middleware, payload) {
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
                return Promise.resolve(fn.call(context, dispatch.bind(null, i + 1), payload))
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

function formDataToPlainObject(formData, object = {}) {
    formData.forEach((value, key) => { object[key] = value })
    return object
}