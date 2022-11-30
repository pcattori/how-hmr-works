import { Command } from 'commander'

import build from './build'
import devLiveReload from './dev-live-reload'
import devWatch from './dev-watch'
import serve from './serve'

let program = new Command()

program.command('build').action(build)
program.command('serve').action(serve)
program.command('dev:watch').action(devWatch)
program.command('dev:live-reload').action(devLiveReload)

program.parse()
