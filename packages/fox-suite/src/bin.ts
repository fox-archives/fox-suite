#!/usr/bin/env node
import { setup } from 'fox-utils'
import { runFoxSuite } from './index.js'

export async function bin() {
	setup()

  try {
    await runFoxSuite()
  } catch (err) {
    console.error(err);
    process.exitCode = 1
  }
}
