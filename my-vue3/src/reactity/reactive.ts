import { isObject } from "../share"
import { mutableHandlers } from "./baseHandlers"

export const reactive = (target: any) => {
    return createProxyObj(target, mutableHandlers)
}
const weekmap = new WeakMap()
const createProxyObj = (target: any, handler: object) => {
    if (!isObject(target)) return target;
    const exitProxy = weekmap.get(target)
    if (exitProxy) {
        return exitProxy
    }
    const proxy = new Proxy(target, handler)
    weekmap.set(target, proxy)
    return proxy
}