import {RP2040, USBCDC} from 'rp2040js'
import {bootrom} from './bootrom'
import {loadUF2, loadFlash} from './memory'
import * as core from '@actions/core'

export function runMCU(
  uf2_filepath: string,
  fs_filepath: string | null = null
): void {
  // Create the MCU
  const mcu = new RP2040()

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
    const data = new TextDecoder().decode(buffer)
    for (const char of data) {
      if (char === '\n') {
        if (currentLine === '[RP2040JS: END]') {
          // TODO: Change this depending on the use case
          const printout = dataReceived.split('\n')[0]
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
