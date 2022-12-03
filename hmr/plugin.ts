import esbuild from 'esbuild'

import * as Module from './module'
import generateRun from './utils/generate-run'

const generateModule = ({ code, dependencies }: Module.Data): string =>
  [
    '{',
    `run:${generateRun(code)},`,
    `dependencies:${JSON.stringify(dependencies)},`,
    '}',
  ].join('')

const generateModules = (graph: [string, Module.Data][]): string => {
  let keyValuePairs = graph
    .map(([id, mod]) => {
      return `${JSON.stringify(id)}:${generateModule(mod)}`
    })
    .join(',')
  return `{${keyValuePairs}}`
}

const generateHmrVirtualModule = async (entrypoint: string) => {
  let graph = await Module.graph(entrypoint)
  return [
    "import hmr from './browser-entrypoint.ts'",
    `const initialModules = ${generateModules(graph)}`,
    `const entrypoint = ${JSON.stringify(Module.id(entrypoint))}`,
    `hmr(initialModules, entrypoint)`,
  ].join('\n')
}

export default async (entrypoint: string): Promise<esbuild.Plugin> => {
  let vmod = await generateHmrVirtualModule(entrypoint)
  return {
    name: 'virtual:hmr',
    setup(build) {
      build.onResolve({ filter: /^virtual:hmr-entry$/ }, ({ path }) => {
        return {
          namespace: 'virtual:hmr',
          path,
        }
      })
      build.onLoad({ filter: /^virtual:hmr-entry$/ }, () => {
        return {
          resolveDir: __dirname,
          loader: 'ts',
          contents: vmod,
        }
      })
    },
  }
}
