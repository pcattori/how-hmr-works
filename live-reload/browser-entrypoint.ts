import * as Event from './event'

let port = 3002
let protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
let host = location.hostname
let socketPath = protocol + '//' + host + ':' + port + '/socket'

let ws = new WebSocket(socketPath)

ws.onmessage = (message) => {
  let event = JSON.parse(message.data) as Event.T
  if (event.type === 'reload') {
    console.log('Reloading...')
    window.location.reload()
  }
}
