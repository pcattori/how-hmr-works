import * as LiveReload from '../live-reload'
import * as Paths from './utils/paths'

export default async () => {
  await LiveReload.serve(Paths)
}
