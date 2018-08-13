export default function (next, request) {
    if (request.method.toUpperCase() === 'GET' && request.options.timestamp) {
        request.url = `${request.url}${request.url.indexOf('?') < 0 ? '?' : '&'}t=${Date.now()}`
    }

    return next()
}