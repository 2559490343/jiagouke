import Vue from "../index";


let has = {};
let queue = [];
let pending = false;


function flushSchedularQueue() {
    for (let i = 0; i < queue.length; i++) {
        let watcher = queue[i];
        watcher.run();
    }
    queue = [];
    has = {};
    pending = false;
}
export function queueWatcher(watcher) {
    let id = watcher.id;
    if (has[id] === undefined) {
        queue.push(watcher);
        has[id] = true;
        if (!pending) {
            pending = true;
            nextTick(flushSchedularQueue);
        }
    }
}
let cbs = [];
let waiting = false;
function nextTick(cb) {
    cbs.push(cb)
    if (!waiting) {
        waiting = true;
        Promise.resolve().then(flushCallbacks)
    }
}
function flushCallbacks() {
    for (let i = 0; i < cbs.length; i++) {
        let callback = cbs[i];
        callback();
    }
    waiting = false;
    cbs = [];
}
Vue.prototype.$nextTick = nextTick