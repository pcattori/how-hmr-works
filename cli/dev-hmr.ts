import * as HMR from '../hmr'
import * as Paths from './utils/paths'

export default async () => {
  HMR.serve(Paths)
}
