// rollup 配置文件
import path from 'path'
import json from '@rollup/plugin-json'
import resolvePlugin from '@rollup/plugin-node-resolve'
import ts from 'rollup-plugin-typescript2'

// 根据环境变量中的TARGET寻找打包目标目录
// console.log(process.env.TARGET)
const packagesDir = path.resolve(__dirname, 'packages')
// 打包的基准目录
const packageDir = path.resolve(packagesDir, process.env.TARGET)
// 永远针对的是某个模块的目录
const resolve = (dir) => path.resolve(packageDir, dir)
const name = path.basename(packageDir)
const pkg = require(resolve('package.json'))

const outputConfig = {
    'esm-bundler': {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    'cjs': {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    'global': {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife' //立即执行函数
    }
}
const buildOptions = pkg.buildOptions //自己在package.js中定义的配置对象
function createConfig(format, output) {
    console.log(output);
    output.name = buildOptions.name
    output.sourcemap = true //是否生成sourcemap
    // 生成rollup配置
    return {
        input: resolve(`src/index.ts`),
        output,
        plugins: [
            json(),
            ts({ //ts插件
                tsconfig:path.resolve(__dirname,'tsconfig.json')
            }),
            resolvePlugin() //解析第三方模块
        ]
    }
}
// console.log(buildOptions.formats);
export default buildOptions.formats.map(format => createConfig(format, outputConfig[format]))
