/**
 * setup up handlers for uncaughtException
 * and unhandledRejection
 */
export function setup() {
	process.on('uncaughtException', (err) => console.error(err))
	process.on('unhandledRejection', (err) => console.error(err))
}
