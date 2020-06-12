import merge from 'lodash.merge'
import type { IFoxConfig } from "fox-types"

/**
 * Enable rules that could prevent
 * potentially buggy code
 */

const isProd = process.env.NODE_ENV === 'production'

/**
 * Strict config rules
 */
export function strictConfig(fox: IFoxConfig, tier: string): Record<string, any> {
  const obj: Record<string, any> = {
    rules: {
			/* ------------------- possible errors ------------------ */
			'for-direction': 'error',
			'getter-return': ['error', { allowImplicit: true }],
			'no-async-promise-executor': 'error',
			'no-await-in-loop': 'error',
			'no-cond-assign': ['error', 'always'],
			'no-console': 'error', // see isProd
			'no-constant-condition': ['error', { checkLoops: true }],
			'no-debugger': 'error',
			'no-empty': 'off', // see isProd
			'no-extra-boolean-cast': 'error',
			'no-prototype-builtins': 'off',
			'no-setter-return': 'error',
			'no-sparse-arrays': 'error',
			'no-useless-backreference': 'error',

			/* ------------------- best practices ------------------- */
			'array-callback-return': 'off', // see isProd
			'class-methods-use-this': ['error', { exceptMethods: [] }],
			'consistent-return': 'off',
			'dot-notation': ['error', { allowKeywords: true }],
			'guard-for-in': 'error',
			'max-classes-per-file': ['error', 8],
			'no-caller': 'error',
			'no-case-declarations': 'off',
			'no-constructor-return': 'error',
			'no-div-regex': 'error',
			'no-empty-function': 'off', // see isProd
			'no-empty-pattern': 'error',
			'no-eval': 'error',
			'no-extend-native': 'error',
			'no-extra-bind': 'error',
			'no-extra-label': 'off', // see isProd
			'no-fallthrough': 'error',
			'no-implicit-globals': 'error',
			'no-lone-blocks': 'off', // see isProd
			'no-multi-spaces': 'error',
			'no-new-func': 'error',
			'no-new-function': 'error',
			'no-new-wrappers': 'error',
			'no-new': 'error',
			'no-restricted-properties': [
				'error',
				{
					object: 'arguments',
					property: 'callee',
					message: 'arguments.callee is deprecated',
				},
				{
					object: 'global',
					property: 'isFinite',
					message: 'Please use Number.isFinite instead',
				},
				{
					object: 'self',
					property: 'isFinite',
					message: 'Please use Number.isFinite instead',
				},
				{
					object: 'globalThis',
					property: 'isFinite',
					message: 'Please use Number.isFinite instead',
				},
				{
					object: 'window',
					property: 'isFinite',
					message: 'Please use Number.isFinite instead',
				},
				{
					object: 'global',
					property: 'isNaN',
					message: 'Please use Number.isNaN instead',
				},
				{
					object: 'self',
					property: 'isNaN',
					message: 'Please use Number.isNaN instead',
				},
				{
					object: 'globalThis',
					property: 'isNan',
					message: 'Please use Number.isNaN instead',
				},
				{
					object: 'window',
					property: 'isNaN',
					message: 'Please use Number.isNaN instead',
				},
				{
					property: '__defineGetter__',
					message: 'Please use Object.defineProperty instead.',
				},
				{
					property: '__defineSetter__',
					message: 'Please use Object.defineProperty instead.',
				},
			],
			'no-script-url': 'error',
			'no-self-assign': ['error', { props: true }],
			'no-self-compare': 'error',
			'no-unused-label': 'error',
			'no-useless-call': 'error',
			'no-useless-catch': 'error',
			'no-useless-escape': 'error',
			'no-useless-return': 'error',
			'no-with': 'error',
			'prefer-promise-reject-errors': ['error', { allowEmptyReject: false }],
			'prefer-regex-literals': 'error',
			complexity: ['error', { max: 18 }],
      'default-case-last': 'error',
      'default-case': ['error', { commentPattern: '^no default$' }],
      'yoda': ['error', 'never', { exceptRange: true, onlyEquality: false }],

			/* --------------------- strict mode -------------------- */

			/* ---------------------- variables --------------------- */
			'no-label-var': 'error',
			'no-restricted-globals': [
				'error',
				'addEventListener',
				'blur',
				'close',
				'closed',
				'confirm',
				'defaultStatus',
				'defaultstatus',
				'error',
				'event',
				'external',
				'find',
				'focus',
				'frameElement',
				'frames',
				'history',
				'innerHeight',
				'innerWidth',
				'isFinite',
				'isNaN',
				'length',
				'location',
				'locationbar',
				'menubar',
				'moveBy',
				'moveTo',
				'name',
				'onblur',
				'onerror',
				'onfocus',
				'onload',
				'onresize',
				'onunload',
				'open',
				'opener',
				'opera',
				'outerHeight',
				'outerWidth',
				'pageXOffset',
				'pageYOffset',
				'parent',
				'print',
				'removeEventListener',
				'resizeBy',
				'resizeTo',
				'screen',
				'screenLeft',
				'screenTop',
				'screenX',
				'screenY',
				'scroll',
				'scrollbars',
				'scrollBy',
				'scrollTo',
				'scrollX',
				'scrollY',
				'self',
				'status',
				'statusbar',
				'stop',
				'toolbar',
				'top',
			],
			'no-undef-init': 'error',
			'no-unused-vars': 'off', // see isProd
			'no-use-before-define': [
				'error',
				{ functions: false, classes: true, variables: true },
			],
			'wrap-iife': ['error', 'inside', { functionPrototypeMethods: false }],

			/* ------------------- stylistic issue ------------------ */
			'prefer-exponentiation-operator': 'error',

			/* -------------------- ecmascript 6 -------------------- */
			'no-useless-comuted-key': 'error',
			'no-useless-constructor': 'off', // see isProd
			'require-yield': 'off', // see isProd
			'symbol-description': 'error',
    },
  }

	if (isProd) {
		/* ------------------- possible errors ------------------ */
		obj.rules['no-empty'] = ['error', { allowEmptyCatch: false }]
		obj.rules['no-console'] = 'error'


		/* ------------------- best practices ------------------- */
		obj.rules['array-callback-return'] = ['error', { allowImplicit: true }]
		obj.rules['no-empty-function'] = [
			'error',
			{
				allow: ['arrow-functions'],
			},
		]
		obj.rules['no-extra-label'] = 'error'
		obj.rules['no-lone-blocks'] = 'error'


		/* --------------------- strict mode -------------------- */

		/* ---------------------- variables --------------------- */
		obj.rules['no-unused-vars'] = [
			'error',
			{ vars: 'all', args: 'none', ignoreRestSiblings: true },
		]

		/* -------------------- ecmascript 6 -------------------- */
		obj.rules['no-useless-constructor'] = 'error'
		obj.rules['require-yield'] = 'off' // see isProd
	}

	return obj
}
