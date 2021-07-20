// 判断是否是只读属性，只读的属性set时会报错
// 是否为深度的
import { extend, isObject } from "@vue/shared";
import { reactive, readonly } from "./reactive";

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        // proxy + Reflect 配套
        const res = Reflect.get(target, key, receiver) //等价于 target[key]
        if (!isReadonly) {
            //此属性是可修改的，所以要做依赖收集
            console.log('执行effect会取值然后依赖收集');
            
        }
        if (shallow) {
            // 如果不是深度的，直接返回结果
            return res
        }
        if (isObject(res)) { //vue2是一上来就递归，vue3是当取值的时候才进行代理，代理模式是懒代理
            return isReadonly ? readonly(res) : reactive(res)
        }
        return res
    }
}
function createSetter(shallow = false) {
    return function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver)//等价于 target[key]=value
        return result
    }
}

const get = createGetter();
const shallowReactiveGet = createGetter(false, true);
const readonlyGet = createGetter(true, false);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter()
const shallowSet = createSetter(true)

export const mutableHandlers = {
    get,
    set
}
export const shallowReactiveHandlers = {
    get: shallowReactiveGet,
    set: shallowSet
}
let readonlySetter = {
    set: (target, key) => {
        console.warn(`set ${target} on key ${key} failed`);
    }
}
export const readonlyHandlers = extend({
    get: readonlyGet,
}, readonlySetter)
export const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet,
}, readonlySetter)