// 只针对具体的某个包
const fs = require('fs')
const execa = require('execa')//开启子进程进行打包 最终还是使用rollup打包
// 指定打包目标
const target = 'reactivity'
// 对目标进行打包
async function build(target) { // rollup -c --environment TARGET:shared
    await execa('rollup', ['-c','-w', '--environment', `TARGET:${target}`], {
        stdio: 'inherit'//把子进程打包的信息共享给父进程
    })
}
build(target)
