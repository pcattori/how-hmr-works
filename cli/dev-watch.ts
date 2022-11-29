import express from 'express'

import * as Compiler from '../compiler'
import * as Paths from './utils/paths'

let PORT = 3001

export default async () => {
  await Compiler.watch(Paths)

  let app = express()
  app.use('/', express.static(Paths.distDir))
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
}
