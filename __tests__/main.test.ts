/* eslint-disable no-console */

import * as path from 'path'
import * as cp from 'child_process'
import * as process from 'process'
import {test} from '@jest/globals'

test('Test runs', function () {
  process.env['INPUT_FIRMWARE'] = 'firmware.uf2'
  process.env['INPUT_FILESYSTEM'] = 'fat12.img'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log('Running action...')
  console.log(cp.execFileSync(np, [ip], options).toString())
})
