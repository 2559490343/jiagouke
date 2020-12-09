import { createElement, createTextVnode } from "./vdom/index.js"

export function renderMixin(Vue) {
    Vue.prototype._c = function (...args) { // 创建元素的虚拟节点
        return createElement(this, ...args);
    }
    Vue.prototype._v = function (text) { // 创建文本的虚拟节点
        return createTextVnode(this, text);
    }
    Vue.prototype._s = function (val) { // 转化成字符串
        return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val
    }
    Vue.prototype._render = function () {
        const vm = this;
        let render = vm.$options.render;
        let vnode = render.call(vm)
        return vnode
    }
}