(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueObserver = {}));
}(this, (function (exports) { 'use strict';

    var effectStack = [];
    var effect = function (fn, options) {
        if (options === void 0) { options = {}; }
        var effect = createReactiveEffect(fn, options);
        if (!options.lazy) {
            effect();
        }
        return effect;
    };
    var activeEffect = null;
    var id = 0;
    function createReactiveEffect(fn, options) {
        var effect = function reactiveEffect() {
            if (!effectStack.includes(effect)) {
                try {
                    effectStack.push(effect);
                    activeEffect = effect;
                    return fn();
                }
                finally {
                    effectStack.pop();
                    activeEffect = effectStack[effectStack.length - 1];
                }
            }
        };
        effect.id = id++;
        effect.options = options;
        return effect;
    }
    var targetMap = new WeakMap();
    function track(target, key) {
        if (activeEffect == undefined) {
            return;
        }
        var depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        var dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = new Set()));
        }
        if (!dep.has(activeEffect)) {
            dep.add(activeEffect);
        }
    }
    var run = function (effects) {
        effects.forEach(function (effect) {
            if (effect.options.scheduler) {
                effect.options.scheduler.call(effect);
            }
            else {
                effect();
            }
        });
    };
    function trigger(target, type, key, value) {
        var depsMap = targetMap.get(target);
        if (!depsMap)
            return;
        var effects = depsMap.get(key);
        run(effects);
    }

    var isObject = function (val) { return typeof val === 'object' && val !== null; };
    var isFunction = function (val) { return typeof val === 'function'; };

    var mutableHandlers = {
        get: function (target, key, recevier) {
            console.log('get');
            var res = Reflect.get(target, key, recevier);
            track(target, key);
            if (res.__v_isRef) {
                return res.value;
            }
            return isObject(res) ? reactive(res) : res;
        },
        set: function (target, key, newVal, recevier) {
            console.log('set');
            var result = Reflect.set(target, key, newVal, recevier);
            trigger(target, 'set', key);
            return result;
        }
    };

    var reactive = function (target) {
        return createProxyObj(target, mutableHandlers);
    };
    var weekmap = new WeakMap();
    var createProxyObj = function (target, handler) {
        if (!isObject(target))
            return target;
        var exitProxy = weekmap.get(target);
        if (exitProxy) {
            return exitProxy;
        }
        var proxy = new Proxy(target, handler);
        weekmap.set(target, proxy);
        return proxy;
    };

    var ComputedRefImpl = /** @class */ (function () {
        function ComputedRefImpl(getter, setter) {
            var _this = this;
            this._dirty = true;
            this.__v_isRef = true;
            this.setter = setter;
            this.effect = effect(getter, {
                lazy: true,
                scheduler: function () {
                    _this._dirty = true;
                    trigger(_this, 'set', 'value');
                }
            });
        }
        Object.defineProperty(ComputedRefImpl.prototype, "value", {
            get: function () {
                if (this._dirty) {
                    this._value = this.effect();
                    track(this, 'value');
                    this._dirty = false;
                }
                return this._value;
            },
            set: function (newVal) {
                this.setter(newVal);
            },
            enumerable: false,
            configurable: true
        });
        return ComputedRefImpl;
    }());
    function computed(options) {
        var getter, setter;
        if (isFunction(options)) {
            getter = options;
            setter = function () {
                console.log('computed  not set value');
            };
        }
        else {
            getter = options.get;
            setter = options.set;
        }
        return new ComputedRefImpl(getter, setter);
    }

    exports.computed = computed;
    exports.effect = effect;
    exports.reactive = reactive;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
