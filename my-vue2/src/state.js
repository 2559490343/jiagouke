import { observer } from "./observer/index";



export function initState(vm) {
    const options = vm.$options
    if (options.data) {
        initData(vm)
    }
}
function initData(vm) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    for (const key in data) {
        proxy(vm, '_data', key)
    }
    observer(data)
}
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newVal) {
            if (vm[source][key] === newVal) return
            vm[source][key] = newVal
        }
    })
}