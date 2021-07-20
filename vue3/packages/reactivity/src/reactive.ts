import { isObject } from "@vue/shared"
import {
    mutableHandlers,
    readonlyHandlers,
    shallowReactiveHandlers,
    shallowReadonlyHandlers
} from "./baseHanlders"

export function reactive(target) {
    return createReactiveObject(target, false, mutableHandlers)
}
export function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers)
}
export function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers)
}
export function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers)
}

const reactiveMap = new WeakMap();//会自动垃圾回收，不会造成内存泄漏，存储的key只能为对象
const readonlyMap = new WeakMap()

// 四个函数分为两类 是否只读、是否深度   可以采用柯里化
export function createReactiveObject(target, isReadonly, baseHandlers) {
    // proxy只代理对象类型的值
    if (!isObject(target)) return target
    // 如果此对象已经被代理了，就不要再次代理了 可能一个对象既被深度代理了 又被只读代理了
    const proxyMap = isReadonly ? readonlyMap : reactiveMap;
    //查找是否已经代理过了，如果代理过直接返回代理对象
    const exisitProxy = proxyMap.get(target);
    if (exisitProxy) return exisitProxy;
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy); //将要代理的对象和代理后的结果对象缓存起来
    return proxy
}