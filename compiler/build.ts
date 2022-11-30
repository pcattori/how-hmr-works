import path from 'node:path'

import esbuild from 'esbuild'
import fs from 'fs-extra'

import Mode from './mode'
import * as LiveReload from '../live-reload'

let indexHtml: Record<Mode, string> = {
  production: 'index.html',
  'dev:watch': 'index.html',
  'dev:live-reload': 'live-reload.html',
}

export default async (
  paths: {
    entrypoint: string
    publicDir: string
    distDir: string
    bundle: string
  },
  options: { mode: Mode },
) => {
  await fs.remove(paths.distDir)
  await fs.ensureDir(paths.distDir)
  await fs.copy(
    path.join(paths.publicDir, indexHtml[options.mode]),
    path.join(paths.distDir, 'index.html'),
  )

  await esbuild.build({
    bundle: true,
    entryPoints: [paths.entrypoint],
    outfile: paths.bundle,
  })

  if (options.mode === 'dev:live-reload') {
    LiveReload.compile(paths)
  }
}
