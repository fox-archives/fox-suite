#!/usr/bin/env node
import { runFoxSuite } from './'

export async function bin() {
  try {
    await runFoxSuite()
  } catch (err) {
    console.error(err);
    process.exitCode = 1
  }
}
