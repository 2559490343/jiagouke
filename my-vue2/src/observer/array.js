
const oldArrayMethods = Array.prototype;

const methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'reverse',
    'sort'
];

export const arrayMethods = Object.create(oldArrayMethods);
methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        let result = oldArrayMethods[method].call(this, ...args);
        let inserted
        let ob = this.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice': // splice(0,1,xxxx)
                inserted = args.slice(2);
            default:
                break;
        }
        if (inserted) ob.observeArray(inserted);
        ob.dep.notify();
        return result;
    }
})