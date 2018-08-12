import Http from './http'
import { error, abort, status, repeat, loading, timeout, timestamp } from './interceptors'

export default function(Vue, { interceptors, ...opts } = {}) {    
    const http = new Http(opts)

    http.use(error)
    http.use(repeat)
    http.use(abort)
    http.use(status)
    http.use(timeout)
    http.use(loading)
    http.use(timestamp)

    if (interceptors && Array.isArray(interceptors)) {
        interceptors.forEach(interceptor => http.use(interceptor))
    }

    Vue.http = http
    Vue.prototype.$http = http
}