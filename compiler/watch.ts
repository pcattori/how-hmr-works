import path from 'node:path'

import chokidar from 'chokidar'

import build from './build'
import Mode from './mode'

export default async (
  paths: {
    appDir: string
    entrypoint: string
    publicDir: string
    distDir: string
    bundle: string
  },
  options: { mode: Mode; skipInitialBuild?: boolean; onBuild?: () => void },
) => {
  if (!(options.skipInitialBuild ?? false)) {
    await build(paths, options)
  }

  let rebuild = async () => {
    await build(paths, options)
    options.onBuild?.()
  }

  let relative = (file: string) => path.relative(paths.appDir, file)
  let watcher = chokidar.watch(paths.appDir, { ignoreInitial: true })
  watcher
    .on('error', console.error)
    .on('change', async (file) => {
      console.info(`File changed: ${relative(file)}`)
      await rebuild()
    })
    .on('add', async (file) => {
      console.info(`File added: ${relative(file)}`)
      await rebuild()
    })
    .on('unlink', async (file) => {
      console.info(`File unlinked: ${relative(file)}`)
      await rebuild()
    })
  return watcher.close
}
