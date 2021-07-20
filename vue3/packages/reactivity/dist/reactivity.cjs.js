'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isObject = (val) => typeof val == 'object' && val !== null;
const extend = Object.assign;

// 判断是否是只读属性，只读的属性set时会报错
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        // proxy + Reflect 配套
        const res = Reflect.get(target, key, receiver); //等价于 target[key]
        if (!isReadonly) {
            //此属性是可修改的，所以要做依赖收集
            console.log('执行effect会取值然后依赖收集');
        }
        if (shallow) {
            // 如果不是深度的，直接返回结果
            return res;
        }
        if (isObject(res)) { //vue2是一上来就递归，vue3是当取值的时候才进行代理，代理模式是懒代理
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter(shallow = false) {
    return function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver); //等价于 target[key]=value
        return result;
    };
}
const get = createGetter();
const shallowReactiveGet = createGetter(false, true);
const readonlyGet = createGetter(true, false);
const shallowReadonlyGet = createGetter(true, true);
const set = createSetter();
const shallowSet = createSetter(true);
const mutableHandlers = {
    get,
    set
};
const shallowReactiveHandlers = {
    get: shallowReactiveGet,
    set: shallowSet
};
let readonlySetter = {
    set: (target, key) => {
        console.warn(`set ${target} on key ${key} failed`);
    }
};
const readonlyHandlers = extend({
    get: readonlyGet,
}, readonlySetter);
const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet,
}, readonlySetter);

function reactive(target) {
    return createReactiveObject(target, false, mutableHandlers);
}
function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers);
}
function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers);
}
function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers);
}
const reactiveMap = new WeakMap(); //会自动垃圾回收，不会造成内存泄漏，存储的key只能为对象
const readonlyMap = new WeakMap();
// 四个函数分为两类 是否只读、是否深度   可以采用柯里化
function createReactiveObject(target, isReadonly, baseHandlers) {
    // proxy只代理对象类型的值
    if (!isObject(target))
        return target;
    // 如果此对象已经被代理了，就不要再次代理了 可能一个对象既被深度代理了 又被只读代理了
    const proxyMap = isReadonly ? readonlyMap : reactiveMap;
    //查找是否已经代理过了，如果代理过直接返回代理对象
    const exisitProxy = proxyMap.get(target);
    if (exisitProxy)
        return exisitProxy;
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy); //将要代理的对象和代理后的结果对象缓存起来
    return proxy;
}

function effect(fn, options = {}) {
    // 让这个effect变成响应式的effect，可以做到数据变化时重新执行
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        // 响应式的effect会默认先执行一次
        effect();
    }
    return effect;
}
let uid = 0; //effect的标识
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        fn();
    };
    effect.id = uid++; //创建effect的标识用来区分effect
    effect._isEffect = true; //用于标识这个是响应式effect
    effect.raw = fn; //保留对应的原函数fn
    effect.options = options; //在effect上保留用户的属性
    return effect;
}

exports.effect = effect;
exports.reactive = reactive;
exports.readonly = readonly;
exports.shallowReactive = shallowReactive;
exports.shallowReadonly = shallowReadonly;
//# sourceMappingURL=reactivity.cjs.js.map
