export default function(next, request) {
    return next().catch((error) => {
        if (/\d{3}/g.test(error.message)) {
            const status = Number(error.message.match(/\d{3}/g)[0])

            if (400 <= status && status < 500) { error = new Error('请求资源不存在') }
            if (500 <= status && status < 600) { error = new Error('服务器繁忙，请稍后再试') }
        }

        return Promise.reject(error)
    })
}