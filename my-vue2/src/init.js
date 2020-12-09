import { compileToFunctions } from "./compiler/index";
import { mountComponent } from "./lifecycle";
import { initState } from "./state";


export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        initState(vm)
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        el = document.querySelector(el)
        const vm = this;
        const options = vm.$options;
        vm.$options.el = el;
        // 如果有render 就直接使用render
        // 没有render 看有没有template属性
        // 没有template 就接着找外部模板
        if (!options.render) {
            let template = options.template;
            if (!template && el) {
                template = el.outerHTML; // 火狐不兼容 document.createElement('div').appendChild('app').innerHTMl
            }
            // 如何将模板编译成render函数
            const render = compileToFunctions(template); // compileToFunctions
            options.render = render;
        }
        mountComponent(vm)
    }
}
