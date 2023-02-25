/* eslint-disable no-console */

import * as path from 'path'
import * as cp from 'child_process'
import * as process from 'process'
import {test} from '@jest/globals'
import * as fs from 'fs'

const testif = function (cond: boolean) {
  if (cond) {
    return test
  }
  console.log(
    'Test being skipped, use `npm run create-files` to create UF2 and filesystem files.'
  )
  return test.skip
}

const FIRMWARE_EXISTS = fs.existsSync('firmware.uf2')
const FILESYSTEM_EXISTS = fs.existsSync('fat12.img')
const FILES_EXIST = FIRMWARE_EXISTS && FILESYSTEM_EXISTS

testif(FILES_EXIST)('Test runs', function () {
  process.env['INPUT_FIRMWARE'] = 'firmware.uf2'
  process.env['INPUT_FILESYSTEM'] = 'fat12.img'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
