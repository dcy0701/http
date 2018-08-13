import { RequestFailedError} from '../utils'

export default function (next, request) {
    return next().catch((error) => {
        return Promise.reject(error.message ? new RequestFailedError({
            time: new Date(),
            url: request.url,
            data: request.data,
            method: request.method,
            message: error.message,
            options: request.options
        }) : null)
    })
}