import { Command } from 'commander'

import build from './build'
import devWatch from './dev-watch'
import serve from './serve'

let program = new Command()

program.command('build').action(build)
program.command('serve').action(serve)
program.command('dev:watch').action(devWatch)

program.parse()
