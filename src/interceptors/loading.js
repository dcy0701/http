export default function (next, request) {
    request.options.timerId = setTimeout(() => request.options.loading(true), request.options.delay)

    return next().then((data) => {
        request.options.loading(false)
        clearTimeout(request.options.timerId)
        return Promise.resolve(data)
    }).catch((error) => {
        request.options.loading(false)
        clearTimeout(request.options.timerId)
        return Promise.reject(error)
    })
}