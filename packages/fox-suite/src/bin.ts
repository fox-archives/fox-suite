#!/usr/bin/env node

import { setup } from 'fox-utils'
import { fox } from './index.js'

export async function bin() {
	setup()

  try {
    await fox()
  } catch (err) {
    console.error(err);
    process.exitCode = 1
  }
}
