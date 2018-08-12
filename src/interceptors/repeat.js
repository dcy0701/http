export default function (next, payload) {
    if (this.PENDING.indexOf(payload.requestId) === -1) {
        this.PENDING.push(payload.requestId)

        return next().then((data) => {
            this.PENDING.splice(this.PENDING.indexOf(payload.requestId), 1)
            return Promise.resolve(data)
        }).catch((error) => {
            this.PENDING.splice(this.PENDING.indexOf(payload.requestId), 1)
            return Promise.reject(error)
        })
    } else {
        console.error('The last request was in the pending state, not to send multiple requests')
        return Promise.reject({})
    }
}