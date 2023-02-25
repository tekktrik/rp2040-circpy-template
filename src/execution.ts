import {RP2040, USBCDC, ConsoleLogger, LogLevel} from 'rp2040js'
import {bootrom} from './bootrom'
import {loadUF2, loadFlash} from './memory'
import * as core from '@actions/core'

export function runMCU(
  uf2_filepath: string,
  fs_filepath: string | null = null
): void {
  // Create the MCU
  const mcu = new RP2040()
  mcu.logger = new ConsoleLogger(LogLevel.Error)

  // Load the bootrom
  mcu.loadBootrom(bootrom)

  // Load the UF2 firmware
  loadUF2(uf2_filepath, mcu)

  // Load the filesystem, if needed
  if (fs_filepath != null) {
    loadFlash(fs_filepath, mcu)
  }

  let dataReceived = ''
  let currentLine = ''

  // Create a USB CDC
  const cdc = new USBCDC(mcu.usbCtrl)

  // Notify when USB CDC is connected
  cdc.onDeviceConnected = function () {
    // ----------------------------------
    // [Insert post-connection code here]
    // ----------------------------------
  }

  // Handle receiving serial data
  cdc.onSerialData = function (buffer) {
    for (const byte of buffer) {
      const char = String.fromCharCode(byte)
      if (char === '\r' || char === '\n') {
        if (currentLine === '[RP2040JS:END]') {
          // TODO: Change this depending on the use case
          const data = dataReceived.split(/\[RP2040JS:\S+\]/)
          const printout = data[1].trim()
          core.setOutput('result', printout)
          process.exit(0)
        }
        currentLine = ''
      } else {
        currentLine += char
      }
      dataReceived += char
    }
    // ----------------------------------
    // [Insert serial data code here]
    // ----------------------------------
  }

  // Move the program counter and execute
  mcu.core.PC = 0x10000000
  mcu.execute()
}
