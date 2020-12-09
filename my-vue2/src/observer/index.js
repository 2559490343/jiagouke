import { arrayMethods } from "./array"
import Dep from "./dep";


class Observer {
    constructor(value) {
        this.dep = new Dep()
        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false, // 不能被枚举表示 不能被循环
            configurable: false,// 不能删除此属性
        })
        // console.log(value);
        if (Array.isArray(value)) {
            Object.setPrototypeOf(value, arrayMethods);
            this.observerArray(value)
        } else {
            this.walk(value)
        }
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
    observerArray(data) {
        for (const item of data) {
            observer(item)
        }
    }
}

function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
        let current = value[i];
        current.__ob__ && current.__ob__.dep.depend(); // 让里层的和外层收集的都是同一个watcher
        if (Array.isArray(current)) {
            dependArray(current);
        }
    }
}
export function defineReactive(data, key, value) {
    let childOb = observer(value); // 对结果递归拦截
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get() {
            if (Dep.target) {
                dep.depend();
                if (childOb) { // 如果对数组取值 会将当前的watcher和数组进行关联
                    childOb.dep.depend();
                    if (Array.isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return value
        },
        set(newVal) {
            if (newVal === value) return
            observer(newVal)
            value = newVal;
            dep.notify()
        }
    })
}

export function observer(data) {
    if (typeof data !== 'object' || data === null) return
    if (data.__ob__) return
    return new Observer(data)
}