export default function (next, request) {
    if (this.queue.filter((item) => item.id === request.id).length === 1) {
        return next()
    } else {
        console.error('The last request was in the pending state, not to send multiple requests')
        return Promise.reject({})
    }
}