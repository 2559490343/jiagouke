export function patch(oldVnode, vnode) {
    const isRealElement = oldVnode.nodeType;
    if (isRealElement) {
        // 初次渲染
        const oldElm = oldVnode;
        const parentElm = oldElm.parentNode;
        let el = createElm(vnode);
        parentElm.insertBefore(el, oldElm.nextSibling)
        parentElm.removeChild(oldElm);
        return el
    } else {
        // diff算法
    }

}
function createElm(vnode) {//根据虚拟节点创建真实节点
    let { tag, children, key, data, text, vm } = vnode;
    if (typeof tag === 'string') {
        // 这里也可能是一个自定义组件
        vnode.el = document.createElement(tag)
        updateProperties(vnode);
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el;
}
function updateProperties(vnode) {
    let newProps = vnode.data || {}
    let el = vnode.el;
    for (const key in newProps) {
        if (key == 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key === 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key]);
        }
    }
}