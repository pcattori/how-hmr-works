import * as Module from '../module'

type Event = { type: string }
export type HMR = { type: 'hmr'; updates: Record<string, Module.Data> }
export type T = Event
