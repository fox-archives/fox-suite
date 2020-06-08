// @ts-ignore
import { declare } from '@babel/helper-plugin-utils'
import type { IFoxConfig } from 'fox-types'
// HACK: clean this up later
/// <reference types="../../../node_modules/@types/babel-generator/index.d.ts"/>
// @ts-ignore
import gg from '@babel/generator'
// import { parseExpression } from '@babel/core'
// @ts-ignore
import { parseExpression } from '@babel/parser'
import g from "babel-generator"

const generate: typeof g = gg

// this adds foxConfig on globalContext
// we're doing this because foxConfig is async, and it'll
// be work to ensure `@rollup/plugin-babel` can handle that, since
// it would involve making an asyncronous babel visitor
// so we're hiding the async fn call behind sync required
require('../src/getConfig.js')

export default declare((api: any, options: any) => {
	api.assertVersion(7)

	const t = api.types
	function astFromPrimitive(rawValue: any) {
		let value
		if (typeof rawValue === 'string') value = t.stringLiteral(rawValue)
		else if (typeof rawValue === 'bigint') {
			value = t.bigIntLiteral(rawValue.toString())
		} else if (typeof rawValue === 'boolean') value = t.booleanLiteral(rawValue)
		else if (typeof rawValue === 'undefined') {
			value = t.unaryExpression('void', t.numericLiteral(0), true)
		} else if (rawValue === null) value = t.nullLiteral()
		else if (typeof rawValue === 'number') value = t.numericLiteral(rawValue)
		else if (rawValue instanceof RegExp) {
			value = t.regExpLiteral(rawValue.toString())
		} else {
			throw new Error(`getAstFromPrimitive: unexpected rawValue: ${rawValue}`)
		}
		return value
	}
	return {
		name: 'babel-plugin-deno-fs-promises',
		pre(state: any) {
			// @ts-ignore
			this.totalTransforms = 0
		},
		visitor: {
			MemberExpression: {
				enter(path: any) {
					const { node } = path

					// @ts-ignore
					const foxConfig: IFoxConfig = globalThis.foxConfig

					const transpilationMap: Record<string, any> = {
						'fox.all': foxConfig.all,
						'fox.monorepo': foxConfig.monorepo,
						'fox.plugin': foxConfig.plugin,
						'fox.plugin.stylelint': foxConfig.plugin?.stylelint
					}

					const { code: memberExpressionString } = generate(node)

					if (Object.prototype.hasOwnProperty.call(transpilationMap, memberExpressionString)) {
						const runtimeValue = transpilationMap[memberExpressionString]

						// const newLiteral = parseExpression(runtimeValue)
						// console.log(newLiteral)
						// @ts-ignore
						this.totalTransforms = this.totalTransforms + 1
						path.replaceWith(astFromPrimitive(runtimeValue))
					}
				},
			},
		},
	}
})

