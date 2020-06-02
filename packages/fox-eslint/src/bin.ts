import { runEslint } from './'

export async function bin() {
  try {
    await runEslint()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  }
}
