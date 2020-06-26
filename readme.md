# fox-suite

A sly suite of tools for web development

## Summary

Fox suite provides a unified interface for formatting and linting tools. It ensures these independent tools _just work_ with _minimal configuration overhead_. It's meant to be used on tiny to medium sided-projects.

## Features

- Automatically configures sane defaults for (EditorConfig, Prettier, ESLint, Stylelint, lint-staged (todo), husky (todo), markdownlint, conventional-commit (todo) etc.)
- Three options to change strictness of lint (so you can make linting more lenient for smaller / experimental projects or if you want the minimal linting guarentees whilst still moving fast 🚀)
- Targets the highest possible ECMAScript version and ensures you are using the latest standards correctly
- All core plugins (ones in `fox-preset-recommended` and `fox-preset-all` are overridable (todo))

## Usage

Right now it's _beta-ish quality_

```sh
# tested with npm, yarn 1, pnpm
npm i fox-suite fox-preset-recommended

fox # opens interactive menu
fox --help # lists options
```

## Configuration

Configuring `fox-suite` is super easy. Simply create a `fox.config.js` at the root of your repo / monorepo.

Note that whenever you change `fox.config.js`, we recommend running `fox --fix`. this will regenerate config for all plugins. that way, anything that depends on your config (vscode intellisense, `eslint-webpack-plugin`, etc. will have the latest changes). you may need to reload your editor too

### Example

```js
/** @type {import("fox-types/types").IFoxConfig} */
const foxConfig = {
	// enable strict linting for all linters
	all: 'strict',
	monorepo: false // default
	plugin: {
		// enable cozy (lenient) linting for 'stylelint' scss/css linter
		stylelint: 'cozy'
	}
}

export default foxConfig
```

### Configuration Options

If you start with the above `fox.config.js` config, intellisense will take over (todo), or you can just read the following. (todo: `fox init`)

```js
/**
 * @description format of the `fox.config.js` file
 */
export interface IFoxConfig {
	/**
	 * @description changes the lint behavior of all linters
	 * (plugins that have a `fixFunction` method)
	 */
	all: 'off' | 'cozy' | 'strict' | 'excessive'

	/**
	 * @description set to true if `fox.config.js` is at the
	 * root of a monorepo (at the same level as `lerna.json`,
	 * `pnpm-workspace.yaml`, etc.)
	 */
	monorepo: boolean

	/**
	 * @description set to true to enable caching. caching functionality
	 * is a plugin dependent feature; some may not have it. once set to false,
	 * existing caches are removed (for the plugins selected to run)
	 * @todo make this automatically false for CI
	 */
	cache: boolean

	/**
	 * @deprecated
	 * @description array containing current environments
	 * @todo deprecate. this is only useful for javascript, and we can include
	 * quick commented out good defaults for eslint env property
	 */
	env: [ 'browser' ] | [ 'node' ] | [ 'deno' ] | ['browser', 'node' ]
		| ['browser', 'deno'] | ['node', 'deno'] | ['browser', 'deno', 'node'] | []

	/**
	 * @description object containing an entry for each plugin,
	 * to change its linting severity. same options as the 'all' property
	 * @example
	 * ```js
	 * // if `fox-plugin-stylelint` is installed,
	 * // we can do the following
	 * plugins: {
	 *   stylelint: 'strict'
	 * }
	 * ```
	 */
	plugins: Record<string, 'off' | 'cozy' | 'strict' | 'excessive'>
}
```

## Supported Tooling

The following are presets that include support for their respective tooling. Note that support for Babel, Typescript etc. configs are out of the scope of this project since they're not strictly linters / formatters

### `fox-preset-recommended`

You get the following from `fox-preset-recommended`

- EditorConfig (`fox-plugin-editorconfig`)
- Prettier (`fox-plugin-prettier`)
- ESlint (`fox-plugin-eslint`)
- Stylelint (`fox-plugin-stylelint`)
- markdownlint (`fox-plugin-markdownlint`)

### `fox-plugin-all`

Kinks still being worked out. Contains everything from `fox-preset-recommended` with the additions of:

- html-validate (`fox-plugin-html-validate`)
- HTMLHint (`fox-plugin-htmlhint`)
- htmllint (`fox-plugin-htmllint`)
- sort-package-json (`fox-plugin-sort-package-json`)
- package-json-lint (`fox-plugin-package-json-lint`)
- commit-convention (todo)
- husky (todo)
- lint-staged (todo)

## FAQ

### I don't like rule X - can i change it?

Yes! If a plugin supports overriding, they will generate a file in `.config/$pluginName.config.js` for you to modify. All plugins that come in `fox-preset-all` and `fox-preset-recommended (will) support overriding. (right now prettier and eslint only support it)

### What about Rome?

Rome solves a lot of headaches related to tooling interoperability. However, it also comes with a bundler, compiler, and testing framework in addition to a formatter and linter. If you don't need those features, and if you want to use the tools that you are used to, then `fox-suite` is for you. Also, `fox-suite` is extensible by plugins, so if you want to integrate it with an existing tool, it's super simple to create a plugin for it
