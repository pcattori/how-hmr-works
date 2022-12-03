import * as Module from './module'
import * as BrowserPath from './utils/browser-path'
import * as Event from './utils/event'
import * as Function from './utils/function'
import generateRun from './utils/generate-run'

export default (
  initialModules: Record<string, Module.T>,
  entrypoint: string,
) => {
  let modules = initialModules

  const _require = (source: string, from?: string): Module.Exports => {
    let resolvedSource = from
      ? BrowserPath.resolve(from + '/' + source)
      : source
    let mod = modules[resolvedSource]
    if (mod === undefined) {
      throw Error(`Cannot find module: '${source}'`)
    }
    return mod.run((source: string) => _require(source, resolvedSource))
  }

  _require(entrypoint)

  let wsPort = 3002
  let protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
  let host = location.hostname
  let socketPath = protocol + '//' + host + ':' + wsPort + '/socket'
  let ws = new WebSocket(socketPath)
  ws.onmessage = (message) => {
    if (typeof message.data !== 'string') {
      throw Error('Data is not a string')
    }

    let event = JSON.parse(message.data) as Event.T
    if (event.type !== 'hmr') return
    let hmrEvent = event as Event.HMR

    Object.entries(hmrEvent.updates).forEach(([id, update]) => {
      modules[id] = {
        dependencies: update.dependencies,
        run: Function.parse(generateRun(update.code)) as Module.Run,
      }
    })
    try {
      _require(entrypoint)
    } catch (error) {
      console.error(error)
    }
  }
}
