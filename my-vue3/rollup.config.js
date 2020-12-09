import ts from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import path from 'path'

export default {
    input: 'src/index.ts',
    output: {
        format: 'umd',
        file: path.resolve(__dirname, 'dist/bundle.js'),
        sourcemap: true,
        name: 'VueObserver'
    },
    plugins: [
        nodeResolve({
            extensions: ['.js', '.ts']
        }),
        ts({
            tsconfig: path.resolve(__dirname, 'tsconfig.json')
        }),
        serve({
            openPage: '/public/index.html',
            contentBase: '',
            port: 3000
        })
    ]
}