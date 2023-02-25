import * as core from '@actions/core'
import {runMCU} from './execution'
import * as fs from 'fs'

async function run(): Promise<void> {
  try {
    const uf2: string = core.getInput('firmware')
    const fs_arg: string = core.getInput('filesystem')

    if (!fs.existsSync(uf2)) {
      core.setFailed('UF2 file provided does not exist.')
    }
    if (fs_arg !== '' && !fs.existsSync(fs_arg)) {
      core.setFailed('Filesystem image provided does not exist.')
    }
    const filesystem = fs_arg === '' ? null : fs_arg

    runMCU(uf2, filesystem)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
