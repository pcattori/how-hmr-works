import express from 'express'
import WebSocket from 'ws'

import * as Compiler from '../compiler'
import { createBroadcast } from '../utils/create-broadcast'
import * as Event from './event'

let PORT = 3001

export default async (paths: {
  appDir: string
  entrypoint: string
  publicDir: string
  distDir: string
  bundle: string
}) => {
  await Compiler.build(paths, { mode: 'dev:live-reload' })
  let wss = new WebSocket.Server({ port: 3002 })
  let broadcast = createBroadcast<Event.T>(wss)
  await Compiler.watch(paths, {
    mode: 'dev:live-reload',
    skipInitialBuild: true,
    onBuild: () => broadcast({ type: 'reload' }),
  })

  let app = express()
  app.use('/', express.static(paths.distDir))
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
}
