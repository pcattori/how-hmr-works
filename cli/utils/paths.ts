import path from 'node:path'

export let rootDir = path.resolve(__dirname, '..', '..')

export let appDir = path.join(rootDir, 'app')
export let entrypoint = path.join(appDir, 'index.ts')

export let publicDir = path.join(rootDir, 'public')

export let distDir = path.join(rootDir, 'dist')
export let bundle = path.join(distDir, 'bundle.js')
