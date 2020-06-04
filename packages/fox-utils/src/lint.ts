import { IBuildLint } from 'fox-types'

export async function buildLint(opts: IBuildLint): Promise<void> {
	await opts.fn()
}
