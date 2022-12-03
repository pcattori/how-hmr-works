import fs from 'node:fs/promises'
import path from 'node:path'

import esbuild from 'esbuild'

export type Data = {
  dependencies: string[]
  code: string
}

export type Exports = Record<string, unknown>
export type Require = (source: string) => Exports
export type Run = (require: Require) => Exports

type Module = {
  dependencies: string[]
  run: Run
}
export type T = Module

export const id = (_path: string): string => {
  let { dir, name } = path.parse(_path)
  return path.join(dir, name)
}

const createDependencyGraph = async (entrypoint: string) => {
  let result = await esbuild.build({
    bundle: true,
    entryPoints: [entrypoint],
    metafile: true,
    write: false,
  })

  return Object.entries(result.metafile!.inputs).map(
    ([relativePath, { imports }]) =>
      ({
        path: path.resolve(relativePath),
        dependencies: imports.map((imp) => path.resolve(imp.path)),
      } as const),
  )
}

const transpileToCommonJS = async (code: string) => {
  let result = await esbuild.transform(code, { loader: 'tsx', format: 'cjs' })
  result.warnings.forEach(console.warn)
  return result.code
}

export const graph = async (entrypoint: string): Promise<[string, Data][]> => {
  let dependencyGraph = await createDependencyGraph(entrypoint)
  return Promise.all(
    dependencyGraph.map(async (mod) => {
      let code = await fs.readFile(mod.path, 'utf8')
      let commonjs = await transpileToCommonJS(code)
      return [
        id(mod.path),
        {
          code: commonjs,
          dependencies: mod.dependencies.map(id),
        },
      ]
    }),
  )
}
