import { PluginFunction } from 'vue';
import './vue'
export type MethodFunction = (url: string, data?: { [key: string]: any }, options?: MethodOptions) => Promise<any>
export interface HttpMethods {
    get: MethodFunction
    put: MethodFunction
    post: MethodFunction
    head: MethodFunction
    patch: MethodFunction
    delete: MethodFunction
}

export interface MethodOptions {
    root: string,
    headers: {[key: string]: any},
    delay: number,
    abort: boolean,
    error: boolean,
    loading: (bool: boolean) => void,
    timeout: number,
    timestamp: boolean,
    credentials: boolean
}
export interface Interceptor{
    [index: number]: (next: Promise<any>, request: any) => void
}
export interface InitOptions extends MethodOptions, Interceptor{}
export default interface http {
    install: PluginFunction<{InitOptions}>
}
