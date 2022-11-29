import path from 'node:path'

import esbuild from 'esbuild'
import fs from 'fs-extra'

export default async (paths: {
  entrypoint: string
  publicDir: string
  distDir: string
  bundle: string
}) => {
  await fs.ensureDir(paths.distDir)
  await fs.copy(
    path.join(paths.publicDir, 'index.html'),
    path.join(paths.distDir, 'index.html'),
  )

  await esbuild.build({
    bundle: true,
    entryPoints: [paths.entrypoint],
    outfile: paths.bundle,
  })
}
