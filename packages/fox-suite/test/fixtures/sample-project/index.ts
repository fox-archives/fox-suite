import { sortPackageJsonFileAuto } from 'fox-plugin-sort-package-json'

;(async () => {
	try {
		sortPackageJsonFileAuto()
	} catch (err) {
		console.error(err)
		process.exitCode = 1
	}
})()
