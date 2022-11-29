import * as Compiler from '../compiler'
import * as Paths from './utils/paths'

export default async () => {
  await Compiler.build(Paths)
}
