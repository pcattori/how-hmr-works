import express from 'express'

import * as Paths from './utils/paths'

let PORT = 3001

export default async () => {
  let app = express()
  app.use('/', express.static(Paths.distDir))
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
}
