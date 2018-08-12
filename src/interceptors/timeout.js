export default function (next, payload) {
    return next().catch((error) => {
        const codes = ['ECONNREFUSED', 'ECONNABORTED']

        if (!!~codes.indexOf(error.code) || error.message === 'Network Error') {
            error = new Error('网络超时')
        }

        return Promise.reject(error)
    })
}