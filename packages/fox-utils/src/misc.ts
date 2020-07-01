import path from 'path'
import fs from 'fs'
import * as c from 'colorette'

/**
 * @description utility log functions
 */
export const log = {
	info(text: string): void {
		console.info(`${c.bold(c.blue('info:'))} ${c.blue(text)}`)
	},
	success(text: string): void {
		console.info(`${c.bold(c.green('success:'))} ${c.green(text)}`)
	},
	warn(text: string): void {
		console.warn(`${c.bold(c.yellow('warn:'))} ${c.yellow(text)}`)
	},
	error(text: string): void {
		console.error(`${c.bold(c.red('error:'))} ${c.red(text)}`)
	}
}

/**
 * @description `fs.promises.mkdir()`, but ensures folder structure
 * exists and writes with consistent mode
 */
export async function writeFile(
	filePath: string,
	content: string | Record<string, any>,
): Promise<void> {
	if (typeof content === 'object' && content !== null) {
		content = JSON.stringify(content, null, 2)
	}
	try {
		await fs.promises.mkdir(path.dirname(filePath))
	} catch (err) {
		if (err.code !== 'EEXIST') {
			// log.error('unexpected error')
			console.error(err)
		}
	}
	await fs.promises.writeFile(path.join(filePath), content, { mode: 0o644 })
}


