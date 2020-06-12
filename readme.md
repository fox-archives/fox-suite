# fox-suite

A sly suite of tools for web development

Do you ever...

- Get tired of setting up common tools and files (`.editorconfig`, `.prettierrc`, `.eslintconfig.js`, `.lint-stagedrc.json`, `husky.json`, etc.) over and over for each project?
- Want sane defaults for all of these tools without having to think?
- Allow to easily change the settings to something more strict if the project ends up being a bit more serious (and you want to focus on correctness rather than iterability)

If you feel similar, this package is likely for you!

Fox suite provides a unified interface for all formatting, linting, and boilerplate needs. It ensures these independent tools behave as epected and match behavior as closely as possible (ex. file globbing, tty output).

- nearly all configuration is placed in `.config`, to prevent clutter of project directory and `package.json`. rather than trying to abstract over this, you can just edit the files directly if you want to change a setting

- `.editorconfig` is the only other config file placed at root

Most of these third party tools are not invoked directly. This would mean we would have to depend on how the third party tool searches the fs for its config file, and probably other things.

`fox.config.js` is a javascript module that specifies a few options

```js
// fox.config.js
export default {
  all: 'cozy',
  monorepo: true,
  plugin: {
    eslint: 'cozy',
    stylelint: 'excessive'
  }
}
```

with each project, you may want to slightly change the configuration, geared towards *developer satisfaction*. for example, the above config lints javascript such that only the most aggregous errors are caught and that most autofixable rules are enabled. if your project suddenly becomes a bit more serious / big, you can always increase the parameter to 'strict', or 'excessive', to give more guarentees

## Usage

#### _there are problems at the moment_, not ready to be used

in one of your projects, install `fox-suite`, then a `preset` ex. (`fox-preset-recommended`). you can also install plugins by themselves with ex. `fox-plugin-eslint`. open up an interactive menu with `fox`

```sh
npm i fox-suite fox-preset-recommended

fox
```


## Options Explanation

## Behavior

- Styling issues are always _warnings_ and auto-fixable
- Syntax issues are usually _errors_ when either auto-fixable or not
  - Exceptions include obviously temporary errors (ex. `no-lone-blocks` (`{}`)) (which may be _off_ or \_warning)
- Extra syntax issues may be _error_ on `NODE_ENV === production` (ex. loggers)

## Options

### Example

```js
// fox.config.js
export default {
  lint: 'off | cozy (default) || strict || excessive',
}
```

### Description

### off

Turns of all functionality

### cozy

Catches code that has / is

- aggregous errors
- non-aggregous auto-fixable errors
- hard to debug / easy to be buggy
- isn't obviously buggy (but is buggy)
- not unobviously buggy (and isn't)
- deprecated syntax

### strict

Catches code that has / is

- not up to best practices
- unecessarily verbose / unecessarily misleading
  - ex. needlessly using `.bind()`
- ambiguous
- essentially similar to what you would expect from `eslint-config-airbnr`, `stylelint-config-standard`, etc. but a bit looser

### excessive

Essentially the same as `strict`, but includes options that are
more annoying than helpfull when coding a project

- ex. forcing default to exist at end of switch

## Who is this for?

This is for the _modern_ web devleoper. This "toolchain" aims to be as lightweight as possible, with respect to the generated code and the mental tax on the developer. For example, we always configure stylelint with `value-no-vendor-prefix` and `color-function-notation` to `modern`, since we assume the output will be piped through `autoprefixer` (probably via `fox-postcss`) if the user actually wants better browser support. Another example, we target to `ES2018` with typescript for `node` projects because we assume the code will be run on a supported / LTS node version. Last example, we target `ESNext` when linting with `eslint` to make things more flexable and useless errors pop up less.

Another thing, we try to be as explicit as possible. For example, if an API allows us, we try to remove any implicit 'commands'. Example, we explicitly set `node_modules/` in `stylelintignore` and prevent `node_modules` from automatically being added by setting an option when invoking stylelint node api. Again this removes mental tax since everything's more explicit

## Support

most of this support is half-baked and not finished

- html-validate
- markdownlint
- ESlint
- Stylelint
- HTMLHint
- htmllint
- html-verify
- prettier
- sort-package-json
- package-json-lint

stuff like commit-convention might be added later

- boilerplating babel, typescript etc configs are probably out of the scope of this project

## Supported Versions

right now we support running on node versions `>=12.17.0 >=v13.14.0 >=14.3.0`, but the version requirements are probably supposed to be lower (but same major versions)

## Building your own modules

it's kind of simple. you have to make sure you fork the template, since everything is setup there already. if you try to set it up yourself right now at the moment, you'll run into troubles (ex. since we load directly from `build/index.js` of package, completely bypassing node's module resolution algorithm). sometime in the future this will probably be improved

```js
import { IPluginExportInfo } from 'fox-types'

// info.ts
export const info: IPluginExportInfo = {
	// used by buildCli. must be the same name as what's in your package.json
	name: 'fox-plugin-htmlhint',
	// used by prompts in fox-suite
	tool: 'Htmlhint',
	toolConfigSchemaHelpUri: 'https://htmlhint.com/docs/user-guide/list-rules',
	// used by prompts in fox-suite and buildCli
	description: 'Lints the HTML files',
	// used by nothing
	descriptionLong: 'Lints HTML files'
}
```

- within your plugin, you must dynamically importing the `import()` syntax (or `require()`)

#### how to make a `preset`

it's similar to other tools. feel free to use esmodules and `export default` since your module will be loaded with the `esm` package. note that you don't want to do this for packages that
look like `stylelint-config-fox`, `eslint-config-fox`, since they're going to be referenced in the config

```js
import { IPresetExportIndex } from 'fox-types'

/** @type {IPresetExportIndex} */
const preset = {
	plugins: [
		require.resolve('fox-plugin-stylelint'),
		require.resolve('fox-plugin-eslint')
	]
}

export default preset
```

### Treatment of `template` files

Files are copied over from your plugin's `template` directly to the project's root directory, templated with `handlebars`. right now, no extra variables are passed to handlebars

When your config is rebuild for consumption by tools, this is how it works. We only rebuild javascript files. javascript files _must_ be placed in the `.config` folder. they will be rebuild to `.config/build` under the same name

## FAQ

### What about Rome?

Rome solves a lot of problems related to tooling interoperability. However, there are some features that Rome will likely not have (such as markdown file linting or easy package release flow). Those seem out of the scope of the project (at least for now). `fox-suite` uses the apis of these somewhat niche tools to help improve your code. Eventually, `fox-suite` will hopefully include a module for easy integration with Rome.

### What about Rush?

Ruch Stack is a great and usefull tool, but I wanted something a but more customizable and lighterweight - something that was able to integrate with existing tooling a bit easier

### I don't like rule X

When you use `prettier`, `stylelint`, `eslint`, etc., there are bound to be rules you don't like. You can just, like, totally override them in `.config/*`. Remember to have the daemon running when doing this so the configuration files get properly regenerated for consumption by existing tooling. You may also have to restart existing tools like webpack dev server, or gulp using file watchers etc.
