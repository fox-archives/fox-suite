import { IPlugin } from 'fox-types'
import { getPluginInfo, loadModule } from './test.util'
import 'jest-extended'

require = require('esm')(module)


const { pluginName } = getPluginInfo()

describe(`testing module: '${pluginName}'`, () => {
	test('src/info.{ts,js} contains all the necessary exports', async () => {
		const infoModule: IPlugin = await loadModule('src/index.ts')
		console.log(infoModule)
		expect(infoModule).toBeObject()
		expect(infoModule).toHaveProperty('info')
		expect(infoModule).toBeObject()
		const info = infoModule.info

		expect(info).toHaveProperty('name')
		expect(info.name).toBeString()
		expect(info).toHaveProperty('tool')
		expect(info.tool).toBeString()
		expect(info).toHaveProperty('toolConfig')
		expect(info.toolConfig).toBeString()
		expect(info).toHaveProperty('description')
		expect(info.description).toBeString()
		expect(info).toHaveProperty('descriptionLong')
		expect(info.descriptionLong).toBeString()
	})
})
