(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i]; // name,value

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj; // {style:{color:red}}
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ","); // {a:'aaa',a:1,b:2,}
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }

  function gen(node) {
    // 区分是元素 还是文本
    if (node.type == 1) {
      return generate(node);
    } else {
      //文本 逻辑不能用 _c来处理
      // 有{{}} 普通文本  混合文本 {{aa}} aaa {{bbb}} ccc
      var text = node.text;

      if (defaultTagRE.test(text)) {
        // _v(_s(name) + 'aa' + _s(age) + '哈哈'）
        var tokens = [];
        var match;
        var index = 0;
        var lastIndex = defaultTagRE.lastIndex = 0;

        while (match = defaultTagRE.exec(text)) {
          // aa {{ age }} haha 
          index = match.index;

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }

        return "_v(".concat(tokens.join('+'), ")"); // 是带有{{}}
      } else {
        return "_v(".concat(JSON.stringify(text), ")");
      }
    }
  }

  function generate(el) {
    // console.log(el); // 转换成render代码
    var children = genChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? genProps(el.attrs) : 'undefined', " ").concat(children ? ',' + children : '', ")"); // => js代码 html=> js代码  字符串拼接

    return code;
  }
  /* 
  <div id="app" a=1 b=2>
      <span style"=color:red">{{name}} <a>hello</a></span>
  </div> 
   _c(
      'div',{id:'app',a:1,b:2}
      ,_c(
          'span',
          {style:{color:'red'}}
          ,_s(_v(name)),
          _c(a,undefined,_v('hello'))
          )
  )
  */

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // aa-aa 

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //aa:aa

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 可以匹配到标签名  [1]

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); //[0] 标签的结束名字
  //    style="xxx"   style='xxx'  style=xxx

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var startTagClose = /^\s*(\/?)>/;
  function parseHTML(html) {
    // <
    function createASTElement(tag, attrs) {
      // vue3里面支持多个根元素 (外层加了一个空元素) vue2中只有一个根节点
      return {
        tag: tag,
        type: 1,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    var root = null;
    var currentParent;
    var stack = []; // 根据开始标签 结束标签 文本内容 生成一个ast语法树

    function start(tagName, attrs) {
      // [div]
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; // div>span>a   div  span

      stack.push(element);
    }

    function end(tagName) {
      var element = stack.pop();
      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 获取元素 
        // 查找属性

        var _end, attr; //不是开头标签结尾就一直解析


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length); // a=1 a="1" a='1'

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] || true
          });
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          // 开始标签
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } // 结束标签 


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        // 开始解析文本
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    return root;
  }

  function compileToFunctions(template) {
    var ast = parseHTML(template); // root

    var code = generate(ast); // 生成代码

    var render = "with(this){return ".concat(code, "}");
    var fn = new Function(render); // 可以让字符串变成一个函数

    return fn; // render 函数已经ok了
  }

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = []; //存放watcher
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;
  function pushTarget(watcher) {
    Dep.target = watcher;
  }
  function popTarget() {
    Dep.target = null;
  }

  var has = {};
  var queue = [];
  var pending = false;

  function flushSchedularQueue() {
    for (var i = 0; i < queue.length; i++) {
      var watcher = queue[i];
      watcher.run();
    }

    queue = [];
    has = {};
    pending = false;
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] === undefined) {
      queue.push(watcher);
      has[id] = true;

      if (!pending) {
        pending = true;
        nextTick(flushSchedularQueue);
      }
    }
  }
  var cbs = [];
  var waiting = false;

  function nextTick(cb) {
    cbs.push(cb);

    if (!waiting) {
      waiting = true;
      Promise.resolve().then(flushCallbacks);
    }
  }

  function flushCallbacks() {
    for (var i = 0; i < cbs.length; i++) {
      var callback = cbs[i];
      callback();
    }

    waiting = false;
    cbs = [];
  }

  Vue.prototype.$nextTick = nextTick;

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.cb = cb;
      this.getter = exprOrFn;
      this.options = options;
      this.deps = [];
      this.depsId = new Set();
      this.id = id$1++;
      this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this);
        this.getter();
        popTarget();
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        if (!this.depsId.has(dep)) {
          this.deps.push(dep);
          this.depsId.add(dep.id);
          dep.addSub(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }, {
      key: "update",
      value: function update() {
        queueWatcher(this); // this.run()
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, vnode) {
    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      // 初次渲染
      var oldElm = oldVnode;
      var parentElm = oldElm.parentNode;
      var el = createElm(vnode);
      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldElm);
      return el;
    }
  }

  function createElm(vnode) {
    //根据虚拟节点创建真实节点
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text,
        vm = vnode.vm;

    if (typeof tag === 'string') {
      // 这里也可能是一个自定义组件
      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProperties(vnode) {
    var newProps = vnode.data || {};
    var el = vnode.el;

    for (var key in newProps) {
      if (key == 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      // 将虚拟节点转换成真实的dom
      var vm = this; // 首次渲染 需要用虚拟节点 来更新真实的dom元素
      // 初始化渲染的时候 会创建一个新节点并且将老节点删掉
      // 1.第一次渲染完毕后 拿到新的节点，下次再次渲染时替换上次渲染的结果

      vm.$options.el = patch(vm.$options.el, vnode);
    };
  }
  function mountComponent(vm) {
    // 默认vue是通过watcher来进行渲染  = 渲染watcher （每一个组件都有一个渲染watcher）
    var updateComponent = function updateComponent() {
      vm._update(vm._render()); // 虚拟节点

    };

    new Watcher(vm, updateComponent, function () {}, true); // updateComponent();
  }

  var oldArrayMethods = Array.prototype;
  var methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'];
  var arrayMethods = Object.create(oldArrayMethods);
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayMethods$meth;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = (_oldArrayMethods$meth = oldArrayMethods[method]).call.apply(_oldArrayMethods$meth, [this].concat(args));

      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          // splice(0,1,xxxx)
          inserted = args.slice(2);
      }

      if (inserted) ob.observeArray(inserted);
      ob.dep.notify();
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      this.dep = new Dep();
      Object.defineProperty(value, '__ob__', {
        value: this,
        enumerable: false,
        // 不能被枚举表示 不能被循环
        configurable: false // 不能删除此属性

      }); // console.log(value);

      if (Array.isArray(value)) {
        Object.setPrototypeOf(value, arrayMethods);
        this.observerArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observerArray",
      value: function observerArray(data) {
        var _iterator = _createForOfIteratorHelper(data),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            observer(item);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }]);

    return Observer;
  }();

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend(); // 让里层的和外层收集的都是同一个watcher

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function defineReactive(data, key, value) {
    var childOb = observer(value); // 对结果递归拦截

    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend();

          if (childOb) {
            // 如果对数组取值 会将当前的watcher和数组进行关联
            childOb.dep.depend();

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newVal) {
        if (newVal === value) return;
        observer(newVal);
        value = newVal;
        dep.notify();
      }
    });
  }
  function observer(data) {
    if (_typeof(data) !== 'object' || data === null) return;
    if (data.__ob__) return;
    return new Observer(data);
  }

  function initState(vm) {
    var options = vm.$options;

    if (options.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observer(data);
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        if (vm[source][key] === newVal) return;
        vm[source][key] = newVal;
      }
    });
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm);

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      el = document.querySelector(el);
      var vm = this;
      var options = vm.$options;
      vm.$options.el = el; // 如果有render 就直接使用render
      // 没有render 看有没有template属性
      // 没有template 就接着找外部模板

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML; // 火狐不兼容 document.createElement('div').appendChild('app').innerHTMl
        } // 如何将模板编译成render函数


        var render = compileToFunctions(template); // compileToFunctions

        options.render = render;
      }

      mountComponent(vm);
    };
  }

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return vnode(vm, tag, data, data.key, children, undefined);
  }
  function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vnode(vm, tag, data, key, children, text) {
    return {
      vm: vm,
      tag: tag,
      children: children,
      data: data,
      key: key,
      text: text
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 创建元素的虚拟节点
      return createElement.apply(void 0, [this].concat(args));
    };

    Vue.prototype._v = function (text) {
      // 创建文本的虚拟节点
      return createTextVnode(this, text);
    };

    Vue.prototype._s = function (val) {
      // 转化成字符串
      return val == null ? '' : _typeof(val) == 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      return vnode;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
