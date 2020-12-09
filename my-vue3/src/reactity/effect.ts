
export const effectStack = []
export const effect = (fn, options: any = {}) => {
    const effect = createReactiveEffect(fn, options)
    if (!options.lazy) {
        effect();
    }
    return effect
}
let activeEffect = null;
let id = 0;
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effectStack.includes(effect)) {
            try {
                effectStack.push(effect)
                activeEffect = effect
                return fn()
            } finally {
                effectStack.pop();
                activeEffect = effectStack[effectStack.length - 1]
            }
        }


    }
    effect.id = id++;
    effect.options = options;
    return effect
}
let targetMap = new WeakMap();
export function track(target, key) {
    if (activeEffect == undefined) {
        return
    }
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
    }

}
const run = (effects) => {
    effects.forEach(effect => {
        if (effect.options.scheduler) {
            effect.options.scheduler.call(effect);
        } else {
            effect()
        }
    })
}
export function trigger(target, type, key, value?) {
    let depsMap = targetMap.get(target)
    if (!depsMap) return
    let effects = depsMap.get(key);
    run(effects)
}