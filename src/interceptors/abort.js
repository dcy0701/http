import axios from 'axios'

const CancelToken = axios.CancelToken

export default function (next, payload) {
    if (payload.options.abort) {
        const source = CancelToken.source()

        this.TOKENS[payload.requestId] = source
        payload.options.cancelToken = source.token
    }
    
    return next().then((data) => {
        this.TOKENS[payload.requestId] = null
        delete this.TOKENS[payload.requestId]
        return Promise.resolve(data)
    }).catch((error) => {
        this.TOKENS[payload.requestId] = null
        delete this.TOKENS[payload.requestId]
        return Promise.reject(error)
    })
}