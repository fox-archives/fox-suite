#!/usr/bin/env node

import { fox } from './index.js'

export async function cli() {
	process.on("uncaughtException", (err) => console.error(err));
	process.on("unhandledRejection", (err) => console.error(err));

  try {
    await fox()
  } catch (err) {
    console.error(err);
    process.exitCode = 1
  }
}
