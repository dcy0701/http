export default function (next, payload) {
    payload.options.timerId = setTimeout(() => payload.options.loading(true), payload.options.delay)

    return next().then((data) => {
        payload.options.loading(false)
        clearTimeout(payload.options.timerId)
        return Promise.resolve(data)
    }).catch((error) => {
        payload.options.loading(false)
        clearTimeout(payload.options.timerId)
        return Promise.reject(error)
    })
}