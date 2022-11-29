import { Command } from 'commander'

import build from './build'
import dev from './dev'
import serve from './serve'

let program = new Command()

program.command('build').action(build)
program.command('serve').action(serve)
program.command('dev').action(dev)

program.parse()
