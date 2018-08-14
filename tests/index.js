import Vue from 'vue'
import http from '../src'
import { expect } from 'chai'
import Router from 'vue-router'

function isDate(time) {
    return new Date(parseInt(time, 10)) instanceof Date
}

describe('http', () => {
    let data, loading, error, interceptor, router

    data = { foo: 'bar' }
    error = sinon.spy()
    loading = sinon.spy()
    router = new Router()
    interceptor = sinon.spy()

    Vue.use(http, {
        error: error,
        timeout: 2000,
        timestamp: true,
        router: router,
        loading: loading,
        credentials: true,
        root: `${location.protocol}//${location.hostname}:9877`,
        interceptors: [(next, request) => {
            if (request.url.indexOf('interceptors') !== -1) {
                interceptor()
            }
            
            return next()
        }, (next, request) => {
            if (request.url.indexOf('interceptorsError') !== -1) {
                throw new Error('interceptors error')
            }

            return next()
        }]
    })

    it('get', done => {
        Vue.http.get('/get', data).then((res) => {
            expect(res.status).to.equal(200)
            expect(res.statusText).to.equal('OK')
            expect(res.data.foo).to.equal(data.foo)
            done()
        })
    })

    it('head', done => {
        Vue.http.head('/head', data).then((res) => {
            expect(res.status).to.equal(200)
            expect(res.statusText).to.equal('OK')
            done()
        })
    })

    it('delete', done => {
        Vue.http.delete('/delete', data).then((res) => {
            expect(res.status).to.equal(200)
            expect(res.statusText).to.equal('OK')
            expect(res.data.foo).to.equal(data.foo)
            done()
        })
    })

    it('post', done => {
        Vue.http.post('/post', data).then((res) => {
            expect(res.status).to.equal(200)
            expect(res.statusText).to.equal('OK')
            expect(res.data.foo).to.equal(data.foo)
            done()
        })
    })

    it('put', done => {
        Vue.http.post('/put', data).then((res) => {
            expect(res.status).to.equal(200)
            expect(res.statusText).to.equal('OK')
            expect(res.data.foo).to.equal(data.foo)
            done()
        })
    })

    it('patch', done => {
        Vue.http.post('/patch', data).then((res) => {
            expect(res.status).to.equal(200)
            expect(res.statusText).to.equal('OK')
            expect(res.data.foo).to.equal(data.foo)
            done()
        })
    })

    it('timestamp', done => {
        Promise.all([
            Vue.http.get('/timestamp', data),
            Vue.http.post('/timestamp', data)    
        ]).then(([resGet, resPost]) => {
            expect(resGet.status).to.equal(200)
            expect(resGet.statusText).to.equal('OK')
            expect(resGet.data.foo).to.equal(data.foo)
            expect(isDate(resGet.data.t)).to.equal(true)

            expect(resPost.status).to.equal(200)
            expect(resPost.statusText).to.equal('OK')
            expect(resPost.data.foo).to.equal(data.foo)
            expect(resPost.data.t).to.equal(undefined)
            done()
        })
    })

    it('timeout', done => {
        Vue.http.get('/timeout', data, {
            timeout: 500,
            error: false
        }).catch((err) => {
            expect(err.message).to.equals('网络超时')
            done()
        })
    })

    it('global error', done => {
        Vue.http.get('/timeout', data, {
            timeout: 500
        })

        setTimeout(() => {
            expect(error.callCount).to.equal(1)
            done()
        }, 700)
    })

    it('loading', done => {
        let spy = sinon.spy()

        Vue.http.get('/loading', data, {
            delay: 200,
            loading: spy
        }).then((res) => {
            expect(spy.callCount).to.equal(2)
            done()
        })
    })

    it('respone status: 4xx', (done) => {
        Vue.http.get('/4xx', null, {
            error: false
        }).catch((err) => {
            expect(err.message).to.equals('请求资源不存在')
            done()
        })
    })

    it('respone status: 5xx', (done) => {
        Vue.http.get('/5xx', null, {
            error: false
        }).catch((err) => {
            expect(err.message).to.equals('服务器繁忙，请稍后再试')
            done()
        })
    })

    it('headers', done => {
        Promise.all([
            Vue.http.get('/headers', data, {
                headers: {
                    Auth: 'test'
                }
            }),
            Vue.http.get('/headers?t=1', data, {
                headers() {
                    return { Auth: 'demo' }
                }
            })
        ]).then(([test, demo]) => {
            expect(test.status).to.equal(200)
            expect(test.data).to.equal('test')
            expect(demo.status).to.equal(200)
            expect(demo.data).to.equal('demo')
            done()
        })
    })

    it('interceptors', done => {
        Vue.http.get('/interceptors', data).then((res) => {
            expect(res.status).to.equal(200)
            expect(res.statusText).to.equal('OK')
            expect(res.data.foo).to.equal(data.foo)
            expect(interceptor.callCount).to.equal(1)
            done()
        })
    })

    it('interceptors error', done => {
        Vue.http.get('/interceptorsError', data, {
            error: false
        }).catch((err) => {
            expect(err.message).to.equals('interceptors error')
            done()
        })
    })

    it('repeat', done => {
        let formData = new FormData()

        formData.append('foo', 'bar')

        Vue.http.post('/repeat', data).then((res) => {
            expect(res.status).to.equal(200)
            expect(res.data.foo).to.equal(data.foo)
            done()
        })

        Vue.http.post('/repeat', formData)
    })

    it('router', done => {
        let formData = new FormData()

        formData.append('foo', 'bar')

        Vue.http.get('/cancelGetToken', data)
        Vue.http.post('/cancelPostToken', formData)
        router.push('/test')

        setTimeout(() => {
            done()
        }, 700)
    })
})