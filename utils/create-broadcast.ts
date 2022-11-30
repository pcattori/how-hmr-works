import WebSocket from 'ws'

type Broadcast<Event = { type: string }> = (event: Event) => void

export let createBroadcast = <Event>(
  wss: WebSocket.Server,
): Broadcast<Event> => {
  let broadcast: Broadcast<Event> = (event) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(event))
      }
    })
  }
  return broadcast
}
