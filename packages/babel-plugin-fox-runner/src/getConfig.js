;(async () => {
	globalThis.foxConfig = (await require('fox-utils').getProjectData()).foxConfig
})()
