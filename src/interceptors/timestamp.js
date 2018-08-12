export default function (next, payload) {
    if (payload.method.toUpperCase() === 'GET' && payload.options.timestamp) {
        payload.url = `${payload.url}${payload.url.indexOf('?') < 0 ? '?' : '&'}t=${Date.now()}`
    }

    return next()
}