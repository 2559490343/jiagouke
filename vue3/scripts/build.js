// 把packages目录下所有进行打包
const fs = require('fs')
const execa = require('execa')//开启子进程进行打包 最终还是使用rollup打包

const targets = fs.readdirSync('packages').filter(name => {
    return fs.statSync(`packages/${name}`).isDirectory()
})
// 对目标进行依次打包 并行打包
async function build(target) { // rollup -c --environment TARGET:shared
    await execa('rollup', ['-c', '--environment', `TARGET:${target}`], {
        stdio: 'inherit'//把子进程打包的信息共享给父进程
    })
}

function runParallel(targets, iteratorFn) {
    const res = []
    for (const item of targets) {
        const p = iteratorFn(item)
        res.push(p)
    }
    return Promise.all(res)
}
runParallel(targets, build)
