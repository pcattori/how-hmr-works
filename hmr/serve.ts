import fs from 'node:fs/promises'
import path from 'node:path'

import chokidar from 'chokidar'
import esbuild from 'esbuild'
import express from 'express'
import prettier from 'prettier'
import WebSocket from 'ws'

import * as Event from './utils/event'
import hmrVirtualModulePlugin from './plugin'
import * as Module from './module'
import { createBroadcast } from '../utils/create-broadcast'

let build = async (entrypoint: string): Promise<string> => {
  let result = await esbuild.build({
    bundle: true,
    entryPoints: ['virtual:hmr-entry'],
    plugins: [await hmrVirtualModulePlugin(entrypoint)],
    treeShaking: true,
    write: false,
  })
  let output = result.outputFiles[0].text
  return prettier.format(output, { parser: 'babel-ts' })
}

type WatchEvent = {
  type: 'change' | 'add' | 'unlink'
  file: string
}

let watch = async (
  paths: { appDir: string; entrypoint: string },
  options: { onBuild?: (event: WatchEvent) => void } = {},
) => {
  let rebuild = async (event: WatchEvent) => {
    console.log(event)
    await build(paths.entrypoint)
    options.onBuild?.(event)
  }
  let watcher = chokidar.watch(paths.appDir, { ignoreInitial: true })
  watcher.on('error', console.error)
  watcher.on('all', async (type, file) => {
    if (type !== 'change' && type !== 'add' && type !== 'unlink') {
      throw Error(`Unhanlded watch event type: ${type}`)
    }
    console.info(`File ${type}: ${path.relative(paths.appDir, file)}`)
    await rebuild({ type, file })
  })
  return watcher.close
}

export default async (paths: {
  appDir: string
  entrypoint: string
  publicDir: string
}) => {
  let wss = new WebSocket.Server({ port: 3002 })
  let broadcast = createBroadcast<Event.HMR>(wss)
  await watch(paths, {
    onBuild: async ({ type, file }) => {
      if (type !== 'change') {
        console.warn(`Unhandled watch event type: ${type}`)
      }
      let id = Module.id(file)
      let graph = Object.fromEntries(await Module.graph(file))
      let mod = graph[id]

      broadcast({
        type: 'hmr',
        updates: { [id]: mod },
      })
    },
  })

  let port = 3001
  let app = express()
  app.get('/', async (_req, res) => {
    res.set('Content-Type', 'text/html')
    let indexHtml = await fs.readFile(path.join(paths.publicDir, 'index.html'))
    res.send(indexHtml)
  })
  app.get('/bundle.js', async (_req, res) => {
    let bundle = await build(paths.entrypoint)
    res.set('Content-Type', 'text/javascript')
    res.send(Buffer.from(bundle))
  })
  app.listen(port, () => console.log(`Server listening on port ${port}`))
}
