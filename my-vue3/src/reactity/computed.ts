import { isFunction } from "../share";
import { effect, track, trigger } from "./effect";
class ComputedRefImpl {
    public setter
    public effect
    public _dirty = true
    public _value
    public readonly __v_isRef = true
    constructor(getter, setter) {
        this.setter = setter
        this.effect = effect(getter, {
            lazy: true,
            scheduler: () => {
                this._dirty = true;
                trigger(this, 'set', 'value')
            }
        })
    }
    get value() {
        if (this._dirty) {
            this._value = this.effect();
            track(this, 'value')
            this._dirty = false
        }
        return this._value
    }
    set value(newVal) {
        this.setter(newVal)
    }

}

export function computed(options) {
    let getter, setter
    if (isFunction(options)) {
        getter = options;
        setter = () => {
            console.log('computed  not set value');
        }
    } else {
        getter = options.get
        setter = options.set
    }
    return new ComputedRefImpl(getter, setter)
}