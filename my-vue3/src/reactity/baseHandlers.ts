import { isObject } from "../share";
import { effectStack, track, trigger } from "./effect";
import { reactive } from "./reactive";

export const mutableHandlers = {
    get(target, key, recevier) {
        console.log('get');
        let res = Reflect.get(target, key, recevier);
        track(target, key)
        if (res.__v_isRef) {
            return res.value;
        }
        return isObject(res) ? reactive(res) : res
    },
    set(target, key, newVal, recevier) {
        console.log('set')
        let result = Reflect.set(target, key, newVal, recevier);
        trigger(target, 'set', key, newVal)
        return result
    }
}