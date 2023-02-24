import * as fs from 'fs'
import {RP2040} from 'rp2040js'
import {decodeBlock} from 'uf2'

const FLASH_START_ADDRESS = 0x10000000
const FLASH_START = 0x100000
const UF2_BLOCKSIZE = 512

export function loadUF2(filepath: string, mcu: RP2040): void {
  const fileSize = fs.statSync(filepath).size
  const fd = fs.openSync(filepath, 'r')
  const buffer = new Uint8Array(UF2_BLOCKSIZE)
  let bytesWritten = 0
  while (bytesWritten < fileSize) {
    const bytesRead = fs.readSync(fd, buffer, {length: UF2_BLOCKSIZE})
    const {flashAddress, payload} = decodeBlock(buffer)
    const blockFlashAddress = flashAddress - FLASH_START_ADDRESS
    mcu.flash.set(payload, blockFlashAddress)
    bytesWritten += bytesRead
  }
  fs.closeSync(fd)
}

export function loadFlash(filepath: string, mcu: RP2040): void {
  const buffer = fs.readFileSync(filepath, {flag: 'r'})
  mcu.flash.set(buffer, FLASH_START)
}
