let koaBody = require('koa-body')

function timeout(time, result) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(result)
        }, time)
    })
}

module.exports = [
    koaBody(),
    function* (next) {
        this.set('Access-Control-Allow-Credentials', true)
        this.set('Access-Control-Allow-Origin', this.header.origin || this.origin)
        this.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Auth')
        this.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, HEAD, DELETE, PUT, PATCH')
        yield next
    },
    function* (next) {
        let obj, qs

        obj = {}
        qs = this.querystring.length ? this.querystring.split('&') : []

        for (let index = 0; index < qs.length; index++) {
            let [key, value] = qs[index].split('=')
            obj[key] = value
        }

        this.qs = obj

        yield next
    },
    function* (next) {
        if (this.path === '/get') {
            this.body = this.qs
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/head') {
            this.body = this.qs
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/delete') {
            this.body = this.qs
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/post') {
            this.body = this.request.body
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/put') {
            this.body = this.request.body
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/patch') {
            this.body = this.request.body
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/timestamp') {
            if (this.method === 'GET') {
                this.body = this.qs
            } else {
                this.body = Object.assign({}, this.qs, this.request.body)
            }
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/timeout') {
            this.body = yield timeout(1000)
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/repeat') {
            this.body = this.request.body
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/4xx') {
            this.status = 404
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/5xx') {
            this.status = 504
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/loading') {
            this.body = yield timeout(500)
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/headers') {
            this.body = this.headers.auth
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/interceptors') {
            this.body = this.qs
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/interceptorsError') {
            this.body = this.qs
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === '/cancelGetToken') {
            this.body = yield timeout(500)
        } else {
            yield next
        }
    },
    function* (next) {
        if (this.path === 'cancelPostToken') {
            this.body = yield timeout(500)
        } else {
            yield next
        }
    }
]