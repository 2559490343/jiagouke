import { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./queueWatcher";

let id = 0
class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm;
        this.cb = cb;
        this.getter = exprOrFn;
        this.options = options;
        this.deps = [];
        this.depsId = new Set();
        this.id = id++;
        this.get();
    }
    get() {
        pushTarget(this)
        this.getter()
        popTarget()
    }
    addDep(dep) {
        if (!this.depsId.has(dep)) {
            this.deps.push(dep)
            this.depsId.add(dep.id)
            dep.addSub(this)
        }
    }
    run(){
        this.get()
    }
    update(){
        queueWatcher(this)
        // this.run()
    }
}


export default Watcher