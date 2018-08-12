import { RequestFailedError} from '../utils'

export default function (next, payload) {
    return next().catch((error) => {
        return Promise.reject(error.message ? new RequestFailedError({
            time: new Date(),
            url: payload.url,
            data: payload.data,
            method: payload.method,
            message: error.message,
            options: payload.options
        }) : null)
    })
}