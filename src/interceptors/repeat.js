export default function (next, request) {
    if (this.queue.filter((item) => item.id === request.id).length === 1) {
        return next()
    } else {
        return Promise.reject(new Error('请勿重复操作'))
    }
}