import path from 'node:path'

import esbuild from 'esbuild'

let liveReloadEntrypoint = path.join(__dirname, 'browser-entrypoint.js')

export default async (paths: { distDir: string }) => {
  await esbuild.build({
    bundle: true,
    entryPoints: [liveReloadEntrypoint],
    outfile: path.join(paths.distDir, 'live-reload.js'),
  })
}
