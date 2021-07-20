
export function effect(fn, options: any = {}) {
    // 让这个effect变成响应式的effect，可以做到数据变化时重新执行
    const effect = createReactiveEffect(fn, options)
    if (!options.lazy) {
        // 响应式的effect会默认先执行一次
        effect();
    }
    return effect
}
let uid = 0 //effect的标识
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        fn()
    }
    effect.id = uid++; //创建effect的标识用来区分effect
    effect._isEffect = true;//用于标识这个是响应式effect
    effect.raw = fn; //保留对应的原函数fn
    effect.options = options; //在effect上保留用户的属性
    return effect
}