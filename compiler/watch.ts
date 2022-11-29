import path from 'node:path'

import chokidar from 'chokidar'

import build from './build'

export default async (paths: {
  appDir: string
  entrypoint: string
  publicDir: string
  distDir: string
  bundle: string
}) => {
  await build(paths)

  let relative = (file: string) => path.relative(paths.appDir, file)
  let watcher = chokidar.watch(paths.appDir, { ignoreInitial: true })
  watcher
    .on('error', console.error)
    .on('change', async (file) => {
      console.info(`File changed: ${relative(file)}`)
      await build(paths)
    })
    .on('add', async (file) => {
      console.info(`File added: ${relative(file)}`)
      await build(paths)
    })
    .on('unlink', async (file) => {
      console.info(`File unlinked: ${relative(file)}`)
      await build(paths)
    })
  return watcher.close
}
