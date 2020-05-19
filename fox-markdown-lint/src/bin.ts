import { runMarkdownLint } from './'

export async function bin() {
  try {
    await runMarkdownLint()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  }
}
